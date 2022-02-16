let currentlyRenderingFiber = null;

export function renderWithHooks(current, workInProgress, Component, props) {
  currentlyRenderingFiber = workInProgress;
  workInProgress.memoizedState = null;
  workInProgress.updateQueue = null;

  const children = Component(props);

  currentlyRenderingFiber = null;
  return children;
}
