import React, { useState, useRef, useEffect } from 'react';

interface ZoomWrapperProps {
  children: React.ReactNode;
  targetSize?: number; // default 250
}

export const ZoomWrapper: React.FC<ZoomWrapperProps> = ({
  children,
  targetSize = 250,
}) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- MOUSE EVENTS ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPanning(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !lastPos) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsPanning(false);
    setLastPos(null);
  };

  // --- TOUCH EVENTS ---
  const lastTouch = useRef<{ x: number; y: number } | null>(null);
  const lastDistance = useRef<number | null>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      lastDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1 && lastTouch.current) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastDistance.current != null) {
      const newDistance = getDistance(e.touches);
      const delta = (newDistance - lastDistance.current) * 0.01;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.2), 5));
      lastDistance.current = newDistance;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    lastTouch.current = null;
    lastDistance.current = null;
  };

  const getDistance = (touches: TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // --- BUTTON CONTROLS ---
  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.2));
  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((prev) => Math.min(Math.max(prev + delta, 0.2), 5));
    };

    container.addEventListener('wheel', wheelHandler, { passive: false });

    return () => {
      container.removeEventListener('wheel', wheelHandler);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: targetSize,
        height: targetSize,
        border: '1px solid #ccc',
        touchAction: 'none',
        userSelect: 'none',
        cursor: isPanning ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <button onClick={zoomIn} style={btnStyle}>
          ＋
        </button>
        <button onClick={zoomOut} style={btnStyle}>
          －
        </button>
        <button onClick={reset} style={btnStyle}>
          ⟳
        </button>
      </div>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  width: 30,
  height: 30,
  border: '1px solid #999',
  background: 'white',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 16,
  padding: 0,
};
