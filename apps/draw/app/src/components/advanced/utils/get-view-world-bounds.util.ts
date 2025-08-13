import { View } from '../models';

export function getViewWorldBounds(view: View, screenWidth: number, screenHeight: number) {
  const worldWidth = screenWidth / view.scale;
  const worldHeight = screenHeight / view.scale;

  // Calculate top-left in world space
  const x = -view.x / view.scale;
  const y = -view.y / view.scale;

  // Small padding so partially visible shapes aren’t clipped
  const padding = 2; 

  return {
    x: x - padding,
    y: y - padding,
    width: worldWidth + padding * 2,
    height: worldHeight + padding * 2
  };
}