export const isPointOnLine = (px: number, py: number, x1: number, y1: number, x2: number, y2: number, strokeWidth: number): boolean => {
  const tolerance = Math.max(strokeWidth / 2, 3); // Minimum 3px tolerance
  
  // Vector from line start to point
  const A = px - x1;
  const B = py - y1;
  
  // Vector from line start to end
  const C = x2 - x1;
  const D = y2 - y1;
  
  // Calculate the dot product and squared length
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  // Handle zero-length line
  if (lenSq === 0) {
    const dx = px - x1;
    const dy = py - y1;
    return Math.sqrt(dx * dx + dy * dy) <= tolerance;
  }
  
  // Calculate parameter t (projection of point onto line)
  const t = Math.max(0, Math.min(1, dot / lenSq));
  
  // Find the closest point on the line segment
  const closestX = x1 + t * C;
  const closestY = y1 + t * D;
  
  // Calculate distance from point to closest point on line
  const dx = px - closestX;
  const dy = py - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return distance <= tolerance;
};