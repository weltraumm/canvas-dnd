import React from "react";
import "./App.css";
import Workspace from "./components/Workspace";


function App() {
  return (
    <div className="App">
      <h2>Canvas Drag'n'Drop</h2>
      <p className="titleSection figureTitle"><b>Figures</b></p>
      <p className="titleSection canvasTitle"><b>Canvas</b></p>
      <br />
      <div className="wrapper">
        <Workspace />
      </div>
    </div>
  );
}

export default App;
