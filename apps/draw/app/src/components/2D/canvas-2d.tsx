import { useState } from 'react';
import styled from '@emotion/styled';
import { useEntitiesStore } from '../../stores/entities.store';
import { LineEntity } from '../../models/entities.models';
import { v4 as uuidv4 } from 'uuid';

const SvgCanvas = styled.svg`
  width: 100%;
  height: 100%;
background-image: 
  repeating-linear-gradient(
    0deg,
    #f0f0f0,
    #f0f0f0 19px,
    #e0e0e0 20px
  ),
  repeating-linear-gradient(
    90deg,
    #f0f0f0,
    #f0f0f0 19px,
    #e0e0e0 20px
  );
  cursor: crosshair;
`;

export const Canvas2D = () => {
  //const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  const { entities, addEntity } = useEntitiesStore();
  const [tempLine, setTempLine] = useState<LineEntity | null>(null);
  const [drawing, setDrawing] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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
    if (!drawing || !tempLine) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTempLine({
      ...tempLine,
      end: { x, y },
    });
  };

  return (
    <SvgCanvas onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
      {entities
        .filter((e) => e.type === 'line')
        .map((line) => (
          <line
            key={line.id}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="#333"
            strokeWidth={2}
          />
        ))}

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
    </SvgCanvas>
  );
};
