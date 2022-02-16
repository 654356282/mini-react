import React from "./react/react";
import ReactDOM from "./react/react-dom";

// const App = () => {
//   return <div>app</div>;
// };

// ReactDOM.render(
//   <div
//     onClick={() => {
//       console.log("hehe");
//     }}
//   >
//     <div style={{ backgroundColor: "red" }}>
//       class<span>1</span>
//     </div>
//   </div>,
//   document.getElementById("root")
// );

const App = () => {
  return <div><span>app</span></div>
}

const container = (document.getElementById('root'))
ReactDOM.createRoot(container).render(<App/>)

