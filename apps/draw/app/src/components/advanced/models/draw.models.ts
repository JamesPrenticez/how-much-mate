import type { Canvas, CanvasKit } from "canvaskit-wasm";
import { View } from "./view.models";
import { Shape } from "./shape.models";

export interface DrawContext {
  canvas: Canvas;
  canvasKit: CanvasKit;
}

export interface ShapeDrawContext extends DrawContext {
  shapes: Shape[];
}

// Options 1 - This is technically better
// export type DrawFunction<TContext extends DrawContext = DrawContext> = (ctx: TContext) => void;

// Options 2 - Function overloads provide a cleaner syntax, but extra is loose
export type DrawFunction<TExtra = undefined> =
  TExtra extends undefined
    ? (canvas: Canvas, canvasKit: CanvasKit, view: View) => void
    : (canvas: Canvas, canvasKit: CanvasKit, view: View, extra: TExtra) => void;
