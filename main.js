/// FLOW
// 1. Display Grid
// 2. Display Snake
// 3. Game Loop
// 4. Move Snake
// 5. Increase/Decrease Size
// 6. Food
// 7. Collision

/// DOCUMENT ON LOAD EVENT (START)
window.onload = function () {
  // GRID
  const GAMECOMPONENT = document.querySelector("#game");
  const GRIDSIZE = 50;
  let can_move = true;

  function RenderGame() {
    let grid_component = "";

    // For loop to display the game
    for (let i = 0; i < GRIDSIZE; i++) {
      grid_component += "<div style='display: flex;'>";

      for (let j = 0; j < GRIDSIZE; j++) {
        let flag = false;

        // Check each body of the snake object if aligns with the grid then display the body
        SNAKE.body.forEach((body) => {
          if (body.y == i && body.x == j) {
            grid_component +=
              "<div style='width: 20px; height: 20px; background-color: green; outline: 1px solid black;'></div>";
            flag = true;
          }
        });

        // If theres no snake part on this current iteration then display the grid
        if (!flag) {
          if (FOOD.location.x == j && FOOD.location.y == i) {
            grid_component +=
              "<div style='width: 20px; height: 20px; background-color: red; outline: 1px solid black;'></div>";
          } else {
            grid_component +=
              "<div style='width: 20px; height: 20px; outline: 1px solid green;'></div>";
          }
        }
      }

      grid_component += "</div>";
    }

    GAMECOMPONENT.innerHTML = grid_component;
  }

  function GenerateFood() {
    // First I store the snake's body pieces location in an array to avoid
    // spawning the food in snake's position.
    let snake_parts = [];

    for (let i = 0; i < SNAKE.body.length; i++) {
      snake_parts.push([SNAKE.body[i].x, SNAKE.body[i].y]);
    }

    // After I store them, I'll use loop to repeatedly locate a safe
    // or valid position for the food to spawn
    while (true) {
      // Generate a number
      let flag;
      let x = Math.floor(Math.random() * GRIDSIZE);
      let y = Math.floor(Math.random() * GRIDSIZE);

      flag = snake_parts.some(function (location) {
        return location.x == x && location.y == y;
      });

      if (!flag) {
        FOOD.location.x = x;
        FOOD.location.y = y;
        break;
      }
    }
  }

  // FOOD
  const FOOD = {
    location: {
      x: 0,
      y: 0,
    },
  };

  // SNAKE
  const SNAKE = {
    direction: "left",
    body: [
      {
        x: GRIDSIZE / 2,
        y: GRIDSIZE / 2,
      },
      {
        x: GRIDSIZE / 2 + 1,
        y: GRIDSIZE / 2,
      },
      {
        x: GRIDSIZE / 2 + 2,
        y: GRIDSIZE / 2,
      },
    ],

    AddBody: function () {
      // Add Body Method
      let body = this.body;

      /// To define the location where to put the new part of the snake
      // Get the next location of last part then
      // Get the difference of its current location to
      // Get the position of this part
      let snake_x = (body.at(-1).x = body.x - body.at(-1).next_loc.x);
      let snake_y = (body.at(-1).y = body.y - body.at(-1).next_loc.y);

      this.body.push({
        x: snake_x,
        y: snake_y,
      });
    },
    Draw: function () {
      this.MoveSnake();
      this.BodyCollision();
      this.Boundary();
      this.EatFood();
    },
    MoveSnake: function () {
      // Move Method
      let body = this.body;

      for (let i = body.length - 1; i >= 0; i--) {
        if (i == 0) {
          if (this.direction == "left") {
            this.body[i].x -= 1;
          } else if (this.direction == "up") {
            this.body[i].y -= 1;
          } else if (this.direction == "right") {
            this.body[i].x += 1;
          } else if (this.direction == "down") {
            this.body[i].y += 1;
          }

          break;
        } else {
          // Update the next location part
          this.body[i].next_loc = {
            x: this.body[i - 1].x,
            y: this.body[i - 1].y,
          };

          // Move this part
          this.body[i].x = this.body[i].next_loc.x;
          this.body[i].y = this.body[i].next_loc.y;
        }
      }
    },
    BodyCollision: function () {
      // First I store the snake's body pieces location in an array to avoid
      // spawning the food in snake's position.
      let snake_parts = [];
      const SNAKE_COPY = this.body;

      for (let i = 1; i < this.body.length; i++) {
        snake_parts.push([this.body[i].x, this.body[i].y]);
      }

      let flag = snake_parts.some(function (location) {
        return SNAKE_COPY[0].x == location[0] && SNAKE_COPY[0].y == location[1];
      });

      if (flag) {
        alert("GAME OVER");
        location.reload();
      }
    },
    Boundary: function () {
      if (this.body[0].x < 0) {
        this.body[0].x = GRIDSIZE - 1;
      } else if (this.body[0].x == GRIDSIZE) {
        this.body[0].x = 0;
      } else if (this.body[0].y < 0) {
        this.body[0].y = GRIDSIZE - 1;
      } else if (this.body[0].y == GRIDSIZE) {
        this.body[0].y = 0;
      }
    },
    EatFood: function () {
      // Eat Food
      if (
        this.body[0].x == FOOD.location.x &&
        this.body[0].y == FOOD.location.y
      ) {
        GenerateFood();
        this.AddBody();
      }
    },
  };

  // GAME LOOP
  GenerateFood();
  RenderGame();

  setInterval(function () {
    SNAKE.Draw();
    RenderGame();
  }, 100);

  // MOVE EVENT
  window.addEventListener("keydown", function (e) {
    // Check condition then set movement to false, wait for 100 ms to reactivate again.
    if (e.key == "ArrowUp" && SNAKE.direction != "down" && can_move) {
      SNAKE.direction = "up";
      can_move = false;
      this.setTimeout(function () {
        can_move = true;
      }, 100);
    } else if (e.key == "ArrowDown" && SNAKE.direction != "up" && can_move) {
      SNAKE.direction = "down";
      can_move = false;
      this.setTimeout(function () {
        can_move = true;
      }, 100);
    } else if (e.key == "ArrowLeft" && SNAKE.direction != "right" && can_move) {
      SNAKE.direction = "left";
      can_move = false;
      this.setTimeout(function () {
        can_move = true;
      }, 100);
    } else if (e.key == "ArrowRight" && SNAKE.direction != "left" && can_move) {
      SNAKE.direction = "right";
      can_move = false;
      this.setTimeout(function () {
        can_move = true;
      }, 100);
    }
  });
};
