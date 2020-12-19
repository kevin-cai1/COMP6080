let grid = new Array(4);

for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(4);
}

grid[0][0] = 2;
//grid[0][2] = 4;

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.ceil(max));
}

const gameOver = () => {
    let game = document.getElementById("grid-container");
    game.innerHTML = "<h1>Game Over</h1>";
    console.log(game);
}

const spawnNewTile = (grid) => {
    let emptyTiles = 0;
    let emptyRowIndex = new Array(16);
    let emptyColIndex = new Array(16);
    let emptyIndex = 0;
    for (row in grid) {
        for (col in grid) {
            if (grid[row][col] === 'undefined' || grid[row][col] == null) {
                emptyTiles++;
                emptyRowIndex[emptyIndex] = row;
                emptyColIndex[emptyIndex] = col;
                emptyIndex++;
            }
        }
    }
    if (emptyTiles > 0) {
        let newTile = getRandomInt(emptyTiles);
        let newX = emptyRowIndex[newTile];
        let newY = emptyColIndex[newTile];
        grid[newX][newY] = (getRandomInt(2) + 1) * 2;
    } else {
        gameOver();
    }
   
}
  
const shiftRight = (grid) => {
    for (row in grid) {
        for (let i = grid[row].length - 1; i > 0; i--) {
            if (typeof grid[row][i] === "undefined" || grid[row][i] == null) {
                grid[row][i] = grid[row][i-1];
                grid[row][i-1] = null;
            } else if (grid[row][i] == grid[row][i-1]) {
                let newVal = parseInt(grid[row][i]) + parseInt(grid[row][i-1]) ;
                grid[row][i] = newVal;
                grid[row][i-1] = null;
            }
        }
    }
};

const shiftLeft = (grid) => {
    for (row in grid) {
        for (let i = 0; i < grid[row].length-1; i++) {
            if (typeof grid[row][i] === "undefined" || grid[row][i] == null) {
                grid[row][i] = grid[row][i+1];
                grid[row][i+1] = null;
            } else if (grid[row][i] == grid[row][i+1]) {
                let newVal = parseInt(grid[row][i]) + parseInt(grid[row][i+1]) ;
                grid[row][i] = newVal;
                grid[row][i+1] = null;
            }
        }
    }
};

const shiftDown = (grid) => {
    for (col in grid) {
        for (let i = grid[col].length - 1; i > 0; i--) {
            if (typeof grid[i][col] === "undefined" || grid[i][col] == null) {
                grid[i][col] = grid[i-1][col];
                grid[i-1][col] = null;
            } else if (grid[i][col] == grid[i-1][col]) {
                let newVal = parseInt(grid[i][col]) + parseInt(grid[i-1][col]) ;
                grid[i][col] = newVal;
                grid[i-1][col] = null;
            }
        }
    }
};

const shiftUp = (grid) => {
    for (col in grid) {
        for (let i = 0; i < grid[col].length-1; i++) {
            if (typeof grid[i][col] === "undefined" || grid[i][col] == null) {
                grid[i][col] = grid[i+1][col];
                grid[i+1][col] = null;
            } else if (grid[i][col] == grid[i+1][col]) {
                let newVal = parseInt(grid[i][col]) + parseInt(grid[i+1][col]) ;
                grid[i][col] = newVal;
                grid[i+1][col] = null;
            }
        }
    }
};

const slide = (direction) => {
    if (direction === "up") {
        for (let i = 0; i < 4; i++) {
            shiftUp(grid);
        }
    } else if (direction === "down") {
        for (let i = 0; i < 4; i++) {
            shiftDown(grid);
        }
    } else if (direction === "left") {
        for (let i = 0; i < 4; i++) {
            shiftLeft(grid);
        }
    } else if (direction === "right") {
        for (let i = 0; i < 4; i++) {
            shiftRight(grid);
        }
    }
    spawnNewTile(grid);
}

const translateGridValue = (value) => {
    if (value === 2) {
        return "two";
    } else if (value === 4) {
        return "four";
    } else if (value === 8) {
        return "eight";
    } else if (value === 16) {
        return "sixteen";
    } else if (value === 32) {
        return "thirty-two";
    } else if (value === 64) {
        return "sixty-four";
    } else if (value === 128) {
        return "one-twenty-eight";
    } else if (value === 256) {
        return "two-fifty-six";
    } else {
        return "space";
    }
}

const render = (grid) => {
    const tiles = document.getElementsByClassName("column");

    for (row in grid) {
        for (col in grid[row]) {
            let index = (parseInt(row) * 4) + parseInt(col);
            tiles[index].id = translateGridValue(grid[row][col]);
        }
    }
}

document.addEventListener('keydown', event => {
    if (event.key == 'ArrowUp') {
        slide("up");
    } else if (event.key == 'ArrowDown') {
        slide("down");
    } else if (event.key == 'ArrowLeft') {
        slide("left");   
    } else if (event.key == 'ArrowRight') {
        slide("right");
    }
    render(grid);
});

document.addEventListener('load', render(grid));
