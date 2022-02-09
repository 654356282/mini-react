# React

## react使用方式

* 常用方式

```js
ReactDOM.render(<App/>, document.getELementById('root'))
```

* 面向未来(React18推荐使用方式)
  
```js
const container = document.getElementById('root)
const root = ReactDOM.createRoot(container)
root.render(<App/>)
```



## 来写个伪劣版的`react`

### `<App/>`这段代码帮我们编译成了什么？

`console.log(<div>1</div>)`控制台输出

![image-20220131170229542](/Users/wenghongtian/Library/Application Support/typora-user-images/image-20220131170229542.png)

那么如果子元素内有两个呢？

`console.log(<div><span/><span/></div>)`

![image-20220131170404675](/Users/wenghongtian/Library/Application Support/typora-user-images/image-20220131170404675.png)

可以知道如果自元素为两个，会被react处理成一个数组。

`react`是使用`babel`帮我们编译jsx元素的，那么他被编译后又是长什么样呢？

![image-20220131170718994](/Users/wenghongtian/Library/Application Support/typora-user-images/image-20220131170718994.png)

### 下面我们来实现一下`React.createElement`这个方法

我们先排除一些暂时没用到的属性，例如：`key`, `ref`

```js
const REACT_ELEMENT_TYPE = Symbol.for('REACT_ELEMENT_TYPE')

const RESERVED_PROPS = {
  key: true, 
  ref: true,
}

function ReactElement(type, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    props
  }
}

export function createElement(type, config, ...children) {
  let propName
  const props = {};

  if (config) {
    for(propName in config) {
      if(!RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName]
      }
    }
  }

  const childrenLength = children.length
  if(childrenLength === 1) {
    props.children = children[0]
  } else if(childrenLength > 1) {
    props.children = children
  }

  return ReactElement(type, props)
}

export default {
  createElement
}

```

这下我们属于自己编译jsx的方法已经有了[旺柴]，看看长什么样

* 一个子节点

```js
console.log(
  <div>
    <span></span>
  </div>
);
```

![image-20220131171522722](/Users/wenghongtian/Library/Application Support/typora-user-images/image-20220131171522722.png)

* 多个子节点

  ```js
  console.log(
    <div>
      <span></span>
      <span></span>
    </div>
  );
  ```

  ![image-20220131171619091](/Users/wenghongtian/Library/Application Support/typora-user-images/image-20220131171619091.png)

### `jsx`编译过后的结构我们得到了，那怎么把它渲染到视图上呢？

* 来个简单粗暴的

  ```js
  // react.js
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
  
  // react-dom.js
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
  
  
  // ReactSymbol.js
  export const REACT_ELEMENT_TYPE = Symbol.for('REACT_ELEMENT_TYPE')
  
  // main.js
  import React from "./react/react";
  import ReactDOM from "./react/react-dom";
  
  const App = () => {
    return <div>app</div>;
  };
  
  ReactDOM.render(
    <div
      onClick={() => {
        console.log("hehe");
      }}
    >
      <div style={{ backgroundColor: "red" }}>
        class<span>1</span>
      </div>
    </div>,
    document.getElementById("root")
  );
  
  ```

* 来个高仿版的

  首先我们先实现一个`createRoot`方法

```js
const ConcurrentRoot = 1;
const NoFlags = 0b0;

export function createRoot(container) {
  const root = createContainer(container, ConcurrentRoot);
  markContainerAsRoot(root.current, container);
  return new ReactDOMRoot(root);
}

const internalContainerInstanceKey = "__reactContainer$" + randomKey;
function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}

// 创建FiberRoot
function createContainer(containerInfo, tag) {
  return createFiberRoot(containerInfo, tag);
}

function FiberRootNode(containerInfo, tag) {
  this.tag = tag;
  this.containerInfo = containerInfo;
  this.current = null;
  this.finishedWork = null;
}

function createFiberRoot(containerInfo, tag) {
  const root = new FiberRootNode(containerInfo, tag);

  // 初始化一个rootFiber
  const uninitializedFiber = createHostRootFiber(tag);
  // 初始化fiberRoot的current指向
  root.current = uninitializedFiber;
  // 初始化rootFiber的stateNode指向
  uninitializedFiber.stateNode = root;
}

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

```

> 总结：
>
> 创建了`fiberRoot`和一个`rootFiber`并初始化了其指向，同时将该`container`和当前视图中的`fiberRoot`进行关联

接下来，我们就需要去实现`ReactDOMRoot`原型上的`render`方法了



## 浅谈react如何发起一次调度

`react`将`scheduler`单独抽离成了一个包，可以独立承担任务调度的职责，使用时，只需要将任务和任务的优先级告诉`scheduler`，它就能帮你安排任务、管理任务。

对于多个任务，它会先执行优先级高的。对于单个任务，它会有节制地去执行。换句话说，线程只有一个，它不会一直占用着线程去执行任务。而是执行一会，中断一下，如此往复。用这样的模式，来避免一直占用有限的资源执行耗时较长的任务，解决用户操作时页面卡顿的问题，实现更快的响应。

### 基本概念

`react`怎么去实现这个行为呢？	

​	为此`react`引入了**任务优先级**、**时间片**的概念。

* 任务优先级

  让任务按照自身的紧急程度排序，这样可以让优先级最高的任务最先被执行到。（最小堆排序算法）

* 时间片

  单个任务在这一帧内最大的执行时间，任务一旦执行时间超过时间片，则会被打断，有节制地执行任务。这样可以保证页面不会因为任务连续执行的时间过长而产生卡顿。



