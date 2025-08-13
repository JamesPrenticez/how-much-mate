import { Shape } from "./models";

export const mockShapes: Shape[] = [
  {
    id: 1,
    type: 'rectangle',
    x: 300,
    y: 100,
    width: 100,
    height: 100,
    color: '#FF0000',
    selected: false,
  },
  {
    id: 2,
    type: 'rectangle',
    x: 300,
    y: 150,
    width: 80,
    height: 120,
    color: '#00FF00',
    selected: false,
  },
  {
    id: 3,
    type: 'rectangle',
    x: 300,
    y: 200,
    width: 150,
    height: 60,
    color: '#0000FF',
    selected: false,
  },
];
