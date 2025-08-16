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
    id: 3,
    type: 'rectangle',
    x: 300,
    y: 200,
    width: 150,
    height: 60,
    color: '#0000FF',
    selected: false,
  },
  {
    id: 4,
    type: 'rectangle',
    x: 0,
    y: 0,
    width: 10,
    height: 10,
    color: '#FF0f',
    selected: false,
  },
    {
    id: 2,
    type: 'rectangle',
    x: -100,
    y: 0,
    width: 10,
    height: 10,
    color: '#00FF00',
    selected: false,
  },
];
