import { create } from 'zustand';
import { Shape } from '../models';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import { Quadtree } from '../utils';
import { initialConfig } from '../config';

interface ShapeState {
  shapes: Shape[];
  quadtree: Quadtree | null;
  setShapes: (shapes: Shape[]) => void;

  hoveredShape: Shape | null;
  setHoveredShape: (shape: Shape | null) => void;

  dragPreview: Shape | null;
  setDragPreview: (shape: Shape | null) => void;
}

export const useShapesStore = create<ShapeState>()(
  subscribeWithSelector((set, get) => ({
    shapes: [],
    quadtree: null,
    hoveredShape: null,
    dragPreview: null,
    
    setShapes: (shapes: Shape[]) => {
      // Build quadtree once whenever shapes update
      const qt = new Quadtree({ x: 0, y: 0, width: initialConfig.worldWidth, height: initialConfig.worldHeight });
      shapes.forEach(s =>
        qt.insert({ ...s, width: s.width, height: s.height })
      );

      set(
        produce<ShapeState>((state) => {
          state.shapes = shapes;
          state.quadtree = qt;
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
