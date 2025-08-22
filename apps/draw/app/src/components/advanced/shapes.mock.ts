import { Shape } from "./models";

export const mockShapes: Shape[] = [
  // Rectangle shapes
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
    y: 200,
    width: 150,
    height: 60,
    color: '#0000FF',
    selected: false,
  },
  
  // Line shapes
  {
    id: 3,
    type: 'line',
    x1: 100,
    y1: 50,
    x2: 200,
    y2: 150,
    strokeWidth: 3,
    color: '#00FF00',
    selected: false,
  },
  {
    id: 4,
    type: 'line',
    x1: 450,
    y1: 100,
    x2: 550,
    y2: 200,
    strokeWidth: 2,
    color: '#FF00FF',
    selected: false,
  },
  
  // Polyline shapes
  {
    id: 5,
    type: 'polyline',
    points: [
      { x: 50, y: 300 },
      { x: 100, y: 250 },
      { x: 150, y: 300 },
      { x: 200, y: 250 },
      { x: 250, y: 300 }
    ],
    strokeWidth: 2,
    color: '#FFA500',
    selected: false,
  },
  {
    id: 6,
    type: 'polyline',
    points: [
      { x: 400, y: 300 },
      { x: 450, y: 250 },
      { x: 500, y: 300 },
      { x: 450, y: 350 }
    ],
    strokeWidth: 3,
    closed: true,
    color: '#800080',
    selected: false,
  },
  
  // Point shapes
  {
    id: 7,
    type: 'point',
    x: 100,
    y: 400,
    radius: 5,
    color: '#FF0000',
    selected: false,
  },
  {
    id: 8,
    type: 'point',
    x: 200,
    y: 400,
    radius: 8,
    color: '#0000FF',
    selected: false,
  },
  {
    id: 9,
    type: 'point',
    x: 300,
    y: 400,
    radius: 3,
    color: '#00FF00',
    selected: false,
  },
];