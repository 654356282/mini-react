import { shouldSetTextContent } from "./ReactDOMHostConfig";

export function createElement(type) {
  return document.createElement(type);
}

export function setInitialProperties(domElement, tag, rawProps) {
  setInitialDOMProperties(tag, domElement, rawProps);
}

function setInitialDOMProperties(tag, domElement, nextProps) {
  for (const propKey in nextProps) {
    if (!nextProps.hasOwnProperty(propKey)) {
      continue;
    }
    const nextProp = nextProps[propKey];
    if (propKey === "style") {
      setValueForStyles(domElement, nextProp);
    } else if (propKey === "children") {
      if (typeof nextProp === "string" || typeof nextProp === "number") {
        setTextContent(domElement, nextProp);
      }
    } else if (isEvent(propKey)) {
      domElement[propKey.toLowerCase()] = nextProp;
    } else {
      domElement.setAttribute(propKey, nextProp);
    }
  }
}

function isEvent(propName) {
  return propName.startsWith("on");
}

function setValueForStyles(node, styles) {
  const style = node.style;
  for (let styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }
    const styleValue = styles[styleName];
    style[styleName] = styleValue;
  }
}

function setTextContent(node, text) {
  node.textContent = text;
}
