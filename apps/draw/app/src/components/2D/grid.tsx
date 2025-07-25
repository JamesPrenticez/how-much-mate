import { ViewBox } from "../../../../../../libs/draw/ui/stores/src/lib/controls-grid.store";

export const GRID_SIZE = 20; // Grid spacing in pixels

interface InfiniteGridProps {
  gridSize?: number;
  color?: string;
  strokeWidth?: number;
  visible?: boolean;
  viewBox: ViewBox;
}

export const Grid = ({ 
  gridSize = GRID_SIZE, 
  color = "#e0e0e0", 
  strokeWidth = 0.5, 
  visible = true,
  viewBox
}: InfiniteGridProps) => {
  if (!visible) return null;

  const { x: viewX, y: viewY, w: viewWidth, w: viewHeight } = viewBox;
  
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