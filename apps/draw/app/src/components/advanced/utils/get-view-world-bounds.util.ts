import { View } from '../models';

export const getViewWorldBounds = (view: View, screenWidth: number, screenHeight: number) =>{
  return {
    x: view.x,
    y: view.y,
    width: screenWidth / view.scale,
    height: screenHeight / view.scale
  };
}
