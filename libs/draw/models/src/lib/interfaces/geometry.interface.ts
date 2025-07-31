import z from "zod";
import { GeometryType } from "../enums";

export const Point3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const LineGeometrySchema = z.object({
  type: z.literal(GeometryType.LINE || GeometryType.TEMP_LINE),
  start: Point3DSchema,
  end: Point3DSchema,
});

const PolylineGeometrySchema = z.object({
  type: z.literal(GeometryType.POLYLINE),
  coordinates: z.array(Point3DSchema),
  closed: z.boolean(),
});

const CircleGeometrySchema = z.object({
  type: z.literal(GeometryType.CIRCLE),
  center: Point3DSchema,
  radius: z.number(),
});

const RectangleGeometrySchema = z.object({
  type: z.literal(GeometryType.RECTANGLE),
  corner1: Point3DSchema,
  corner2: Point3DSchema,
});

export const GeometrySchema = z.discriminatedUnion('type', [
  LineGeometrySchema,
  PolylineGeometrySchema,
  CircleGeometrySchema,
  RectangleGeometrySchema,
]);

export type Geometry = z.infer<typeof GeometrySchema>;