import { beginWork } from "./ReactFiberBeginWork";
import { createWorkInProgress } from "./ReactFiber";
import { completeWork } from "./ReactFiberCompleteWork";

export const NoContext = 0b0;
const RenderContext = /*                */ 0b0010;
const CommitContext = /*                */ 0b0100;

const RootIncomplete = 0;
const RootCompleted = 5;

let executionContext = NoContext;
let root = null;
let workInProgress = null;
let workInProgressRoot = null;

let workInProgressRootExitStatus = RootIncomplete;

export function scheduleUpdateOnFiber(fiber) {
  const root = fiber.stateNode;
  if (root === null) return null;

  ensureRootIsScheduled(root);
}

function ensureRootIsScheduled(root) {
  performConcurrentWorkOnRoot(root);
}

function performConcurrentWorkOnRoot(root) {
  flushPassiveEffects();

  const exitStatus = renderRootSync(root);
  const finishedWork = root.current.alternate;
  if (exitStatus === RootCompleted) {
    root.finishedWork = finishedWork;
  }
  finishConcurrentRender(root, exitStatus) {

  }
}

function finishConcurrentRender(root, exitStatus) {
  switch(exitStatus) {
    case RootCompleted:
      commitRoot(root)
  }
}

function commitRoot(root) {
  commitRootImpl(root)
}

function commitRootImpl(root) {
  const finishedWork = root.finishedWork

  root.finishedWork = null

  if(finishedWork.subtreeFlags & Passive)
}

// 跟useEffect相关
export function flushPassiveEffects() {}

function renderRootSync(root) {
  const preExecutionContext = executionContext;
  executionContext |= RenderContext;

  if (workInProgressRoot !== root) {
    // 初始化workInProgress和workInProgressRoot
    prepareFreshStack(root);
  }

  workLoopSync();

  workInProgressRoot = null;
  return workInProgressRootExitStatus;
}

function prepareFreshStack(root) {
  root.finishedWork = null;

  workInProgressRoot = root;
  workInProgress = createWorkInProgress(root.current, null);
  workInProgressRootExitStatus = RootIncomplete;
}

function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  const current = unitOfWork.alternate;

  let next;
  next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;

  if (next === null) {
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;

    const next = completeWork(current, completedWork);

    if (next !== null) {
      workInProgress = next;
      return;
    }
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);

  if (workInProgressRootExitStatus === RootIncomplete) {
    workInProgressRootExitStatus = RootCompleted;
  }
}
