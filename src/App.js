import React, { useRef, useEffect } from "react";
import "./App.css";
import Canvas from "./components/Canvas";
import Figures from "./components/Figures";


function App() {
  return (
    <div className="App">
      <h2>Canvas Drag'n'Drop</h2>
      <div className="wrapper" id="noRightBorder">
        <p className="sectionTitle">Figures</p>
        <Figures />
      </div>
      <div className="wrapper">
        <p className="sectionTitle">Canvas</p>
        <Canvas />
      </div>
    </div>
  );
}

export default App;
