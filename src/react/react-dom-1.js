export function render(element, container) {
  const appStateNode = document.createElement(element.type);
  renderChildren(element.props.children, appStateNode);
  setProperties(appStateNode, element.props);
  container.appendChild(appStateNode);
}

function setProperties(node, props) {
  for (let propName in props) {
    if (propName === "children") {
      continue;
    }

    if (isEvent(propName)) {
      node[propName.toLowerCase()] = props[propName];
      continue;
    }
    if (propName === "className") {
      node.setAttributes("class", props[propName]);
    } else if (propName === "style") {
      const style = props[propName];
      Object.keys(style).forEach((styleName) => {
        node.style[styleName] = style[styleName];
      });
      continue;
    } else {
      node.setAttribute(propName, props[propName]);
    }
  }
}

function isEvent(propName) {
  return propName.startsWith("on");
}

function renderChildren(children, parentStateNode) {
  if (!children) return;

  if (typeof children === "string") {
    const textNode = createTextNode(children);
    parentStateNode.appendChild(textNode);
  }

  if (typeof children === "object" && !Array.isArray(children)) {
    const node = createElement(children.type);
    setProperties(node, children.props);
    parentStateNode.appendChild(node);
    renderChildren(children.props.children, node);
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      renderChildren(child, parentStateNode);
    });
  }
}

function createElement(tag) {
  return document.createElement(tag);
}

function createTextNode(text) {
  return document.createTextNode(text);
}

export default {
  render,
};
