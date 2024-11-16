// src/components/Cell.jsx

import React from 'react';
import { TETROMINOS } from '../constants/tetrominos';

const Cell = ({ type }) => (
  <div
    className={`w-8 h-8 border border-gray-900 ${
      type === 0 
        ? 'bg-gray-900' 
        : `bg-[rgb(${TETROMINOS[type].color})]`
    }`}
  />
);

export default React.memo(Cell);