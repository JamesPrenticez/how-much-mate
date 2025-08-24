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
  
  // Performance tracking
  lastQuadtreeRebuild: number;
  
  hoveredShape: Shape | null;
  setHoveredShape: (shape: Shape | null) => void;

  selectedShape: Shape | null;
  setSelectedShape: (shape: Shape | null) => void;

  hoveredHandle: string | null;
  setHoveredHandle: (handle: string | null) => void;

  // Drag state for performance optimization
  isDragging: boolean;
  dragPreviewShape: Shape | null;
  setDragState: (isDragging: boolean, previewShape?: Shape | null) => void;
  
  // Deferred quadtree updates
  commitDraggedShape: (finalShape: Shape) => void;
}

export const useShapesStore = create<ShapeState>()(
  subscribeWithSelector((set, get) => ({
    shapes: [],
    quadtree: null,
    lastQuadtreeRebuild: Date.now(),
    hoveredShape: null,
    selectedShape: null,
    hoveredHandle: null,
    isDragging: false,
    dragPreviewShape: null,

    setShapes: (shapes: Shape[]) => {
      // Expensive operation - rebuild quadtree
      let qt = new Quadtree(WORLD_BOUNDS, BUCKET_SIZE);

      shapes.forEach((s) => {
        qt = Quadtree.ensureContains(qt, s);
        qt.insert(s);
      });

      set(
        produce<ShapeState>((state) => {
          state.shapes = shapes;
          state.quadtree = qt;
          state.lastQuadtreeRebuild = Date.now();
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
          state.hoveredShape = null;
          state.selectedShape = shape;
        })
      );
    },

    setHoveredHandle: (handle: string | null) => {
      set(
        produce<ShapeState>((state) => {
          state.hoveredHandle = handle;
        })
      );
    },

    setDragState: (isDragging: boolean, previewShape?: Shape | null) => {
      set(
        produce<ShapeState>((state) => {
          state.isDragging = isDragging;
          state.dragPreviewShape = previewShape || null;
        })
      );
    },

    // Optimized: Only rebuild quadtree when drag is complete
    commitDraggedShape: (finalShape: Shape) => {
      const { shapes } = get();
      
      const updatedShapes = shapes.map(shape => {
        if (shape.id === finalShape.id) {
          return finalShape;
        }
        return shape;
      });
      
      // Rebuild quadtree with final positions
      let qt = new Quadtree(WORLD_BOUNDS, BUCKET_SIZE);
      updatedShapes.forEach((s) => {
        qt = Quadtree.ensureContains(qt, s);
        qt.insert(s);
      });

      set(
        produce<ShapeState>((state) => {
          state.shapes = updatedShapes;
          state.quadtree = qt;
          state.selectedShape = finalShape;
          state.isDragging = false;
          state.dragPreviewShape = null;
          state.lastQuadtreeRebuild = Date.now();
        })
      );
    },
  }))
);