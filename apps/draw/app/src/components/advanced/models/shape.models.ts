// Updated Shape type with new shape types
export type Shape = 
  | Rectangle 
  | Line 
  | Polyline 
  | Point;

interface BaseShape {
  id: number;
  color: string;
  selected: boolean;
  zIndex: number;
}

export interface Rectangle extends BaseShape {
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Line extends BaseShape {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth?: number;
}

export interface Polyline extends BaseShape {
  type: "polyline";
  points: { x: number; y: number }[];
  strokeWidth?: number;
  closed?: boolean; // Whether to close the polyline (connect last point to first)
}

export interface Point extends BaseShape {
  type: "point";
  x: number;
  y: number;
  radius?: number;
}