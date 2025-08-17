import { create } from 'zustand';
import { Shape } from '../models';
import { subscribeWithSelector } from 'zustand/middleware';
import { produce } from 'immer';
import { Quadtree } from '../utils';
import { BUCKET_SIZE, WORLD_BOUNDS } from '../config';

interface ShapeState {
  shapes: Shape[];
  quadtree: Quadtree | null;
  setShapes: (shapes: Shape[]) => void;

  hoveredShape: Shape | null;
  setHoveredShape: (shape: Shape | null) => void;

  selectedShape: Shape | null;
  setSelectedShape: (shape: Shape | null) => void;
}

export const useShapesStore = create<ShapeState>()(
  subscribeWithSelector((set, get) => ({
    shapes: [],
    quadtree: null,
    hoveredShape: null,
    selectedShape: null,

    setShapes: (shapes: Shape[]) => {
      let qt = new Quadtree(WORLD_BOUNDS, BUCKET_SIZE);

      shapes.forEach((s) => {
        qt = Quadtree.ensureContains(qt, s);
        qt.insert(s);
      });

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

    setSelectedShape: (shape: Shape | null) => {
      set(
        produce<ShapeState>((state) => {
          state.selectedShape = shape;
        })
      );
    },
  }))
);
