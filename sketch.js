var size = 5;
var start_x = 10;
var start_y = 10;
var no_trees = 120;

var board;
var next_board;

var grow_chance = 0.05;
var lightning_chance = 0.000001;
var burning_chance = 0.55;

var generation = 1;

const GREEN = 1, BURNING = 2, EMPTY = 0;

class Tree {
  constructor(x, y, state) {
    this.x = x;
    this.y = y;
    this.state = state;
  }

  draw() {
    if (this.state == GREEN) {
      fill(0, 255, 0);
    }
    else if (this.state == BURNING) {
      fill(255, 255, 0);
    }
    else if (this.state == EMPTY) {
      fill(0, 0, 0);
    }
    else {
      console.log("Illegal state!")
    }

    square(this.x, this.y, size);
  }
}

function setup() {
  frameRate(30);

  createCanvas(start_x + no_trees * size, start_y + no_trees * size);

  board = new Array(no_trees);
  next_board = new Array(no_trees);
  for (let i = 0; i < no_trees; i++) {
    board[i] = new Array(no_trees);
    next_board[i] = new Array(no_trees);
  }

  for (var i = 0; i < no_trees; i++) {
    for (var j = 0; j < no_trees; j++) {
      board[i][j] = new Tree(i * size, j * size, GREEN);
    }
  }

  // Start point
  // board[no_trees / 2][no_trees / 2].state = BURNING;
}

function draw() {
  // console.log("Currently at generation " + generation++);

  // Draw the current board
  for (var i = 0; i < no_trees; i++) {
    for (var j = 0; j < no_trees; j++) {
      board[i][j].draw();
    }
  }

  // Calculate the next board
  for (var i = 0; i < no_trees; i++) {
    for (var j = 0; j < no_trees; j++) {
      // In case the next board does not update (for example, a tree does not burn)
      next_board[i][j] = board[i][j].state;

      // Empty cell
      if (board[i][j].state == EMPTY) {
        if (grow_chance > Math.random()) {
          next_board[i][j] = GREEN;
        }
      }

      // Burning cell
      if (board[i][j].state == BURNING) {
        next_board[i][j] = EMPTY;
      }

      // Green cell
      if (board[i][j].state == GREEN) {
        has_burning_neighboars = false;
        for (var ii = -1; ii <= 1; ii++) {
          for (var jj = -1; jj <= 1; jj++) {
            try {
              if (board[i+ii][j+jj].state == BURNING) {
                has_burning_neighboars = true;
                break;
              }
            }
            catch (err) {

            }
          }
          if (has_burning_neighboars) {
            break;
          }
        }

        if (has_burning_neighboars) {
          if (burning_chance > Math.random()) {
            next_board[i][j] = BURNING;
          }
        }
        else {
          if (lightning_chance > Math.random()) {
            next_board[i][j] = BURNING;
          }
        }
      }
    }
  }

  for (var i = 0; i < no_trees; i++) {
    for (var j = 0; j < no_trees; j++) {
      board[i][j].state = next_board[i][j];
    }
  }

  // Info data
  
}

function mouseClicked() {
  // console.log("Pressed mouse at (" + mouseX + ", " + mouseY + ")");
  var x = Math.trunc(mouseX / size);
  var y = Math.trunc(mouseY / size);

  // console.log(x + ", " + y)
  try {
    board[x][y].state = BURNING;
  }
  catch (exc) {
    console.warn("Clicked outside of canvas!");
  }
}
