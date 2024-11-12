import { useReducer, useCallback } from 'react';
import { GameState, GameAction, Position, Territory } from '../types/game';
import { generateTerritories } from '../utils/territoryGenerator';

const BOARD_SIZE = 6;
const REQUIRED_TERRITORIES = 6;

const initialState: GameState = {
  board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(false)),
  territories: [],
  errors: [],
  territoryErrors: [],
  isStarted: false,
  isTimeUp: false,
  isWon: false,
};

function checkWinCondition(board: boolean[][], territories: Territory[]): boolean {
  return !findConflicts(board).length && !findTerritoryErrors(board, territories).length;
}

function findTerritoryErrors(board: boolean[][], territories: Territory[]): number[] {
  return territories
    .map((territory, index) => {
      const treeCount = territory.cells.reduce((count, { row, col }) => 
        count + (board[row][col] ? 1 : 0), 0);
      return treeCount === 1 ? -1 : index;
    })
    .filter(index => index !== -1);
}

function findConflicts(board: boolean[][]): Position[] {
  const errors: Position[] = [];
  
  // Check rows and columns
  for (let i = 0; i < BOARD_SIZE; i++) {
    const rowTrees: number[] = [];
    const colTrees: number[] = [];
    
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j]) rowTrees.push(j);
      if (board[j][i]) colTrees.push(j);
    }
    
    if (rowTrees.length > 1) {
      rowTrees.forEach(col => errors.push({ row: i, col }));
    }
    if (colTrees.length > 1) {
      colTrees.forEach(row => errors.push({ row, col: i }));
    }
  }

  // Check diagonals
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j]) {
        for (let k = 0; k < BOARD_SIZE; k++) {
          for (let l = 0; l < BOARD_SIZE; l++) {
            if (board[k][l] && (i !== k || j !== l)) {
              if (Math.abs(i - k) === Math.abs(j - l)) {
                errors.push({ row: i, col: j });
                errors.push({ row: k, col: l });
              }
            }
          }
        }
      }
    }
  }

  return errors;
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      try {
        return {
          ...initialState,
          territories: generateTerritories(BOARD_SIZE, REQUIRED_TERRITORIES),
          isStarted: true,
        };
      } catch (error) {
        console.error('Failed to generate puzzle:', error);
        return state;
      }
      
    case 'RESET_GAME':
      return initialState;
      
    case 'TOGGLE_CELL': {
      if (!state.isStarted || state.isTimeUp || !action.payload) return state;
      
      const { row, col } = action.payload;
      const newBoard = state.board.map(r => [...r]);
      newBoard[row][col] = !newBoard[row][col];
      
      const errors = findConflicts(newBoard);
      const territoryErrors = findTerritoryErrors(newBoard, state.territories);
      const isWon = checkWinCondition(newBoard, state.territories);
      
      return {
        ...state,
        board: newBoard,
        errors,
        territoryErrors,
        isWon,
      };
    }
    
    case 'TIME_UP':
      return {
        ...state,
        isTimeUp: true,
      };
      
    default:
      return state;
  }
}

export function useGameLogic() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleCellClick = useCallback((row: number, col: number) => {
    dispatch({ type: 'TOGGLE_CELL', payload: { row, col } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const handleTimeUp = useCallback(() => {
    dispatch({ type: 'TIME_UP' });
  }, []);

  return {
    state,
    handleCellClick,
    startGame,
    resetGame,
    handleTimeUp,
  };
}