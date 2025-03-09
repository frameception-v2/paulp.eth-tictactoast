"use client";

import { useCallback } from "react";

interface BoardProps {
  board: number[];
  onCellPress: (cellIndex: number) => void;
}

export function Board({ board, onCellPress }: BoardProps) {
  const handleInteraction = useCallback((event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    // Get coordinates relative to SVG
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Map coordinates to cell index (0-8)
    const cellSize = rect.width / 3;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    const cellIndex = row * 3 + col;

    if (cellIndex >= 0 && cellIndex < 9) {
      onCellPress(cellIndex);
    }
  }, [onCellPress]);

  return (
    <svg 
      viewBox="0 0 300 300"
      className="w-full h-full"
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Grid lines */}
      <path
        d="
          M 100,0 V 300
          M 200,0 V 300
          M 0,100 H 300
          M 0,200 H 300
        "
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Game pieces */}
      {board.map((value, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = col * 100 + 50;
        const y = row * 100 + 50;
        
        return value === 1 ? (
          <text
            key={index}
            x={x}
            y={y}
            fontSize="60"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-purple-500"
          >
            X
          </text>
        ) : value === 2 ? (
          <text
            key={index}
            x={x}
            y={y}
            fontSize="60"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-orange-500"
          >
            O
          </text>
        ) : null;
      })}
    </svg>
  );
}
