import { Territory, Position } from '../types/game';
import { isPuzzleSolvable } from './puzzleValidator';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAdjacentCells(pos: Position, size: number): Position[] {
  const adjacent: Position[] = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dx, dy] of directions) {
    const newRow = pos.row + dx;
    const newCol = pos.col + dy;
    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
      adjacent.push({ row: newRow, col: newCol });
    }
  }

  return adjacent;
}

function isCellAvailable(
  cell: Position,
  territories: Territory[],
): boolean {
  return !territories.some(territory =>
    territory.cells.some(pos => pos.row === cell.row && pos.col === cell.col)
  );
}

function generateTerritoriesAttempt(size: number, count: number): Territory[] {
  const territories: Territory[] = [];
  const cellsPerTerritory = Math.floor((size * size) / count);

  for (let i = 0; i < count; i++) {
    let territory: Territory = { id: i, cells: [] };
    let attempts = 0;
    const maxAttempts = 100;

    // Find a starting cell
    while (attempts < maxAttempts && territory.cells.length === 0) {
      const startRow = getRandomInt(0, size - 1);
      const startCol = getRandomInt(0, size - 1);
      const startCell = { row: startRow, col: startCol };

      if (isCellAvailable(startCell, territories)) {
        territory.cells.push(startCell);
      }
      attempts++;
    }

    // Grow the territory
    while (territory.cells.length < cellsPerTerritory && attempts < maxAttempts) {
      const currentCell = territory.cells[getRandomInt(0, territory.cells.length - 1)];
      const adjacentCells = getAdjacentCells(currentCell, size)
        .filter(cell => isCellAvailable(cell, territories));

      if (adjacentCells.length > 0) {
        const nextCell = adjacentCells[getRandomInt(0, adjacentCells.length - 1)];
        territory.cells.push(nextCell);
      }
      attempts++;
    }

    if (territory.cells.length > 0) {
      territories.push(territory);
    }
  }

  // Fill remaining cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const cell = { row, col };
      if (isCellAvailable(cell, territories)) {
        // Find closest territory
        let minDist = Infinity;
        let closestTerritory = territories[0];

        for (const territory of territories) {
          for (const territoryCell of territory.cells) {
            const dist = Math.abs(cell.row - territoryCell.row) + 
                        Math.abs(cell.col - territoryCell.col);
            if (dist < minDist) {
              minDist = dist;
              closestTerritory = territory;
            }
          }
        }

        closestTerritory.cells.push(cell);
      }
    }
  }

  return territories;
}

export function generateTerritories(size: number, count: number): Territory[] {
  const maxAttempts = 100;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const territories = generateTerritoriesAttempt(size, count);
    if (isPuzzleSolvable(territories, size)) {
      return territories;
    }
    attempts++;
  }
  
  throw new Error('Failed to generate a solvable puzzle after maximum attempts');
}