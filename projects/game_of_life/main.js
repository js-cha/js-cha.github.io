class GameOfLife {

  constructor(cols, rows, cell_width, cell_height) {
    this.cols = cols;
    this.rows = rows;
    this.cell_width = cell_width;
    this.cell_height = cell_height;
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.grid = [];
  }

  createGrid() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
    }
    return this.grid;
  }

  populate(grid) {
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) {
        var random = Math.floor(Math.random() * 2);

        if (random === 1) {
          this.grid[i][j] = 1
        } else {
          this.grid[i][j] = 0;
        }
      }

  }

  render(grid) {
    grid.forEach((cell, index) => {
      for (let i = 0; i < this.cols; i++) {
        if (cell[i] == 1) {
          this.ctx.fillStyle = "#000";
          this.ctx.fillRect(index * this.cell_width, i * this.cell_height, 5, 5);
        }
      }
    });
  }

  updateCells() {
    let next_state = Array.from(this.grid);

    for (let x = 1; x < this.cols - 1; x++) {
      for (let y = 1; y < this.rows - 1; y++) {

        let count = 0;

        if (this.grid[x - 1][y - 1] == 1) {
          count++;
        }

        if (this.grid[x][y - 1] == 1) {
          count++;
        }

        if (this.grid[x + 1][y - 1] == 1) {
          count++;
        }

        if (this.grid[x - 1][y] == 1) {
          count++;
        }

        if (this.grid[x + 1][y] == 1) {
          count++;
        }

        if (this.grid[x + 1][y + 1] == 1) {
          count++;
        }

        if (this.grid[x][y + 1] == 1) {
          count++;
        }

        if (this.grid[x - 1][y + 1] == 1) {
          count++;
        }

        if (this.grid[x][y] == 0 && count == 3) {
          next_state[x][y] = 1;
        } else if (this.grid[x][y] == 1 && count < 2) {
          next_state[x][y] = 0;
        } else if (this.grid[x][y] == 1 && count > 3) {
          next_state[x][y] = 0;
        } else if (this.grid[x][y] == 1 && count > 2 && count == 3) {
          next_state[x][y] = 1;
        } else {
          next_state[x][y] = 0;
        }


      }
    }

    setInterval(() => {
      this.ctx.clearRect(0, 0, 500, 500);
      this.grid = next_state;
      this.render(next_state);
      this.updateCells();
    }, 500);
  }

  printGrid() {
    console.log(this.grid);
  }

}

let params = [100, 100, 5, 5];
let newGame = new GameOfLife(...params);


newGame.createGrid();
newGame.populate(newGame.grid);
newGame.render(newGame.grid);
newGame.updateCells();