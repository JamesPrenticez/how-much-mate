import { Shape } from "./models";

const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateShapes = (count: number): Shape[] => {
  const shapes: Shape[] = [];

  for (let i = 1; i <= count; i++) {
    const typeIndex = randomBetween(0, 3);
    let shape: Shape;

    if (typeIndex === 0) {
      // Rectangle
      shape = {
        id: i,
        type: 'rectangle',
        x: randomBetween(0, 600),
        y: randomBetween(0, 400),
        width: randomBetween(20, 150),
        height: randomBetween(20, 150),
        color: randomColor(),
        selected: false,
      };
    } else if (typeIndex === 1) {
      // Line
      shape = {
        id: i,
        type: 'line',
        x1: randomBetween(0, 600),
        y1: randomBetween(0, 400),
        x2: randomBetween(0, 600),
        y2: randomBetween(0, 400),
        strokeWidth: randomBetween(1, 5),
        color: randomColor(),
        selected: false,
      };
    } else if (typeIndex === 2) {
      // Polyline
      const pointCount = randomBetween(3, 6);
      const points = Array.from({ length: pointCount }, () => ({
        x: randomBetween(0, 600),
        y: randomBetween(0, 400),
      }));

      shape = {
        id: i,
        type: 'polyline',
        points,
        strokeWidth: randomBetween(1, 4),
        closed: Math.random() > 0.5,
        color: randomColor(),
        selected: false,
      };
    } else {
      // Point
      shape = {
        id: i,
        type: 'point',
        x: randomBetween(0, 600),
        y: randomBetween(0, 400),
        radius: randomBetween(2, 10),
        color: randomColor(),
        selected: false,
      };
    }

    shapes.push(shape);
  }

  return shapes;
};

// Example usage
export const mockShapes = generateShapes(200);
