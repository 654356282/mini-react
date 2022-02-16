import { NoLanes } from "./ReactFiberLanes";

export const UpdateState = 0;

export function initializeUpdate(fiber) {
  const queue = {
    baseState: fiber.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      lanes: NoLanes,
    },
    effects: null,
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = {
    tag: UpdateState,
    payload: null,
    callback: null,

    next: null,
  };
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  if (updateQueue === null) return;

  const sharedQueue = updateQueue.shared;

  // 这是最后环形链表中的最后一个节点
  const pending = sharedQueue.pending;
  if (pending === null) {
    update.next = update;
  } else {
    // 将当前更新添加到环形链表中，当作最后一个节点
    update.next = pending.next;
    pending.next = update;
  }
  sharedQueue.pending = update;
}

export function cloneUpdateQueue(current, workInProgress) {
  const queue = workInProgress.updateQueue;
  const currentQueue = current.updateQueue;
  if (queue === currentQueue) {
    const clone = { ...currentQueue };
    workInProgress.updateQueue = clone;
  }
}

export function processUpdateQueue(workInProgress, props, instance) {
  const queue = workInProgress.updateQueue;

  let { firstBaseUpdate, lastBaseUpdate } = queue;

  let pendingQueue = queue.shared.pending;
  if (pendingQueue !== null) {
    queue.shared.pending = null;
    const lastPendingUpdate = pendingQueue;
    const firstPendingUpdate = lastPendingUpdate.next;
    // 切断环形链表
    lastPendingUpdate.next = null;
    if (lastBaseUpdate === null) {
      firstBaseUpdate = firstPendingUpdate;
    } else {
      lastBaseUpdate.next = firstPendingUpdate;
    }
    lastBaseUpdate = lastPendingUpdate;

    const current = workInProgress.alternate;
    if (current !== null) {
      const currentQueue = current.updateQueue;
      const currentLastBaseUpdate = currentQueue.lastBaseUpdate;
      if (currentLastBaseUpdate === null) {
        currentQueue.firstBaseUpdate = firstPendingUpdate;
      } else {
        currentLastBaseUpdate.next = firstPendingUpdate;
      }
      currentQueue.lastBaseUpdate = lastPendingUpdate;
    }
  }

  if (firstBaseUpdate !== null) {
    let newState = queue.baseState;

    let newBaseState = null;
    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;

    let update = firstBaseUpdate;
    do {
      if (newLastBaseUpdate === null) {
        newFirstBaseUpdate = newLastBaseUpdate = update;
        newBaseState = newState;
      } else {
        newLastBaseUpdate = newLastBaseUpdate.next = update;
      }

      newState = getStateFromUpdate(
        workInProgress,
        queue,
        update,
        newState,
        props,
        instance
      );
      update = update.next;
      if (update === null) {
        break;
      }
    } while (true);

    if (newLastBaseUpdate === null) {
      newBaseState = newState;
    }

    queue.baseState = newBaseState;
    queue.firstBaseUpdate = newFirstBaseUpdate;
    queue.lastBaseUpdate = newLastBaseUpdate;

    workInProgress.memoizedState = newState;
  }
}

function getStateFromUpdate(
  workInProgress,
  queue,
  update,
  prevState,
  nextProps,
  instance
) {
  switch (update.tag) {
    case UpdateState:
      const payload = update.payload;
      let partialState = payload;
      return Object.assign({}, prevState, partialState);
  }
}
