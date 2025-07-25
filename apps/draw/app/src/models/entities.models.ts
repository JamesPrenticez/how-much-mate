export type Vec2D = { x: number; y: number };

export type LineEntity = {
  id: string;
  type: 'line' | 'temp-line';
  start: Vec2D;
  end: Vec2D;
};

export type Entity = LineEntity; // Extend later with 'circle', 'text', etc.
