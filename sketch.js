// Constant values (as of now)
var size = 5;
var start_x = 10;
var start_y = 10;
var no_trees = 120;

var board;
var next_board;

var grow_chance;
var lightning_chance;
var burning_chance;

var generation;
// This one needs to be set by other functions
var start_generation = false;

// "Semi-const" value, can be changed on each iteration
var max_generation;

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

// Initializes all non-const values
// Useful for reseting the current stage of the CA
function init_values() {
  generation = 1;

  grow_chance = document.getElementById("grow_chance").value;
  lightning_chance = document.getElementById("lightning_chance").value;
  burning_chance = document.getElementById("burning_chance").value;
  max_generation = document.getElementById("max_generation").value;
  

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
}

function setup() {
  frameRate(30);

  createCanvas(start_x + no_trees * size, start_y + no_trees * size).parent("sketch-container");
}

function update_board() {
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
}

function draw_board() {
  for (var i = 0; i < no_trees; i++) {
    for (var j = 0; j < no_trees; j++) {
      board[i][j].draw();
    }
  }
}

function draw() {
  
  if (start_generation) {
    if (generation >= max_generation) {
      noLoop();
      console.log("Finished!");
    }
    generation++;
    console.log("On generation " + generation + " / " + max_generation);
    
    // Calculate the next board
    update_board();
    
    // Draw the next board
    draw_board();
  }
}

function mouseClicked() {
  var x = Math.trunc(mouseX / size);
  var y = Math.trunc(mouseY / size);

  try {
    board[x][y].state = BURNING;
  }
  catch (exc) {
    console.warn("Clicked outside of canvas!");
  }
}

// Callback function for the 'Start!' button
function start() {
  // Stop any current looping
  // noLoop();

  init_values();
  
  // Draw the initial state of the board
  draw_board();

  // This needs to be at the very end so that all values are set
  start_generation = true;

  // loop();
}