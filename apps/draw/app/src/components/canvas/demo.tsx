import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, CanvasKitInstance, PannableCanvasKitRef, Shape, View } from "./types";
import { loadCanvasKit } from "./loader";
import { Canvas2D } from "./canvas2D";
import { drawBackground, drawGrid, drawInteraction } from "./utils";

export default function Demo(): JSX.Element {
  const apiRef = useRef<PannableCanvasKitRef>(null);
  const [canvasKitReady, setCanvasKitReady] = useState<boolean>(false);
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, x: 100, y: 100, width: 100, height: 100, color: 'red', selected: false },
    { id: 2, x: 250, y: 150, width: 80, height: 120, color: 'blue', selected: false },
    { id: 3, x: 400, y: 200, width: 150, height: 60, color: 'green', selected: false }
  ]);
  const [hoveredShape, setHoveredShape] = useState<Shape | null>(null);
  const [dragPreview, setDragPreview] = useState<Shape | null>(null);
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
    
    setShapes(prevShapes => 
      prevShapes.map(shape => ({
        ...shape,
        selected: shape.id === clickedShape?.id
      }))
    );
  }, [screenToWorld, getShapeAt]);

  // Combined draw function that renders all layers using CanvasKit
  const draw = useCallback((canvas: Canvas, view: View, dpr: number, CanvasKit: CanvasKitInstance) => {
    if (!CanvasKit) return;
    
    // Layer 1: Grid (bottom layer)
    drawGrid(canvas, view, dpr, CanvasKit);
    
    // Layer 2: Background shapes
    drawBackground(canvas, view, dpr, CanvasKit, shapes);
    
    // Layer 3: Interaction layer (top layer)
    drawInteraction(canvas, view, dpr, CanvasKit, hoveredShape, dragPreview);
  }, [shapes, hoveredShape, dragPreview]);

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
            onClick={() => setShapes(prev => prev.map(s => ({...s, selected: false})))}
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
              setShapes(prev => [...prev, newShape]);
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
          draw={draw}
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