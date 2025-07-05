import React from "react";

interface CubeProps {
  width: number;
  length: number;
  depth: number;
  widthUnit: string;
  lengthUnit: string;
  depthUnit: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
}

export const DynamicCube: React.FC<CubeProps> = ({
  width,
  length,
  depth,
  widthUnit,
  lengthUnit,
  depthUnit,
  stroke = "black",
  strokeWidth = 2,
  fontSize = 12
}) => {
  const angle = Math.PI / 6;
  const dx = length * Math.cos(angle);
  const dy = length * Math.sin(angle);

  // Front face
  const A = { x: 0, y: 0 };
  const B = { x: width, y: 0 };
  const C = { x: width, y: depth };
  const D = { x: 0, y: depth };
  // Back face
  const E = { x: A.x + dx, y: A.y - dy };
  const F = { x: B.x + dx, y: B.y - dy };
  const G = { x: C.x + dx, y: C.y - dy };
  const H = { x: D.x + dx, y: D.y - dy };

  // Find bounding box before scaling
  const allX = [A.x, B.x, C.x, D.x, E.x, F.x, G.x, H.x];
  const allY = [A.y, B.y, C.y, D.y, E.y, F.y, G.y, H.y];
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const cubeWidth = maxX - minX;
  const cubeHeight = maxY - minY;

  const targetSize = 250;
  const scale = Math.min(
    (targetSize - strokeWidth * 2) / cubeWidth,
    (targetSize - strokeWidth * 2) / cubeHeight
  );
  const offsetX = (targetSize - cubeWidth * scale) / 2 - minX * scale;
  const offsetY = (targetSize - cubeHeight * scale) / 2 - minY * scale;

  const transform = (p: { x: number; y: number }) => ({
    x: p.x * scale + offsetX,
    y: p.y * scale + offsetY
  });

  const A2 = transform(A);
  const B2 = transform(B);
  const C2 = transform(C);
  const D2 = transform(D);
  const E2 = transform(E);
  const F2 = transform(F);
  const G2 = transform(G);
  const H2 = transform(H);

  // Depth dimension line at back right
  const depthLineP1 = { x: F2.x + 20, y: F2.y };
  const depthLineP2 = { x: G2.x + 20, y: G2.y };

  // Include dimension lines in final bounding box
  const allFinalX = [A2.x, B2.x, C2.x, D2.x, E2.x, F2.x, G2.x, H2.x, depthLineP1.x, depthLineP2.x];
  const allFinalY = [A2.y, B2.y, C2.y, D2.y, E2.y, F2.y, G2.y, H2.y, depthLineP1.y, depthLineP2.y];

const padding = 20; 

const finalMinX = Math.min(...allFinalX) - strokeWidth - padding;
const finalMaxX = Math.max(...allFinalX) + strokeWidth + padding;
const finalMinY = Math.min(...allFinalY) - strokeWidth - padding;
const finalMaxY = Math.max(...allFinalY) + strokeWidth + padding;

  // helper to draw "I"-shaped dimension lines
  const drawDimLine = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    label: string,
    vertical = false
  ) => {
    const tick = 8; // length of the perpendicular tick
    return (
      <>
        <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={stroke} strokeWidth={1} />
        <line
          x1={p1.x - (vertical ? tick : 0)}
          y1={p1.y - (vertical ? 0 : tick)}
          x2={p1.x + (vertical ? tick : 0)}
          y2={p1.y + (vertical ? 0 : tick)}
          stroke={stroke}
          strokeWidth={1}
        />
        <line
          x1={p2.x - (vertical ? tick : 0)}
          y1={p2.y - (vertical ? 0 : tick)}
          x2={p2.x + (vertical ? tick : 0)}
          y2={p2.y + (vertical ? 0 : tick)}
          stroke={stroke}
          strokeWidth={1}
        />
        <text
          x={(p1.x + p2.x) / 2}
          y={(p1.y + p2.y) / 2 - (vertical ? 0 : 4)}
          fontSize={fontSize}
          textAnchor="middle"
          fill={stroke}
        >
          {label}
        </text>
      </>
    );
  };

  return (
    <svg
      width={targetSize}
      height={targetSize}
      viewBox={`${finalMinX} ${finalMinY} ${finalMaxX - finalMinX} ${finalMaxY - finalMinY}`}
    >
      {/* Cube */}
      <line x1={A2.x} y1={A2.y} x2={B2.x} y2={B2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={B2.x} y1={B2.y} x2={C2.x} y2={C2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={C2.x} y1={C2.y} x2={D2.x} y2={D2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={D2.x} y1={D2.y} x2={A2.x} y2={A2.y} stroke={stroke} strokeWidth={strokeWidth} />

      <line x1={E2.x} y1={E2.y} x2={F2.x} y2={F2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={F2.x} y1={F2.y} x2={G2.x} y2={G2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={G2.x} y1={G2.y} x2={H2.x} y2={H2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={H2.x} y1={H2.y} x2={E2.x} y2={E2.y} stroke={stroke} strokeWidth={strokeWidth} />

      <line x1={A2.x} y1={A2.y} x2={E2.x} y2={E2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={B2.x} y1={B2.y} x2={F2.x} y2={F2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={C2.x} y1={C2.y} x2={G2.x} y2={G2.y} stroke={stroke} strokeWidth={strokeWidth} />
      <line x1={D2.x} y1={D2.y} x2={H2.x} y2={H2.y} stroke={stroke} strokeWidth={strokeWidth} />

      {/* Dimension lines */}
      {drawDimLine(
        { x: A2.x, y: D2.y + 20 },
        { x: B2.x, y: C2.y + 20 },
        `${width}${widthUnit}`
      )}
      {drawDimLine(
        { x: A2.x, y: A2.y - 20 },
        { x: E2.x, y: E2.y - 20 },
        `${length}${lengthUnit}`
      )}
      {drawDimLine(
        depthLineP1,
        depthLineP2,
        `${depth}${depthUnit}`,
        true
      )}
    </svg>
  );
};
