// called the canvas from the html
const canvas = document.querySelector(".game");
const ctx = canvas.getContext("2d");

// gave the background pice im using width and hegiht
canvas.width = 550;
canvas.height = 800;

let enemies = [];
let enemiesReachedBottom = 0;

// created a class for the player that will be controlling the ship
class Player {
  constructor(x, y, bulletController) {
    this.x = x;
    this.y = y;
    this.bulletController = bulletController;
    this.width = 50;
    this.height = 50;
    this.speed = 4;
    this.score = 0;
    this.image = new Image();
    this.image.src = "ship.png";

    // added  the event listenrs to invoke the players controls
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  drawImage(ctx) {
    this.move();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.drawScore(ctx);
    this.shoot();
  }

  drawScore(ctx) {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.score}`, 10, 30);
  }

  // made a function when the keys are pressed the ship will move and shoot

  shoot() {
    if (this.shootPressed) {
      let speed = 5;
      let delay = 6;
      let damage = 1;
      let bulletX = this.x + this.width / 2;
      const bulletY = this.y;
      this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
    }
  }

  move() {
    if (this.downPressed && this.y + this.height < canvas.height) {
      this.y += this.speed;
    }
    if (this.upPressed && this.y > 0) {
      this.y -= this.speed;
    }
    if (this.leftPressed && this.x > 0) {
      this.x -= this.speed;
    }
    if (this.rightPressed && this.x + this.width < canvas.width) {
      this.x += this.speed;
    }
  }

  keydown = (e) => {
    if (e.code === "ArrowUp") {
      this.upPressed = true;
    }
    if (e.code === "ArrowDown") {
      this.downPressed = true;
    }
    if (e.code === "ArrowLeft") {
      this.leftPressed = true;
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = true;
    }
    if (e.code === "Space") {
      this.shootPressed = true;
    }
  };
  keyup = (e) => {
    if (e.code === "ArrowUp") {
      this.upPressed = false;
    }
    if (e.code === "ArrowDown") {
      this.downPressed = false;
    }
    if (e.code === "ArrowLeft") {
      this.leftPressed = false;
    }
    if (e.code === "ArrowRight") {
      this.rightPressed = false;
    }
    if (e.code === "Space") {
      this.shootPressed = false;
    }
  };
}

// class constructor for the bulletconroller
class BulletController {
  bullets = [];
  nextBullet = 0;
  constructor(canvas) {
    this.canvas = canvas;
  }
  shoot(x, y, speed, damage, delay) {
    if (this.nextBullet <= 0) {
      this.bullets.push(new Bullet(x, y, speed, damage));
      this.nextBullet = delay;
    }
    this.nextBullet--;
  }
  draw(ctx) {
    this.bullets.forEach((bullet) => {
      if (this.isBulletOffScreen(bullet)) {
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
      }
      bullet.draw(ctx);
    });
  }
  isBulletOffScreen(bullet) {
    return bullet.y <= -bullet.height;
  }
}

// class constructor for the bullet
class Bullet {
  constructor(x, y, speed, damage) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;

    this.width = 5;
    this.height = 15;
    this.color = "yellow";
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    this.y -= this.speed;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

//class constructor for alien animes

class Enemy {
  constructor(x, y, health) {
    this.width = 40;
    this.height = 40;
    this.image = new Image();
    this.image.src = "enemies.jpg";

    if (x < 0) {
      x = 0;
    } else if (x + this.width > canvas.width) {
      x = canvas.width - this.width;
    }

    this.x = x;
    this.y = y;
    this.health = health;
  }

  drawImage(ctx) {
    if (this.health > 0) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  takeDamage() {
    this.health--;
    if (this.health <= 0) {
      const index = enemies.indexOf(this);
      enemies.splice(index, 1);
      player.score += 1;
    }
  }

  update() {
    if (this.y + this.height < canvas.height) {
      this.y += 2;
    } else {
      enemiesReachedBottom++;

      if (enemiesReachedBottom >= 1) {
        gameOver();
      }
    }
  }
}

let bulletController = new BulletController(canvas);
let player = new Player(
  canvas.width / 2.2,
  canvas.height / 1.3,
  bulletController
);
// declared the background image and the linked the file in js
let backgroundImage = new Image();
backgroundImage.src = "background.jpeg";

//main function for the game
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Create new enemies randomly
  if (Math.random() < 0.02) {
    const enemy = new Enemy(Math.random() * canvas.width, -60, 2);
    enemies.push(enemy);
  }

  // draw the enemies
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.drawImage(ctx);

    // Check if the enemy is hit by a bullet
    bulletController.bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        enemy.takeDamage();
        bulletController.bullets.splice(bulletIndex, 1);
      }
    });

    // Checking if the enemy reaches the bottom of the screen
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });

  // draw the bullets and the player
  bulletController.draw(ctx);
  player.drawImage(ctx);
}

setInterval(gameLoop, 350 / 60);
