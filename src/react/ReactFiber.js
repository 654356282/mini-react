import { NoFlags } from "./ReactFiberFlags";
import { HostRoot } from "./ReactWorkTags";

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
  this.sibiling = null;

  this.pendingProps = null;
  this.memoizedProps = null;

  this.flags = NoFlags;
  this.subtreeFlags = NoFlags;

  this.alternate = null;
}
