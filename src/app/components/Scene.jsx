'use client';

import { useEffect, useRef } from 'react';
import useWindow from './useWindow';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const PaintScene = () => {
  const { dimension } = useWindow();
  const canvasRef = useRef(null);
  const prevRef = useRef(null);

  const lerp = (x, y, a) => x * (1 - a) + y * a;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !dimension.width || !dimension.height) return;
    canvas.width = dimension.width;
    canvas.height = dimension.height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, dimension.width, dimension.height);
    ctx.globalCompositeOperation = 'destination-out';
    prevRef.current = null;
  }, [dimension.width, dimension.height]);

  const draw = (x, y, radius = 60) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const paintStroke = (clientX, clientY, movementX = 0, movementY = 0) => {
    const { width, height } = dimension;
    if (!width || !height) return;
    const x = clamp(clientX, 0, width);
    const y = clamp(clientY, 0, height);
    const strokeSteps = Math.max(Math.abs(movementX), Math.abs(movementY)) / 8 || 1;

    if (prevRef.current) {
      const { x: prevX, y: prevY } = prevRef.current;
      for (let i = 0; i < strokeSteps; i += 1) {
        const t = i / strokeSteps;
        const targetX = lerp(prevX, x, t);
        const targetY = lerp(prevY, y, t);
        draw(targetX, targetY, 55);
      }
    } else {
      draw(x, y, 55);
    }
    prevRef.current = { x, y };
  };

  const handleMouseMove = (event) => {
    paintStroke(event.clientX, event.clientY, event.movementX, event.movementY);
  };

  const handleTouchMove = (event) => {
    if (!event.touches || event.touches.length === 0) return;
    const touch = event.touches[0];
    event.preventDefault();
    const prev = prevRef.current || { x: touch.clientX, y: touch.clientY };
    paintStroke(touch.clientX, touch.clientY, touch.clientX - prev.x, touch.clientY - prev.y);
  };

  const handleLeave = () => {
    prevRef.current = null;
  };

  return (
    <div className="absolute inset-0 z-30">
      {dimension.width === 0 && <div className="absolute inset-0 bg-black" />}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-none sm:cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleLeave}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) {
            prevRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          }
        }}
      />
    </div>
  );
};

export default PaintScene;
