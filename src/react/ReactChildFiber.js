import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { Placement } from "./ReactFiberFlags";
import { REACT_ELEMENT_TYPE } from "./ReactSymbol";

function ChildReconciler(shouldTrackSideEffects) {
  function placeSingleChild(newFiber) {
    if (shouldTrackSideEffects && newFiber.alternate === null) {
      newFiber.flags |= Placement;
    }
    return newFiber;
  }

  function reconcileSingleElement(returnFiber, currentFirstChild, element) {
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  function reconcileSingleTextNode(
    returnFiber,
    currentFirstChild,
    textContent
  ) {
    const created = createFiberFromText(textContent);
    created.return = returnFiber;
    return created;
  }

  function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild)
          );
      }
    }

    if (
      (typeof newChild === "string" && newChild !== "") ||
      typeof newChild === "number"
    ) {
      return placeSingleChild(
        reconcileSingleTextNode(returnFiber, currentFirstChild, "" + newChild)
      );
    }

    return null;
  }

  return reconcileChildFibers;
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
