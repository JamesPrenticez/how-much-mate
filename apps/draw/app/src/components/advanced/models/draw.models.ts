import type { Canvas, CanvasKit } from "canvaskit-wasm";

export interface DrawContext {
  canvas: Canvas;
  canvasKit: CanvasKit;
}

export interface ShapeDrawContext extends DrawContext {
  shapes: Shape[];
}

// Options 1 - This is technically better
// export type DrawFunction<TContext extends DrawContext = DrawContext> = (ctx: TContext) => void;

// Options 2 - Function overloads provide a cleaner syntax
export type DrawFunction<TExtra = undefined> =
  TExtra extends undefined
    ? (canvas: Canvas, canvasKit: CanvasKit) => void
    : (canvas: Canvas, canvasKit: CanvasKit, extra: TExtra) => void;

// Temp solution
export type Shape = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  selected: boolean;
};