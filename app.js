// called the canvas from the html
const canvas = document.querySelector(".game");
const ctx = canvas.getContext("2d");

// gave the background pice im using width and hegiht
canvas.width = 550;
canvas.height = 800;

// created a class for the player that will be controlling the ship
class Player {
  constructor(x, y, bulletController) {
    this.x = x;
    this.y = y;
    this.bulletController = bulletController;
    this.width = 50;
    this.height = 50;
    this.speed = 4;
    this.image = new Image();
    this.image.src = "ship.png";

    // added  the event listenrs to invoke the players controls
    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);
  }

  drawImage(ctx) {
    this.move();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.shoot();
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
    if (this.downPressed) {
      this.y += this.speed;
    }
    if (this.upPressed) {
      this.y -= this.speed;
    }
    if (this.leftPressed) {
      this.x -= this.speed;
    }
    if (this.rightPressed) {
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

//class constructor for animes

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
  bulletController.draw(ctx);
  player.drawImage(ctx);
}

setInterval(gameLoop, 1000 / 60);
