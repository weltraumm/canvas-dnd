import React, { useEffect, useRef } from "react";

const drawSquare = (ctx) => {
  ctx.fillStyle = "#ffe533";
  ctx.fillRect(60, 60, 130, 130);
};

const drawCircle = (ctx) => {
  ctx.fillStyle = "#fb3291";
  ctx.arc(125, 315, 65, 0, 2 * Math.PI);
  ctx.fill();
};

const Figures = () => {
  const canvas = useRef();
  let ctx = null;

  useEffect(() => {
    ctx = canvas.current.getContext("2d");
  }, []);

  useEffect(() => {
    drawSquare(ctx);
    drawCircle(ctx);
  });

  return (
    <canvas
      ref={canvas}
      width={250}
      height={700}
    />
  );
};

export default Figures;
