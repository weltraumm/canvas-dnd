import "./App.css";

const Title = () => {
  return <h2 className="Title">Canvas Drag'n'Drop</h2>;
};

const Figures = () => {
	return (
    <div className="wrapper" id="noRightBorder">
        <p className="sectionTitle">Figures</p>
        <canvas width={250} height={700} />
    </div>
  );

	
};

const Canvas = () => {

	return (
    <div className="wrapper">
      <p className="sectionTitle">Canvas</p>
      <canvas width={650} height={700} />
    </div>
  );
};


function App() {
  return (
    <div className="App">
			<Title />
			<Figures />
			<Canvas />
    </div>
  );
}

export default App;
