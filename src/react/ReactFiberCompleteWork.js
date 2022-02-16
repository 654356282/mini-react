import { createInstance, finalizeInitialChildren } from "./ReactDOMHostConfig";
import { NoFlags } from "./ReactFiberFlags";
import {
  FunctionComponent,
  HostComponent,
  HostRoot,
  HostText,
  IndeterminateComponent,
} from "./ReactWorkTags";

export function completeWork(current, workInProgress) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    case FunctionComponent:
      bubbleProperties(workInProgress);
      return null;
    case HostRoot:
      updateHostContainer(current, workInProgress);
      bubbleProperties(workInProgress);
      return null;
    case HostComponent:
      const type = workInProgress.type;
      if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, type, newProps);
      } else {
        const instance = createInstance(type, newProps, workInProgress);

        appendAllChildren(instance, workInProgress);

        workInProgress.stateNode = instance;
        finalizeInitialChildren(instance, type, newProps);
      }
      bubbleProperties(workInProgress);
      return null;
  }
}

function updateHostComponent(current, workInProgress, type, newProps) {}

function updateHostContainer(current, workInProgress) {
  // Noop
}

// 收集副作用
function bubbleProperties(completedWork) {
  let child = completedWork.child;

  let subtreeFlags = NoFlags;
  while (child !== null) {
    subtreeFlags |= child.subtreeFlags;
    subtreeFlags |= child.flags;
    child = child.sibling;
  }
  completedWork.subtreeFlags |= subtreeFlags;
}

function appendAllChildren(parent, workInProgress) {
  let node = workInProgress.child;
  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      parent.append(workInProgress.stateNode);
    } else if (node.child !== null) {
      node.child.return = node;
      node = node.child;
      continue;
    }
    if (node === workInProgress) return;
    while (node.sibling === null) {
      if (node.return === null || node.return === workInProgress) {
        return;
      }
      node = node.return;
    }
    node.sibling.return = node.return;
    node = node.sibling;
  }
}
