export interface Position {
  row: number;
  col: number;
}

export interface Territory {
  id: number;
  cells: Position[];
}

export interface GameState {
  board: boolean[][];
  territories: Territory[];
  errors: Position[];
  territoryErrors: number[];
  isStarted: boolean;
  isTimeUp: boolean;
  isWon: boolean;
}

export type CellTerritory = number | null;

export interface GameAction {
  type: 'START_GAME' | 'RESET_GAME' | 'TOGGLE_CELL' | 'TIME_UP' | 'SET_WIN';
  payload?: {
    row?: number;
    col?: number;
  };
}