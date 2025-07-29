import React from 'react';
import styled from '@emotion/styled';
import { useMemo, useState } from 'react';
import { Header } from './header';
import { SubGrid } from './sub-grid';

const GridContainer = styled.div`
  border: 1px solid var(--color-primary);
  border-radius: 0.5rem;
  background-color: var(--color-secondary);
  height: 500px;
`;

const HeaderContainer = styled.div`
  display: grid;
  /* grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); */
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  width: 100%;
`;

const BodyContainer = styled.div`
  display: grid;
  width: 100%;
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 5px;
  height: 100%;
  cursor: col-resize;
  z-index: 1;
`;

interface GridProps {
  data: any[];
}

const initialColWidths: Record<string, string> = {
  code: '100px',
  name: '330px',
  description: '1fr',
};

const filteredItems = ['id', 'createdAt', 'updatedAt', 'supplier'];
const manualColumnOrder = [
  'code',
  'name',
  'description',
  'unitCost',
  'unit',
  'properties',
];

export const Grid = ({ data }: GridProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [columnWidths, setColumnWidths] =
    useState<Record<string, string>>(initialColWidths);

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const columnOrder = useMemo(() => {
    if (data.length === 0) return [];

    const dataKeys = Object.keys(data[0]);

    return manualColumnOrder.filter(
      (key) =>
        dataKeys.includes(key) &&
        !filteredItems.includes(key) &&
        typeof data[0][key] !== 'object'
    );
  }, [data]);

  const gridTemplate = columnOrder
    .map((col) => columnWidths[col] ?? '120px')
    .join(' ');

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [data, sortConfig]);

  const rows = sortedData;

  const extractNestedObjects = (row: Record<string, any>) =>
    Object.entries(row).filter(
      ([_, value]) => typeof value === 'object' && value !== null
    );

  return (
    <GridContainer>
      <HeaderContainer style={{ gridTemplateColumns: gridTemplate }}>
        {columnOrder.map((colKey) => {
          const isSorted = sortConfig?.key === colKey;
          const sortArrow = isSorted
            ? sortConfig!.direction === 'asc'
              ? ' ▲'
              : ' ▼'
            : '';

          return (
            <div
              key={`header-${colKey}`}
              style={{
                position: 'relative',
                paddingRight: '5px',
                cursor: 'pointer',
              }}
              onClick={() => {
                let direction: 'asc' | 'desc' = 'asc';
                if (
                  sortConfig?.key === colKey &&
                  sortConfig.direction === 'asc'
                ) {
                  direction = 'desc';
                }
                setSortConfig({ key: colKey, direction });
              }}
            >
              <Header title={colKey.toUpperCase() + sortArrow} />

              <ResizeHandle
onMouseDown={(e) => {
  e.preventDefault();

  const startX = e.clientX;

  // Get the actual current width of the column
  const columnElement = e.currentTarget.parentElement;
  if (!columnElement) return;

  const startWidth = columnElement.getBoundingClientRect().width;

  const onMouseMove = (moveEvent: MouseEvent) => {
    const delta = moveEvent.clientX - startX;
    const newWidth = Math.max(60, startWidth + delta);

    setColumnWidths((prev) => ({
      ...prev,
      [colKey]: `${newWidth}px`, // overwrite fr with px on resize
    }));
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}}
              />
            </div>
          );
        })}
      </HeaderContainer>

      <BodyContainer style={{ gridTemplateColumns: gridTemplate }}>
        {rows.map((row, rowIndex) => {
          const nestedEntries = extractNestedObjects(row);

          return (
            <React.Fragment key={rowIndex}>
              {columnOrder.map((colKey) => (
                <div
                  key={`cell-${rowIndex}-${colKey}`}
                  onClick={() => toggleRow(rowIndex)}
                  style={{ cursor: 'pointer' }}
                >
                  {String(row[colKey] ?? '')}
                </div>
              ))}

              {expandedRows[rowIndex] && nestedEntries.length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  {nestedEntries.map(([key, value]) => (
                    <SubGrid key={key} data={value} />
                  ))}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </BodyContainer>
    </GridContainer>
  );
};
