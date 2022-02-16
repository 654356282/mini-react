import { createElement, setInitialProperties } from "./ReactDOMComponent";
import { precacheFiberNode } from "./ReactDOMComponentTree";

export function shouldSetTextContent(type, props) {
  return (
    typeof props.children === "string" || typeof props.children === "number"
  );
}

export function createInstance(type, props) {
  const domElement = createElement(type);
  return domElement;
}

export function finalizeInitialChildren(domElement, type, props) {
  setInitialProperties(domElement, type, props);
}
