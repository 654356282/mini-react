import { REACT_ELEMENT_TYPE } from "./ReactSymbol";

const RESERVED_PROPS = {
  key: true,
  ref: true,
};

export function createElement(type, config, ...children) {
  let propName;
  const props = {};

  if (config) {
    for (propName in config) {
      if (!RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  const childrenLength = children.length;
  if (childrenLength === 1) {
    props.children = children[0];
  } else if (childrenLength > 1) {
    props.children = children;
  }

  return ReactElement(type, props);
}

function ReactElement(type, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    props,
  };
}

export default {
  createElement,
};
