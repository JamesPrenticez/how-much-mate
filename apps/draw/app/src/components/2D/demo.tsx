import { useCallback, useEffect, useRef, useState } from "react";
import { PannableCanvasKitRef, Shape } from "./types";
import { loadCanvasKit } from "./loader";
import { Canvas2D } from "./canvas2D";
import { useDrawAll } from "./draw";
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
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">CanvasKit Multi-Layer Canvas Demo</h2>
        <p className="text-gray-600 mb-2">
          Powered by Skia's CanvasKit for high-performance rendering. Click shapes to select, hover for preview.
        </p>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            onClick={() => apiRef.current?.zoomTo(1)}
          >
            Reset Zoom
          </button>
          <button 
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            onClick={() => {
              setShapes(shapes.map(s => ({ ...s, selected: false })));
            }}
          >
            Clear Selection
          </button>
          <button 
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
            onClick={() => {
              const newShape: Shape = {
                id: Date.now(),
                x: Math.random() * 400 + 100,
                y: Math.random() * 300 + 100,
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                selected: false
              };
              setShapes([...shapes, newShape]);
            }}
          >
            Add Random Shape
          </button>
        </div>
      </div>
      
      <div 
        onMouseMove={handleCanvasMouseMove}
        onClick={handleCanvasClick}
        className="border border-gray-300 rounded"
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
          Hovered: {hoveredShape?.id || 'none'} | Powered by Skia CanvasKit
        </p>
      </div>
    </div>
  );
}