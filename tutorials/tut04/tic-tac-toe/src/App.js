import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [board, setBoard] = React.useState([ ["", "", ""], ["", "", ""], ["", "", ""] ]);
  const [turnX, setTurnX] = React.useState(true);

  const updateCell = (x, y) => {
    const newBoard = [ ... board ];
    newBoard[x][y] = turnX ? 'X' : 'O';
    setBoard(newBoard);
    setTurnX(!turnX);
  };
  return (
    <div className="App">
      <table border="1">
        {board.map((row, rowIndex) => (
          <tr>
            {row.map((cell, cellIndex) => (
              <td onClick={() => updateCell(rowIndex, cellIndex)}>{cell}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
