import React from "react";
import "./Grid.css";

interface GridProps {
  rows: number;
  cols: number;
  snake: Array<[number, number]>;
  food: [number, number]; // Position de la nourriture
}

const Grid: React.FC<GridProps> = ({ rows, cols, snake, food }) => {
  return (
    <div className="grid">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="row">
          {Array.from({ length: cols }).map((_, col) => {
            const isSnake = snake.some(([sRow, sCol]) => sRow === row && sCol === col);
            const isFood = food[0] === row && food[1] === col;
            return (
              <div
                key={`${row}-${col}`}
                className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Grid;