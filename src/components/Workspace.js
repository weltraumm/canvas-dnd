/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

const PINK = "#fb3291";
const YELLOW = "#ffe533";
const SQUARE_TYPE = "square";
const CIRCLE_TYPE = "circle";
const SQUARE_SIDE = 130;
const CIRCLE_RADIUS = 65;
const IS_INITIAL = true;
const NOT_INITIAL = false;

const drawBorder = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.moveTo(251, 0);
  ctx.lineTo(251, 700);
  ctx.stroke();
  ctx.closePath();
};

const getSquare = (x, y, initial) => {
  return {
    x,
    y,
    initial,
    choosen: false,
    side: SQUARE_SIDE,
    type: SQUARE_TYPE,
    color: YELLOW,
  };
};

const getCircle = (x, y, initial) => {
  return {
    x,
    y,
    initial,
    choosen: false,
    radius: CIRCLE_RADIUS,
    type: CIRCLE_TYPE,
    color: PINK,
  };
};

const draw = (figure, ctx) => {
  ctx.beginPath();
  ctx.fillStyle = figure.color;
  switch (figure.type) {
    case SQUARE_TYPE:
      ctx.fillRect(figure.x, figure.y, figure.side, figure.side);
      break;
    case CIRCLE_TYPE:
      ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
      ctx.fill();
      break;
    default:
  }
  ctx.closePath();
};

const drawStroke = (figure, ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "#272727";
  ctx.lineWidth = 3;
  if (figure === null) return;
  switch (figure.type) {
    case SQUARE_TYPE:
      ctx.strokeRect(figure.x, figure.y, figure.side, figure.side);
      break;
    case CIRCLE_TYPE:
      ctx.arc(figure.x, figure.y, figure.radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    default:
      break;
  }
  ctx.closePath();
};

const Workspace = () => {
  const [figureCollection, setFigureCollection] = useState([]);
  const [choosenFigure, setChoosenFigure] = useState(null);

  const canvas = useRef();
  let ctx = null;

  const previousFigureCollection = usePrevious(figureCollection);
  const previousChoosenFigure = usePrevious(choosenFigure);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    if (previousChoosenFigure !== choosenFigure) {
      ctx.beginPath();
      ctx.clearRect(0, 0, 900, 700);
      drawBorder(ctx);
      figureCollection.map((d) => {
        draw(d, ctx);
      });
      drawStroke(choosenFigure, ctx);
      ctx.closePath();
    }
  }, [choosenFigure]);

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    drawBorder(ctx);
    const initialSquare = getSquare(60, 60, IS_INITIAL);
    const initialCircle = getCircle(125, 315, IS_INITIAL);
    setFigureCollection([...figureCollection, initialSquare, initialCircle]);
  }, []);

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
    if (previousFigureCollection) {
      if (previousFigureCollection.length < figureCollection.length) {
        const diff = figureCollection.filter(
          (i) => previousFigureCollection.indexOf(i) < 0
        );
        ctx.beginPath();
        diff.map((d) => {
          draw(d, ctx);
        });
        ctx.closePath();
      } else if (previousFigureCollection.length > figureCollection.length) {
        ctx.beginPath();
        ctx.clearRect(0, 0, 900, 700);
        figureCollection.map((d) => {
          draw(d, ctx);
        });
        ctx.closePath();
      }
    }
  }, [figureCollection]);

  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;
  let onCanvas = false;

  const hitBox = (x, y) => {
    let isTarget = null;
    for (let i = 0; i < figureCollection.length; i++) {
      const box = figureCollection[i];
      if (box.type === SQUARE_TYPE) {
        if (
          x >= box.x &&
          x <= box.x + box.side &&
          y >= box.y &&
          y <= box.y + box.side
        ) {
          if (!box.initial) {
            dragTarget = box;
            isTarget = true;
            break;
          }
        }
      }
      if (box.type === CIRCLE_TYPE) {
        if (
          (x - box.x) * (x - box.x) + (y - box.y) * (y - box.y) <=
          box.radius * box.radius
        ) {
          if (!box.initial) {
            dragTarget = box;
            isTarget = true;
            break;
          }
        }
      }
    }

    return isTarget;
  };

  const isInitial = (x, y) => {
    let initialWasFound = false;
    let somethingIsUpperInitial = false;
    for (let i = 0; i < figureCollection.length; i++) {
      const box = figureCollection[i];
      if (box.type === SQUARE_TYPE) {
        if (
          x >= box.x &&
          x <= box.x + box.side &&
          y >= box.y &&
          y <= box.y + box.side
        ) {
          if (box.initial) {
            initialWasFound = true;
          } else {
            somethingIsUpperInitial = true;
            break;
          }
        }
      }
      if (box.type === CIRCLE_TYPE) {
        if (
          (x - box.x) * (x - box.x) + (y - box.y) * (y - box.y) <=
          box.radius * box.radius
        ) {
          if (box.initial) {
            initialWasFound = true;
          } else {
            somethingIsUpperInitial = true;
            break;
          }
        }
      }
    }
    if (somethingIsUpperInitial) {
      return false;
    } else {
      return initialWasFound;
    }
  };

  const initialType = (x, y) => {
    let initialType = null;
    for (let i = 0; i < figureCollection.length; i++) {
      const box = figureCollection[i];
      if (box.type === SQUARE_TYPE) {
        if (
          x >= box.x &&
          x <= box.x + box.side &&
          y >= box.y &&
          y <= box.y + box.side
        ) {
          initialType = SQUARE_TYPE;
          break;
        }
      }
      if (box.type === CIRCLE_TYPE) {
        if (
          (x - box.x) * (x - box.x) + (y - box.y) * (y - box.y) <=
          box.radius * box.radius
        ) {
          initialType = CIRCLE_TYPE;
          break;
        }
      }
    }
    return initialType;
  };

	const handleMouseDown = (e) => {
    startX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    if (startX > 251) {
      onCanvas = true;
    }
    isDown = hitBox(startX, startY);

    if (isInitial(startX, startY)) {
      let oneMoreFigure = null;
      switch (initialType(startX, startY)) {
        case SQUARE_TYPE:
          oneMoreFigure = getSquare(60, 60, NOT_INITIAL);
          break;
        case CIRCLE_TYPE:
          oneMoreFigure = getCircle(125, 315, NOT_INITIAL);
          break;
        default:
          break;
      }
      setFigureCollection([...figureCollection, oneMoreFigure]);
      dragTarget = oneMoreFigure;
    }
    setChoosenFigure(dragTarget);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    const mouseX = parseInt(e.nativeEvent.offsetX - canvas.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvas.current.clientTop);
    const dx = mouseX - startX;
    const dy = mouseY - startY;
    startX = mouseX;
		startY = mouseY;
			dragTarget.x += dx;
      dragTarget.y += dy;		
    ctx.beginPath();
    ctx.clearRect(0, 0, 900, 700);
    figureCollection.map((d) => {
      draw(d, ctx);
    });
		drawBorder(ctx);
		drawStroke(dragTarget, ctx);
    ctx.closePath();

    if (onCanvas && mouseX < 251) {
      handleMouseUp(e);
    }
  };

  const handleMouseUp = (e) => {
    dragTarget = null;
    isDown = false;
  };

  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

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
