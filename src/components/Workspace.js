/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

const drawBorder = (ctx) => {
  ctx.beginPath();
  ctx.moveTo(251, 0);
  ctx.fillStyle = "black";
  ctx.lineTo(251, 700);
  ctx.stroke();
  ctx.closePath();
};

const getSquare = (x, y) => {
  return {
    x,
    y,
    side: 130,
    type: "square",
    color: "#ffe533",
  };
};

const getCircle = (x, y) => {
  return {
    x,
    y,
    radius: 65,
    type: "circle",
    color: "#fb3291",
  };
};

const draw = (figure, ctx) => {
  ctx.beginPath();
  switch (figure.type) {
    case "square":
      ctx.fillStyle = figure.color;
      ctx.fillRect(figure.x, figure.y, figure.side, figure.side);
      break;
    case "circle":
      ctx.fillStyle = figure.color;
      ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
    default:
  }
};

const Workspace = () => {
  const [figureCollection, setFigureCollection] = useState([]);
  const canvas = useRef();
  let ctx = null;
  const previousFigureCollection = usePrevious(figureCollection);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    drawBorder(ctx);
    const initialSquare = getSquare(60, 60);
    const initialCircle = getCircle(125, 315);
    const otherCircle = getCircle(125, 505);
    setFigureCollection([
      ...figureCollection,
      initialSquare,	
      initialCircle,
      otherCircle,
    ]);
  }, []);

  useEffect(() => {
    if (previousFigureCollection) {
      if (previousFigureCollection.length < figureCollection.length) {
        //отрисовать элемент
        const diff = figureCollection.filter(
          (i) => previousFigureCollection.indexOf(i) < 0
        );
        ctx = canvas.current.getContext("2d");
        diff.map((d) => {
          draw(d, ctx);
        });
      } else if (previousFigureCollection.length > figureCollection.length) {
        //удалить элемент с канваса
        ctx = canvas.current.getContext("2d");
        ctx.clearRect(0, 0, 900, 700);
        figureCollection.map((d) => {
          draw(d, ctx);
        });
      }
    }
  }, [figureCollection]);
  //---------------------------------------------------------------------------
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;
  //---------------------------------------------------------------------------
  // identify the click event in the rectangle
  const hitBox = (x, y) => {
    let isTarget = null;
    console.log("hitBox started");
    for (let i = 0; i < figureCollection.length; i++) {
      const box = figureCollection[i];
      console.log("box.type", box.type);
      switch (box.type) {
        case "square":
          if (
            x >= box.x &&
            x <= box.x + box.side &&
            y >= box.y &&
            y <= box.y + box.side
					) {
						          console.log("свитч решил что это сквеир", box.side);

            dragTarget = box;
            isTarget = true;
            //break;
          }
          break;
        case "circle":
          if ((x - box.x) ^ 2 + (y - box.y) ^ 2 <= box.radius ^ 2) {
						dragTarget = box;
						          console.log("свитч решил что это сёркл", box.radius);

            isTarget = true;
            //break;
          }
          break;
        default:
			}
			break;
		}
    return isTarget;
  };
  //------------------------------------------------------------------------------
  const handleMouseDown = (e) => {
    console.log("mouse down copmleted");
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    isDown = hitBox(startX, startY);
  };
  const handleMouseMove = (e) => {
    console.log("mouse move copmleted");
    if (!isDown) return;

    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    dragTarget.x += dx;
    dragTarget.y += dy;
    //draw();
    //ctx.clearRect(0, 0, 900, 700);
    figureCollection.map((d) => {
      draw(d, ctx);
    });
  };
  const handleMouseUp = (e) => {
    console.log("mouse up copmleted");
    dragTarget = null;
    isDown = false;
  };
  const handleMouseOut = (e) => {
    console.log("mouse out copmleted");
    handleMouseUp(e);
  };
  //------------------------------------------------------------------------------
  return (
    <canvas
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      ref={canvas}
      width={900}
      height={700}
    />
  );
};

export default Workspace;
