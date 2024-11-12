import React from 'react';
import { TreeIcon, PlayIcon, ResetIcon } from './components/Icons';
import Board from './components/Board';
import Timer from './components/Timer';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { state, handleCellClick, startGame, resetGame, handleTimeUp } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-green-600">
              <TreeIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">CrossTree</h1>
          </div>
          {state.isStarted && !state.isWon && (
            <Timer 
              duration={180} 
              onTimeUp={handleTimeUp}
              isPaused={state.isWon} 
            />
          )}
        </div>

        <Board 
          board={state.board}
          territories={state.territories}
          errors={state.errors}
          territoryErrors={state.territoryErrors}
          onCellClick={handleCellClick}
          disabled={!state.isStarted || state.isTimeUp || state.isWon}
        />

        <div className="mt-8 flex flex-col items-center gap-4">
          {!state.isStarted ? (
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <div className="w-5 h-5">
                <PlayIcon />
              </div>
              Play Game
            </button>
          ) : (
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <div className="w-5 h-5">
                <ResetIcon />
              </div>
              Reset Game
            </button>
          )}

          {state.isWon && (
            <div className="text-xl font-bold text-green-600 animate-bounce">
              🎄 Congratulations! You won! 🎄
            </div>
          )}

          {state.isTimeUp && !state.isWon && (
            <div className="text-xl font-bold text-red-600">
              Time's up! Try again!
            </div>
          )}
        </div>

        {state.isStarted && !state.isTimeUp && !state.isWon && (
          <div className="mt-6 text-center text-gray-600">
            Place exactly one tree in each colored territory. Trees can't share rows, columns, or diagonals.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;