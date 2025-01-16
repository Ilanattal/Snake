import React from "react";
import "./Snake.css";

interface SnakeProps {
  snake: Array<[number, number]>;
}

const Snake: React.FC<SnakeProps> = ({ snake }) => {
  return (
    <>
      {snake.map(([row, col], index) => (
  <div
    key={index}
    className="cell snake"
    style={{
      gridRowStart: row + 1,
      gridColumnStart: col + 1,
    }}
  ></div>
))}
    </>
  );
};

export default Snake;