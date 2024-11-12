import { Territory, Position } from '../types/game';

function canPlaceTree(
  board: boolean[][],
  row: number,
  col: number,
  size: number
): boolean {
  // Check row
  for (let i = 0; i < size; i++) {
    if (i !== col && board[row][i]) return false;
  }

  // Check column
  for (let i = 0; i < size; i++) {
    if (i !== row && board[i][col]) return false;
  }

  // Check diagonals
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i !== row && j !== col && board[i][j]) {
        if (Math.abs(i - row) === Math.abs(j - col)) {
          return false;
        }
      }
    }
  }

  return true;
}

function solve(
  board: boolean[][],
  territories: Territory[],
  territoryIndex: number,
  size: number
): boolean {
  if (territoryIndex >= territories.length) {
    return true;
  }

  const territory = territories[territoryIndex];
  
  // Try each cell in the current territory
  for (const cell of territory.cells) {
    if (!board[cell.row][cell.col] && canPlaceTree(board, cell.row, cell.col, size)) {
      board[cell.row][cell.col] = true;
      
      if (solve(board, territories, territoryIndex + 1, size)) {
        return true;
      }
      
      board[cell.row][cell.col] = false;
    }
  }

  return false;
}

export function isPuzzleSolvable(territories: Territory[], size: number): boolean {
  const board = Array(size).fill(null).map(() => Array(size).fill(false));
  return solve(board, territories, 0, size);
}