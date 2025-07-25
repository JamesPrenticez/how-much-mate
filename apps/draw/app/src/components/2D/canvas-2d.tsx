import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useEntitiesStore } from '../../stores/entities.store';
import { LineEntity } from '../../models/entities.models';
import { v4 as uuidv4 } from 'uuid';

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

const GRID_SIZE = 20; // Grid spacing in pixels

interface InfiniteGridProps {
  gridSize?: number;
  color?: string;
  strokeWidth?: number;
  visible?: boolean;
  viewBox: { x: number; y: number; width: number; height: number };
}

const InfiniteGrid = ({ 
  gridSize = GRID_SIZE, 
  color = "#e0e0e0", 
  strokeWidth = 0.5, 
  visible = true,
  viewBox
}: InfiniteGridProps) => {
  if (!visible) return null;

  const { x: viewX, y: viewY, width: viewWidth, height: viewHeight } = viewBox;
  
  // Calculate the range of grid lines to draw (only what's visible + some padding)
  const padding = gridSize * 2; // Extra lines for smooth panning
  const startX = Math.floor((viewX - padding) / gridSize) * gridSize;
  const endX = Math.ceil((viewX + viewWidth + padding) / gridSize) * gridSize;
  const startY = Math.floor((viewY - padding) / gridSize) * gridSize;
  const endY = Math.ceil((viewY + viewHeight + padding) / gridSize) * gridSize;

  const lines = [];
  
  // Vertical lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={startY}
        x2={x}
        y2={endY}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }
  
  // Horizontal lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={startX}
        y1={y}
        x2={endX}
        y2={y}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    );
  }
  
  return <g className="infinite-grid">{lines}</g>;
};

export const Canvas2D = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { entities, addEntity } = useEntitiesStore();
  const [tempLine, setTempLine] = useState<LineEntity | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  
  // Pan and zoom state
  const [viewBox, setViewBox] = useState({ x: -400, y: -300, width: 800, height: 600 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  // Get actual SVG dimensions
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgDimensions({ width: rect.width, height: rect.height });
        // Update viewBox to maintain aspect ratio
        setViewBox(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height
        }));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Convert screen coordinates to SVG coordinates
  const screenToSvg = (screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: screenX, y: screenY };
    
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    
    return {
      x: viewBox.x + (screenX - rect.left) * scaleX,
      y: viewBox.y + (screenY - rect.top) * scaleY
    };
  };

  // Snap coordinate to grid
  const snapToGridPoint = (x: number, y: number) => {
    if (!snapToGrid) return { x, y };
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      // Middle mouse or Ctrl+click for panning
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (e.button !== 0) return; // Only handle left click for drawing

    const svgPoint = screenToSvg(e.clientX, e.clientY);
    const { x, y } = snapToGridPoint(svgPoint.x, svgPoint.y);

    if (!drawing) {
      setTempLine({
        id: 'temp',
        type: 'temp-line',
        start: { x, y },
        end: { x, y },
      });
      setDrawing(true);
    } else {
      if (tempLine) {
        addEntity({
          ...tempLine,
          id: uuidv4(),
          type: 'line',
          end: { x, y },
        });
      }
      setTempLine(null);
      setDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (!drawing || !tempLine) return;

    const svgPoint = screenToSvg(e.clientX, e.clientY);
    const { x, y } = snapToGridPoint(svgPoint.x, svgPoint.y);

    setTempLine({
      ...tempLine,
      end: { x, y },
    });
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    const mousePoint = screenToSvg(e.clientX, e.clientY);
    
    setViewBox(prev => {
      const newWidth = prev.width * zoomFactor;
      const newHeight = prev.height * zoomFactor;
      
      return {
        x: mousePoint.x - (mousePoint.x - prev.x) * zoomFactor,
        y: mousePoint.y - (mousePoint.y - prev.y) * zoomFactor,
        width: newWidth,
        height: newHeight
      };
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'g') {
      setSnapToGrid(!snapToGrid);
    }
    if (e.key === 'h') {
      setShowGrid(!showGrid);
    }
    if (e.key === 'r') {
      // Reset view
      setViewBox({ x: -400, y: -300, width: 800, height: 600 });
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        display: 'flex',
        gap: 8,
        background: 'rgba(var(--color-background-opacity), 0.8)',
        padding: 8,
        borderRadius: 4,
      }}>
        <button
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => setSnapToGrid(!snapToGrid)}
        >
          Snap: {snapToGrid ? 'ON' : 'OFF'} (G)
        </button>
        <button
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => setShowGrid(!showGrid)}
        >
          Grid: {showGrid ? 'ON' : 'OFF'} (H)
        </button>
        <button
          style={{ padding: '4px 8px', fontSize: '12px' }}
          onClick={() => setViewBox({ x: -400, y: -300, width: 800, height: 600 })}
        >
          Reset View (R)
        </button>
      </div>

      {/* Instructions */}
      {/* <div style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 10,
        background: 'rgba(var(--color-background-opacity), 0.8)',
        padding: 8,
        borderRadius: 4,
        fontSize: '12px',
        maxWidth: 200,
      }}>
        Click to draw lines<br/>
        Ctrl+drag or middle-click to pan<br/>
        Scroll to zoom
      </div> */}

      <SvgCanvas 
        ref={svgRef}
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        style={{ cursor: isPanning ? 'grabbing' : 'crosshair' }}
      >
        {/* Infinite Grid */}
        <InfiniteGrid 
          gridSize={GRID_SIZE}
          visible={showGrid}
          viewBox={viewBox}
        />
        
        {/* Existing lines */}
        {entities
          .filter((e) => e.type === 'line')
          .map((line) => (
            <line
              key={line.id}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke="var(--color-rag-green)"
              strokeWidth={2}
            />
          ))}

        {/* Temporary line */}
        {tempLine && (
          <line
            x1={tempLine.start.x}
            y1={tempLine.start.y}
            x2={tempLine.end.x}
            y2={tempLine.end.y}
            stroke="red"
            strokeWidth={2}
            strokeDasharray="4"
          />
        )}

        {/* Snap indicators */}
        {snapToGrid && tempLine && (
          <>
            <circle
              cx={tempLine.start.x}
              cy={tempLine.start.y}
              r={3}
              fill="blue"
              fillOpacity={0.5}
            />
            <circle
              cx={tempLine.end.x}
              cy={tempLine.end.y}
              r={3}
              fill="red"
              fillOpacity={0.5}
            />
          </>
        )}
      </SvgCanvas>
    </div>
  );
};