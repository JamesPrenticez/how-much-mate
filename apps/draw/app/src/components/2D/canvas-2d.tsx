import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { Grid, GRID_SIZE } from './grid';
import { useEntitiesStore, useControlsGridStore, useControlsDrawingStore } from '@draw/stores';
import { MeasureToolType, type LineEntity } from '@draw/models';
import { GridControls } from './grid-controls';

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
  cursor: crosshair;
`;

export const Canvas2D = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { entities, addEntity } = useEntitiesStore();
  const [tempLine, setTempLine] = useState<LineEntity | null>(null);
  const { isDrawing, setIsDrawing } = useControlsDrawingStore();

  const {
    snapToGrid,
    setSnapToGrid,
    showGrid,
    setShowGrid,
    viewBox,
    setViewBox,
  } = useControlsGridStore();

  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  // Get actual SVG dimensions
  const [svgDimensions, setSvgDimensions] = useState({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setSvgDimensions({ width: rect.width, height: rect.height });
        // Update viewBox to maintain aspect ratio
        setViewBox({
          ...viewBox,
          w: rect.width,
          h: rect.height,
        });
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
    const scaleX = viewBox.w / rect.width;
    const scaleY = viewBox.h / rect.height;

    return {
      x: viewBox.x + (screenX - rect.left) * scaleX,
      y: viewBox.y + (screenY - rect.top) * scaleY,
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

    if (!isDrawing) {
      setTempLine({
        id: 'temp',
        measureToolType: MeasureToolType.TEMP_LINE,
        start: { x, y },
        end: { x, y },
      });
      setIsDrawing(true);
    } else {
      if (tempLine) {
        addEntity({
          ...tempLine,
          id: uuidv4(),
          measureToolType: MeasureToolType.LINE,
          end: { x, y },
        });
      }
      setTempLine(null);
      setIsDrawing(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;

      setViewBox({
        ...viewBox,
        x: viewBox.x - deltaX,
        y: viewBox.y - deltaY,
      });

      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    if (!isDrawing || !tempLine) return;

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

    const newWidth = viewBox.w * zoomFactor;
    const newHeight = viewBox.h * zoomFactor;

    setViewBox({
      x: mousePoint.x - (mousePoint.x - viewBox.x) * zoomFactor,
      y: mousePoint.y - (mousePoint.y - viewBox.y) * zoomFactor,
      w: newWidth,
      h: newHeight,
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
      setViewBox({ x: -400, y: -300, w: 800, h: 600 });
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <GridControls />

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
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        style={{ cursor: isPanning ? 'grabbing' : 'crosshair' }}
      >
        {/* Infinite Grid */}
        <Grid gridSize={GRID_SIZE} visible={showGrid} viewBox={viewBox} />

        {/* Existing lines */}
        {entities
          .filter((e) => e.measureToolType === 'line')
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
