const internalContainerInstanceKey = "__reactContainer$" + randomKey;

export function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}
