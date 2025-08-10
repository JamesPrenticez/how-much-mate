import { useCallback, useEffect, useRef, useState } from "react";
import { PannableCanvasKitRef, Shape } from "./types";
import { loadCanvasKit } from "../advanced/loader";
import { Canvas2D } from "./canvas2D";
import { drawGrid, useDrawAll } from "./draw";
import { useShapesStore } from "./draw/shapes.store";

export default function Demo(): JSX.Element {
  const apiRef = useRef<PannableCanvasKitRef>(null);
  const [canvasKitReady, setCanvasKitReady] = useState<boolean>(false);

  const drawAll = useDrawAll();

  const shapes = useShapesStore((s) => s.shapes);
  const setShapes = useShapesStore((s) => s.setShapes)
  const hoveredShape = useShapesStore((s) => s.hoveredShape);
  const setHoveredShape = useShapesStore((s) => s.setHoveredShape)

  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Check if CanvasKit is ready
  useEffect(() => {
    const checkCanvasKit = async () => {
      try {
        await loadCanvasKit();
        setCanvasKitReady(true);
      } catch (error) {
        console.error('Failed to load CanvasKit:', error);
      }
    };
    checkCanvasKit();
  }, []);

  // Helper to convert screen coordinates to world coordinates
  const screenToWorld = useCallback((screenX: number, screenY: number): { x: number; y: number } => {
    if (!apiRef.current) return { x: screenX, y: screenY };
    const view = apiRef.current.getView();
    const worldX = (screenX - view.x) / view.scale;
    const worldY = (screenY - view.y) / view.scale;
    return { x: worldX, y: worldY };
  }, []);

  // Check if a point is inside a shape
  const getShapeAt = useCallback((worldX: number, worldY: number): Shape | undefined => {
    return shapes.find(shape => 
      worldX >= shape.x && 
      worldX <= shape.x + shape.width &&
      worldY >= shape.y && 
      worldY <= shape.y + shape.height
    );
  }, [shapes]);

  // Handle mouse events for interaction
  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);
    
    const shape = getShapeAt(world.x, world.y);
    setHoveredShape(shape || null);
  }, [screenToWorld, getShapeAt, isDragging]);

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);
    
    const clickedShape = getShapeAt(world.x, world.y);
    
    setShapes(
      shapes.map(shape => ({
        ...shape,
        selected: shape.id === clickedShape?.id
      }))
    );
  }, [screenToWorld, getShapeAt]);

  if (!canvasKitReady) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading CanvasKit (Skia)...</p>
      </div>
    );
  }

  return (
    <div>
      <div 
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
      >
        <Canvas2D
          ref={apiRef}
          width={800}
          height={600}
          initialScale={1}
          background="white"
          draw={drawAll}
        />
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Shapes: {shapes.length} | Selected: {shapes.filter(s => s.selected).length} | 
          Hovered: {hoveredShape?.id || 'none'}
        </p>
      </div>
    </div>
  );
}