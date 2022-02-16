import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "./ReactDOMHostConfig";
import { Placement } from "./ReactFiberFlags";
import { renderWithHooks } from "./ReactFiberHooks";
import { cloneUpdateQueue, processUpdateQueue } from "./ReactUpdateQueue";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  IndeterminateComponent,
} from "./ReactWorkTags";

let didReceiveUpdate = false;

export function beginWork(current, workInProgress) {
  if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (oldProps !== newProps) {
      didReceiveUpdate = true;
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case IndeterminateComponent:
      return mountIndeterminateComponent(
        current,
        workInProgress,
        workInProgress.type
      );
    case HostComponent:
      return updateHostComponent(current, workInProgress);
  }
}

function updateHostComponent(current, workInProgress) {
  const type = workInProgress.type;
  const nextProps = workInProgress.pendingProps;
  const prevProps = current !== null ? current.memoizedProps : null;

  let nextChildren = nextProps.children;
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function mountIndeterminateComponent(_current, workInProgress, Component) {
  const props = workInProgress.pendingProps;
  const value = renderWithHooks(null, workInProgress, Component, props);
  workInProgress.tag = FunctionComponent;
  reconcileChildren(null, workInProgress, value);
  return workInProgress.child;
}

function updateHostRoot(current, workInProgress) {
  const updateQueue = workInProgress.updateQueue;

  const nextProps = workInProgress.pendingProps;
  const prevState = workInProgress.memoizedState;
  const prevChildren = prevState.element;
  cloneUpdateQueue(current, workInProgress);
  processUpdateQueue(workInProgress, nextProps, null);

  const nextState = workInProgress.memoizedState;

  const nextChildren = nextState.element;

  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

function reconcileChildren(current, workInProgress, nextChildren) {
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren
    );
  }
}
