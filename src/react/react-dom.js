import { ConcurrentRoot } from "./ReactRootTag";
import { createFiberRoot } from "./ReactFiberRoot";
import { markContainerAsRoot } from "./ReactDOMComponentTree";
import { updateContainer } from "./ReactFiberReconciler";

export function createRoot(container) {
  const root = createContainer(container, ConcurrentRoot);

  markContainerAsRoot(root.current, container);
  return new ReactDOMRoot(root);
}

function createContainer(containerInfo, tag) {
  return createFiberRoot(containerInfo, tag);
}

function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}
ReactDOMRoot.prototype.render = function (children) {
  const root = this._internalRoot;


  updateContainer(children, root);
};



export default {
  createRoot,
};
