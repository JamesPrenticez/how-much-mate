import styled from '@emotion/styled';
import { Input } from '@shared/components'
import { SetStateAction, useState } from 'react';
const Container = styled.div`
  border: 1px solid #ccc;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 'white';
  cursor: pointer;

  &.isEditing {
    background-color: #eef;
  }
`;

interface CellProps {
  cellValue: string;
  isEditing: boolean;
  rowIndex: number;
  colIndex: number;
  setData: React.Dispatch<React.SetStateAction<string[][]>> // Store
}

export const Cell = ({
  cellValue, 
  isEditing,
  rowIndex,
  colIndex,
  setData
}: CellProps) => {
  const [editing, setEditing] = useState<{ row: number; col: number } | null>(null);

  const handleChange = (row: number, col: number, value: string) => {
    setData((prev) => {
      const newData = [...prev];
      newData[row] = [...newData[row]];
      newData[row][col] = value;
      return newData;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const nextCol = (col + 1) % 10;
      const nextRow = col === 9 ? (row + 1) % 10 : row;
      setEditing({ row: nextRow, col: nextCol });
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };

  return (
    <Container>
      {isEditing ? (
        <Input
          value={cellValue}
          onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
          autoFocus
        />
      ) : (
        cellValue
      )}
    </Container>
  );
};
