import { create } from 'zustand';
import { Shape } from '../models';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';

interface ShapeState {
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;

  hoveredShape: Shape | null;
  setHoveredShape: (shape: Shape | null) => void;

  dragPreview: Shape | null;
  setDragPreview: (shape: Shape | null) => void;
}

export const useShapesStore = create<ShapeState>()(
  subscribeWithSelector((set, get) => ({
    shapes: [
      { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red', selected: false },
      { id: 2, x: 250, y: 150, width: 80, height: 120, color: 'blue', selected: false },
      { id: 3, x: 400, y: 200, width: 150, height: 60, color: 'green', selected: false }
    ],
    hoveredShape: null,
    dragPreview: null,
    
    setShapes: (shapes: Shape[]) => {
      set(
        produce<ShapeState>((state) => {
          state.shapes = shapes;
        })
      );
    },

    setHoveredShape: (shape: Shape | null) => {
      set(
        produce<ShapeState>((state) => {
          state.hoveredShape = shape;
        })
      );
    },

    setDragPreview: (shape: Shape | null) => {
      set(
        produce<ShapeState>((state) => {
          state.dragPreview = shape;
        })
      );
    },

  })
));
