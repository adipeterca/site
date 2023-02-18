// Constant values (as of now)
var size = 5;
var start_x = 10;
var start_y = 10;
var no_trees = 120;

var board;
var next_board;

var grow_chance, grow_chance_element;
var lightning_chance, lightning_chance_element;
var burning_chance, burning_chance_element;
var speed_element;

var generation;

// Possible states for the application
const STOP = 0;            // Describes the initial state
const CAN_DRAW = 1;        // If lighting is 0, a mouse click on the board is requiered to start
const DRAW = 2;             // The draw() function can be called

// The current state of the application
var current_state = STOP;

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

  grow_chance = grow_chance_element.value;
  lightning_chance = lightning_chance_element.value;
  burning_chance = burning_chance_element.value;

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
  
  createCanvas(start_x + no_trees * size, start_y + no_trees * size).parent("sketch-container");
  
  // Add event listeners for each input field
  grow_chance_element = document.getElementById("grow_chance");
  lightning_chance_element = document.getElementById("lightning_chance");
  burning_chance_element = document.getElementById("burning_chance");
  speed_element = document.getElementById("speed");
  
  frameRate(speed_element.value);

  grow_chance_element.addEventListener("input", () => {
    grow_chance = grow_chance_element.value;
  });
  
  lightning_chance_element.addEventListener("input", () => {
    lightning_chance = lightning_chance_element.value;
  });
  
  burning_chance_element.addEventListener("input", () => {
    burning_chance = burning_chance_element.value;
  });

  speed_element.addEventListener("input", () => {
    frameRate(parseInt(speed_element.value));
  });

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
  
  if (current_state == DRAW) {
    generation++;
    // console.log("On generation " + generation);
    
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
    if (current_state == CAN_DRAW) {
      current_state = DRAW;
    }
  }
  catch (exc) {
    console.warn("Clicked outside of canvas!");
  }
}

// Callback function for the 'Start!' button
function start() {

  init_values();
  
  // Draw the initial state of the board
  draw_board();

  // This needs to be at the very end so that all values are set
  if (lightning_chance == 0) {
    current_state = CAN_DRAW;
  }
  else {
    current_state = DRAW;
  }
}