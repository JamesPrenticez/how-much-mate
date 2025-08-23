import { useRef, useCallback } from 'react';
import { useShapesStore, useCanvasStore } from '../stores';
import { getShapeBoundingRect, moveShape, screenToWorld } from '../utils';
import { useSharedRAF } from './use-canvas-raf';
import { Shape } from '../models';

export const useShapeMovement = () => {
  const selectedShape = useShapesStore(s => s.selectedShape);
  const shapes = useShapesStore(s => s.shapes);
  const setShapes = useShapesStore(s => s.setShapes);
  const setSelectedShape = useShapesStore(s => s.setSelectedShape);
  const view = useCanvasStore(s => s.view);
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const shapeStartState = useRef<Shape | null>(null);
  const latestMouse = useRef<{ x: number, y: number, rect: DOMRect } | null>(null);
  
  const { scheduleUpdate } = useSharedRAF();

  const processDrag = useCallback(() => {
    if (!isDragging.current || !latestMouse.current || !selectedShape || !shapeStartState.current) return;

    const { x, y, rect } = latestMouse.current;
    const screenCoords = {
      x: x - rect.left - 25,
      y: y - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
    
    // Calculate the delta from drag start
    const deltaX = worldCoords.x - dragStart.current.x;
    const deltaY = worldCoords.y - dragStart.current.y;
    
    // Create the updated shape based on its type
    const updatedShape = moveShape(shapeStartState.current, deltaX, deltaY);
    
    // Update the shapes array
    const updatedShapes = shapes.map(shape => {
      if (shape.id === selectedShape.id) {
        return updatedShape;
      }
      return shape;
    });
    
    // Update both the shapes and the selected shape reference
    setShapes(updatedShapes);
    setSelectedShape(updatedShape);
  }, [selectedShape, shapes, setShapes, setSelectedShape, view]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle left mouse button
    if (e.button !== 0 || !selectedShape) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenCoords = {
      x: e.clientX - rect.left - 25,
      y: e.clientY - rect.top - 25,
    };
    const worldCoords = screenToWorld(screenCoords.x, screenCoords.y, view);
    
    // Check if we're clicking within the selected shape's bounding rectangle for movement
    const boundingRect = getShapeBoundingRect(selectedShape);
    const isClickingSelectedShape = (
      worldCoords.x >= boundingRect.x &&
      worldCoords.x <= boundingRect.x + boundingRect.width &&
      worldCoords.y >= boundingRect.y &&
      worldCoords.y <= boundingRect.y + boundingRect.height
    );
    
    if (isClickingSelectedShape) {
      isDragging.current = true;
      dragStart.current = worldCoords;
      shapeStartState.current = { ...selectedShape }; // Store the initial state
      
      // Prevent the event from bubbling to selection/pan handlers
      e.stopPropagation();
      e.preventDefault();
    }
  }, [selectedShape, view]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    latestMouse.current = { 
      x: e.clientX, 
      y: e.clientY, 
      rect 
    };
    
    scheduleUpdate(processDrag);
  }, [scheduleUpdate, processDrag]);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    latestMouse.current = null;
    shapeStartState.current = null;
  }, []);

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
    isDragging: () => isDragging.current
  };
};

