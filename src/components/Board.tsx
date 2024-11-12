import React from 'react';
import { TreeIcon, WarningIcon } from './Icons';
import { Position, Territory } from '../types/game';

interface BoardProps {
  board: boolean[][];
  territories: Territory[];
  errors: Position[];
  territoryErrors: number[];
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

const TERRITORY_COLORS = [
  'bg-red-100',
  'bg-blue-100',
  'bg-green-100',
  'bg-yellow-100',
  'bg-purple-100',
  'bg-pink-100',
];

const Board: React.FC<BoardProps> = ({ 
  board, 
  territories, 
  errors, 
  territoryErrors, 
  onCellClick, 
  disabled 
}) => {
  const getTerritoryId = (row: number, col: number): number => {
    return territories.findIndex(t => 
      t.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  const isError = (row: number, col: number) => {
    return errors.some(err => err.row === row && err.col === col);
  };

  const isTerritoryError = (row: number, col: number) => {
    const territoryId = getTerritoryId(row, col);
    return territoryErrors.includes(territoryId);
  };

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))` }}>
      {board.map((row, rowIndex) => (
        row.map((cell, colIndex) => {
          const territoryId = getTerritoryId(rowIndex, colIndex);
          const hasError = isError(rowIndex, colIndex);
          const hasTerritoryError = isTerritoryError(rowIndex, colIndex);

          return (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onCellClick(rowIndex, colIndex)}
              disabled={disabled}
              className={`
                aspect-square p-2 rounded-lg transition-all duration-200
                ${TERRITORY_COLORS[territoryId % TERRITORY_COLORS.length]}
                ${hasError || hasTerritoryError ? 'ring-2 ring-red-500' : 'hover:brightness-95'}
                ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                ${(hasError || hasTerritoryError) && 'animate-pulse'}
              `}
            >
              {cell && (
                <div className="w-full h-full text-gray-700">
                  {hasError || hasTerritoryError ? (
                    <WarningIcon />
                  ) : (
                    <TreeIcon />
                  )}
                </div>
              )}
            </button>
          );
        })
      ))}
    </div>
  );
};

export default Board;