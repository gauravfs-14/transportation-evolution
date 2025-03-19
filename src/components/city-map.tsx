"use client";

import { useEffect, useRef } from "react";

// This is a simplified city map visualization component
export default function CityMap({ progress = 0 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw city grid
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    // Horizontal streets
    for (let y = 50; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical streets
    for (let x = 50; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw main roads
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 6;

    // Horizontal main roads
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Vertical main roads
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw buildings
    ctx.fillStyle = "#9ca3af";

    // Only draw buildings based on scroll progress
    const buildingCount = Math.floor(progress * 50);

    for (let i = 0; i < buildingCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 5 + Math.random() * 15;

      // Don't draw buildings on roads
      if (Math.abs(x - width / 2) < 10 || Math.abs(y - height / 2) < 10)
        continue;

      ctx.fillRect(x, y, size, size);
    }

    // Draw transportation elements based on progress
    if (progress > 0.4) {
      // Draw cars
      const carCount = Math.min(10, Math.floor(progress * 20));
      for (let i = 0; i < carCount; i++) {
        const onHorizontal = Math.random() > 0.5;
        const pos = Math.random() * width;

        ctx.fillStyle = "#FF6B6B";
        if (onHorizontal) {
          ctx.fillRect(pos, height / 2 - 3, 8, 6);
        } else {
          ctx.fillRect(width / 2 - 3, pos, 6, 8);
        }
      }
    }

    if (progress > 0.6) {
      // Draw bus routes
      ctx.strokeStyle = "#4ECDC4";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);

      ctx.beginPath();
      ctx.moveTo(width / 4, 0);
      ctx.lineTo(width / 4, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, height / 4);
      ctx.lineTo(width, height / 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo((3 * width) / 4, 0);
      ctx.lineTo((3 * width) / 4, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, (3 * height) / 4);
      ctx.lineTo(width, (3 * height) / 4);
      ctx.stroke();

      ctx.setLineDash([]);
    }

    if (progress > 0.8) {
      // Draw bike paths
      ctx.strokeStyle = "#06D6A0";
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 2]);

      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * height) / 5);
        ctx.lineTo(width, (i * height) / 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((i * width) / 5, 0);
        ctx.lineTo((i * width) / 5, height);
        ctx.stroke();
      }

      ctx.setLineDash([]);
    }
  }, [progress]);

  return (
    <div className="relative w-full h-full bg-white">
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        className="w-full h-full"
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-md text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-[#FF6B6B] mr-2"></div>
          <span>Cars</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-[#4ECDC4] mr-2"></div>
          <span>Bus Routes</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#06D6A0] mr-2"></div>
          <span>Bike Paths</span>
        </div>
      </div>

      {/* Title overlay */}
      <div
        className="absolute top-4 left-4 bg-white/80 p-2 rounded-md"
        style={{
          opacity: progress > 0.9 ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <h4 className="text-sm font-semibold">Urban Mobility Network</h4>
        <p className="text-xs text-gray-600">
          Integrated transportation systems
        </p>
      </div>
    </div>
  );
}
