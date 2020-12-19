import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [board, setBoard] = React.useState([["2","","",""], ["","","",""], ["","","",""], ["","","",""]]);

  const handleKeyDown = (event) => {
    if (event.key == "ArrowUp") {
      shiftUp();
      updateBoard();
    } else if (event.key == "ArrowDown") {
      shiftDown();
      updateBoard();
    } else if (event.key == "ArrowLeft") {
      shiftLeft();
      updateBoard();
    } else if (event.key == "ArrowRight") {
      shiftRight();
      updateBoard();
    }
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.ceil(max));
  }
  

  const spawnTile = () => {
    let emptyTiles = 0;
    let emptyX = new Array(16);
    let emptyY = new Array(16);
    let index = 0;
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {
        if (board[x][y] == "") {
          emptyTiles++;
          emptyX[index] = x;
          emptyY[index] = y;
          index++;
        }
      }
    }
    let newBoard = [ ... board];
    if (emptyTiles > 0) {
      let randomTile = getRandomInt(emptyTiles);
      newBoard[emptyX[randomTile]][emptyY[randomTile]] = (getRandomInt(2) + 1) * 2;
    } else {
      newBoard = [["GAME OVER"]];
    }
    return newBoard;
  }

  const shiftRight = () => {
    for (let i = 0; i < board.length; i++) {
      for (let x = 0; x < board.length; x++) {
        for (let y = board[x].length - 1; y > 0; y--) {
          if (board[x][y] == "") {
            board[x][y] = board[x][y-1];
            board[x][y-1] = "";
          }
        }
      }
    }
  };

  const shiftLeft = () => {
    for (let i = 0; i < board.length; i++) {
      for (let x = 0; x < board.length; x++) {
        for (let y = 0; y < board[x].length-1; y++) {
          if (board[x][y] == "") {
            board[x][y] = board[x][y+1];
            board[x][y+1] = "";
          }
        }
      }
    }
  };

  const shiftDown = () => {
    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board.length; y++) {
        for (let x = board[y].length - 1; x > 0; x--) {
          if (board[x][y] == "") {
            board[x][y] = board[x-1][y];
            board[x-1][y] = "";
          }
        }
      }
    }
  };

  const shiftUp = () => {
    for (let i = 0; i < board.length; i++) {
      for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length-1; x++) {
          if (board[x][y] == "") {
            board[x][y] = board[x+1][y];
            board[x+1][y] = "";
          }
        }
      }
    }
  };

  const updateBoard = () => {
    let newBoard = [ ... board];
    newBoard = spawnTile();
    setBoard(newBoard);

  };
  
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className="App">
      <table border="1">
        {board.map((row, rowIndex) => (
          <tr>
            {row.map((cell, cellIndex) => (
              <td>{cell}</td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
}

export default App;
