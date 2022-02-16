import { NoFlags } from "./ReactFiberFlags";
import {
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";

export function createHostRootFiber(tag) {
  return createFiber(HostRoot, null);
}

function createFiber(tag, pendingProps) {
  return new FiberNode(tag, pendingProps);
}

function FiberNode(tag, pendingProps) {
  this.tag = tag;
  this.elementType = null;
  // 存储真实节点(但对于rootFIber来说是存储fiberRoot)
  this.stateNode = null;

  this.return = null;
  this.child = null;
  this.sibling = null;

  this.pendingProps = pendingProps;
  this.memoizedProps = null;

  // 存储hooks
  this.memoizedState = null;

  this.updateQueue = null;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;

  this.alternate = null;

  this.deletions = null;
}

export function createWorkInProgress(current, pendingProps) {
  let workInProgress = current.alternate;
  if (workInProgress === null) {
    workInProgress = createFiber(current.tag, pendingProps);
    workInProgress.elementType = current.elementType;
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;

    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
    workInProgress.deletions = null;
  }

  workInProgress.flags = current.flags;
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;

  return workInProgress;
}

export function createFiberFromTypeAndProps(type, pendingProps) {
  let fiberTag = IndeterminateComponent;
  if (typeof type === "string") {
    fiberTag = HostComponent;
  }
  const fiber = createFiber(fiberTag, pendingProps);
  fiber.elementType = type;
  fiber.type = type;
  return fiber;
}

export function createFiberFromElement(element) {
  const { type, props: pendingProps } = element;
  const fiber = createFiberFromTypeAndProps(type, pendingProps);
  return fiber;
}

export function createFiberFromText(content) {
  const fiber = createFiber(HostText, content);
  return fiber;
}
