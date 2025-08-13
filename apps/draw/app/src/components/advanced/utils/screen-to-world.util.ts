import { View } from "../models";

export const screenToWorld = (screenX: number, screenY: number, view: View) => {
  return {
    x: (screenX - view.x) / view.scale,
    y: (screenY - view.y) / view.scale
  };
};

export const worldToScreen = (worldX: number, worldY: number, view: View) => {
  return {
    x: worldX * view.scale + view.x,
    y: worldY * view.scale + view.y
  };
};