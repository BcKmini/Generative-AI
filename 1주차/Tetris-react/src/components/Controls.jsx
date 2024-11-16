// src/components/Controls.jsx

import React from 'react';

const Controls = ({ movePlayer, dropPlayer, rotatePlayer }) => {
  const handleKeyPress = ({ keyCode }) => {
    switch (keyCode) {
      case 37: // 왼쪽 화살표
        movePlayer(-1);
        break;
      case 39: // 오른쪽 화살표
        movePlayer(1);
        break;
      case 40: // 아래쪽 화살표
        dropPlayer();
        break;
      case 38: // 위쪽 화살표
        rotatePlayer();
        break;
      default:
        break;
    }
  };

  return (
    <div className="mt-4 text-center text-sm text-gray-400">
      <div>← → : Move</div>
      <div>↑ : Rotate</div>
      <div>↓ : Drop</div>
    </div>
  );
};

export default Controls;