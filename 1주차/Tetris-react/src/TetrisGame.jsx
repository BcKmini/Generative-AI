// src/TetrisGame.jsx

import React, { useState } from 'react';
import { useBoard } from './hooks/useBoard';
import { useGameStatus } from './hooks/useGameStatus';
import Board from './components/Board';
import Display from './components/Display';
import StartButton from './components/StartButton';
import Controls from './components/Controls';

const TetrisGame = () => {
  const [dropTime, setDropTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [board, setBoard, rowsCleared] = useBoard(player, resetPlayer);
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

  const movePlayer = dir => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const startGame = () => {
    setBoard(createBoard());
    setDropTime(1000);
    resetPlayer();
    setGameOver(false);
    setScore(0);
    setRows(0);
    setLevel(1);
  };

  const drop = () => {
    // 10줄 제거할 때마다 레벨 업
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1);
      setDropTime(1000 / (level + 1) + 200);
    }

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="relative bg-gray-800 p-8 rounded-lg">
        <Board board={board} />
        <div className="ml-8">
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callback={startGame} />
          <Controls
            movePlayer={movePlayer}
            dropPlayer={drop}
            rotatePlayer={playerRotate}
          />
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;