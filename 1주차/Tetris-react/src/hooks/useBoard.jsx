// src/hooks/useBoard.jsx

import { useState, useEffect } from 'react';

export const useBoard = (player, resetPlayer) => {
  const [board, setBoard] = useState(createBoard());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);
    
    const sweepRows = newBoard => {
      return newBoard.reduce((acc, row) => {
        if (row.findIndex(cell => cell === 0) === -1) {
          setRowsCleared(prev => prev + 1);
          acc.unshift(new Array(newBoard[0].length).fill(0));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);
    };

    const updateBoard = prevBoard => {
      // 이전 보드를 초기화
      const newBoard = prevBoard.map(row =>
        row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
      );

      // 현재 플레이어의 테트로미노를 그립니다
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newBoard[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });

      // 충돌이 발생했다면 줄을 확인하고 새로운 테트로미노를 생성
      if (player.collided) {
        resetPlayer();
        return sweepRows(newBoard);
      }

      return newBoard;
    };

    setBoard(prev => updateBoard(prev));
  }, [player, resetPlayer]);

  return [board, setBoard, rowsCleared];
};

const createBoard = () => 
  Array.from(Array(20), () => Array(10).fill([0, 'clear']));