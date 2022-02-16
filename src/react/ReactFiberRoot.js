import { createHostRootFiber } from "./ReactFiber";
import { initializeUpdate } from "./ReactUpdateQueue";

export function FiberRootNode(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.current = null;
  this.finishedWork = null;
}

export function createFiberRoot(containerInfo, tag) {
  const root = new FiberRootNode(containerInfo, tag);

  const uninitializedFiber = createHostRootFiber(tag);
  root.current = uninitializedFiber;
  uninitializedFiber.stateNode = root;
  uninitializedFiber.memoizedState = {
    element: null,
  };

  initializeUpdate(uninitializedFiber);

  return root;
}
