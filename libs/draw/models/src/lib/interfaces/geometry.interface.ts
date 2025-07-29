export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface GeometryBase {
  type: string;
}

export interface LineGeometry extends GeometryBase {
  type: 'line' | 'temp-line';
  start: Point3D;
  end: Point3D;
}

export interface PolylineGeometry extends GeometryBase {
  type: 'polyline';
  coordinates: Point3D[];
  closed: boolean;
}

export interface CircleGeometry extends GeometryBase {
  type: 'circle';
  center: Point3D;
  radius: number;
}

export interface RectangleGeometry extends GeometryBase {
  type: 'rectangle';
  corner1: Point3D;
  corner2: Point3D;
}

export type Geometry = LineGeometry | PolylineGeometry | CircleGeometry | RectangleGeometry;