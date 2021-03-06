var canvas = document.getElementById("canv");
var c = canvas.getContext("2d");

class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 160;
        this.h = 40;
        this.ySpeed = 0;
        this.dead = false;
    }
    show() {
        //c.fillStyle = 'gray';
        //c.fillRect(this.x, this.y, this.w, this.h);
        c.drawImage(document.getElementById("shipImg"), this.x, this.y, this.w, this.h);
        this.y += this.ySpeed;

        if (this.dead) {
            this.ySpeed = 3;
        }
    }
}

class Debris {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.pick = Math.floor(Math.random() * 3);
        this.w = this.pick === 0 ? 50 : 30;
        this.h = this.pick === 0 ? 50 : 30;
        this.xSpeed = 10
        this.needsAdd = true;
    }
    show() {
        //c.fillStyle = 'brown';
        //c.fillRect(this.x, this.y, this.w, this.h);
        c.drawImage(document.getElementById("debrisImg"), this.x, this.y, this.w, this.h);
    }
    update() {
        this.x -= this.xSpeed;

        if (ship.x + ship.w > this.x && ship.x < this.x + this.w && ship.y + ship.h > this.y && ship.y + 22 < this.y + this.h) {
            ship.dead = true;
        }

        if (ship.x + ship.w - 64 > this.x && ship.x < this.x + this.w && ship.y + ship.h > this.y && ship.y < this.y + this.h) {
            ship.dead = true;
        }

        if (ship.x + ship.w > this.x + this.w && this.needsAdd && !ship.dead) {
            score += this.w === 30 ? 1 : 2;
            this.needsAdd = false;
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 10;
    }
    update() {
        this.x -= this.speed;
    }
}

class Particle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        //position particle
        //pick dir
        this.pickDir = Math.floor(Math.random() * 2);
    }
    show() {
        c.fillStyle = 'dimgray';
        c.beginPath();
        c.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
        c.fill();
        c.closePath();
        this.y -= 5 / 2;
        if (this.y <= 800) {
            if (this.pickDir === 0) {
                this.x -= random(1 / 2, 3 / 2);
            } else {
                this.x += random(1 / 2, 3 / 2);
            }
        }
    }
}

var onMobile = false;

var ship;

var debris = [];

//time is in milliseconds
var timeBetweenDebrisSpawn = 1000;

var atMainMenu = true;
var atDeathScreen = false;

var score = 0;

var touchX;
var touchY;

var touching = false;

var points = [];

var pointX = 0;

var particles = [];

var dbgOpacity = 0.0;
var textOpacity = 0.0;

window.addEventListener('touchstart', function (e) {
    onMobile = true;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touching = true;
})
window.addEventListener('touchend', function () {
    touching = false;
    //ship.ySpeed = 0;
})
window.addEventListener('touchmove', function (e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
})

window.onload = function () {
    start();
    setInterval(update, 10);
}

function start() {
    ship = new Ship(100, 280);
    partX = ship.x + ship.w / 2;
    partY = ship.y;
    //generate terrain
    for (let i = 0; i < 1000; i++) {
        var point = new Point(pointX, random(550, 590));
        points.push(point);
        pointX += 200;
    }
}

function update() {
    if (atMainMenu) {
        //main menu background
        c.drawImage(document.getElementById("mainBackground"), 0, 0, 800, 600);
    } else if (atDeathScreen) {
        //death screen background
        c.fillStyle = 'gray';
        c.fillRect(0, 0, 800, 800);
        //death screen elements
        document.getElementById("showMaydayAlert").style.display = "none";
        document.getElementById("deathText").style.display = "block";
        document.getElementById("playAgainButton").style.display = "block";
    } else {
        document.getElementById("titleM").style.display = "none";
        document.getElementById("playButton").style.display = "none";
        //background
        c.fillStyle = 'lightblue';
        c.fillRect(0, 0, 800, 600);
        //ship
        ship.show();
        //debris
        for (let i = 0; i < debris.length; i++) {
            debris[i].show();
            debris[i].update();
        }
        //show mayday animation
        if (ship.dead && ship.y < 800) {
            maydayAnimation();
        }
        if (ship.y + ship.h * 2 > 800) {
            for (let i = 0; i < points.length; i++) {
                if (points[i].speed > 0) {
                    points[i].speed -= 0.1;
                }
                if (points[0].speed <= 0) {
                    //points[i] = 0;
                }
            }
            for (let i = 0; i < debris.length; i++) {
                if (debris[i].xSpeed > 5) {
                    debris[i].xSpeed -= 0.1;
                }
                if (debris[0].xSpeed <= 5) {
                    debris[i].xSpeed = 5;
                }
            }
            setTimeout(explode, 500);
            setTimeout(deathScreen, 4000);
        }
        //show player score
        c.fillStyle = 'white';
        c.font = "50px Courier New";
        c.fillText(`Score: ${score}`, 500, 100);
        //move ship to where player taps
        if (!ship.dead) {
            if (touchY > ship.y && touching) {
                ship.ySpeed = 5;
            }
            if (touchY < ship.y + ship.h && touching) {
                ship.ySpeed = -5;
            }
            if (touchY > ship.y && touchY < ship.y + ship.h) {
                ship.ySpeed = 0;
            }
            if (!touching && onMobile) {
                ship.ySpeed = 0;
            }
        }
        //particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].show();
        }
        //terrain
        for (let i = 1; i < points.length; i++) {
            //draw lines between points to generate random terrain
            c.beginPath();
            c.lineWidth = 2;
            c.moveTo(points[i - 1].x, points[i - 1].y);
            c.lineTo(points[i - 1].x, 900);
            c.lineTo(points[i].x, 900);
            c.lineTo(points[i].x, points[i].y);
            c.fillStyle = 'green';
            c.fill();
            c.closePath();
        }
        for (let i = 0; i < points.length; i++) {
            points[i].update();
        }
    }
}

function keyDown(e) {
    switch (e.keyCode) {
        case 40:
            if (!ship.dead) {
                ship.ySpeed = 5;
            }
            break;
        case 38:
            if (!ship.dead) {
                ship.ySpeed = -5;
            }
            break;
        case 87:
            if (!ship.dead) {
                ship.ySpeed = -5;
            }
            break;
        case 83:
            if (!ship.dead) {
                ship.ySpeed = 5;
            }
            break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 40:
            if (!ship.dead) {
                ship.ySpeed = 0;
            }
            break;
        case 38:
            if (!ship.dead) {
                ship.ySpeed = 0;
            }
            break;
        case 87:
            if (!ship.dead) {
                ship.ySpeed = 0;
            }
            break;
        case 83:
            if (!ship.dead) {
                ship.ySpeed = 0;
            }
            break;
    }
}

document.onkeydown = keyDown;
document.onkeyup = keyUp;

function generateDebris() {
    var d = new Debris(1000, Math.floor(Math.random() * 600));
    debris.push(d);
    setTimeout(generateDebris, timeBetweenDebrisSpawn);
}

function decreaseInterval() {
    if (timeBetweenDebrisSpawn > 100) {
        timeBetweenDebrisSpawn -= 100;
    }
}
function increaseSpeed() {
    for (let i = 0; i < debris.length; i++) {
        debris[i].xSpeed += 3;
    }
}

function startGame() {
    atMainMenu = false;
    if (!atMainMenu) {
        generateDebris();
        document.getElementById("tutorial").style.display = "none";
        document.getElementById("text").style.display = "none";

        setInterval(decreaseInterval, 2000);
        setInterval(increaseSpeed, 10000);
    }
}

function maydayAnimation() {
    document.getElementById("showMaydayAlert").style.display = "block";
}

function deathScreen() {
    atDeathScreen = true;
}

function playAgain() {
    location.reload();
}

function up() {
    if (!ship.dead && touching) {
        ship.ySpeed = -5;
    }
}

function down() {
    if (!ship.dead && touching) {
        ship.ySpeed = 5;
    }
}

function tutorial() {
    document.write('<h1>How to play on computer (or if you have a keyboard)</h1>');
    document.write('<h2>Controls: Up and Down arrow keys on keyboard, or W and S keys. The goal of the game is to dodge the rocks coming towards you as you fly in your spaceship. When you hit a rock you will lose control and crash into the ground</h2>');
    document.write("<h1>How to play on mobile (or if you don't have a keyboard but you have a touch-screen device)</h1>");
    document.write('<h2>Controls: Tap where you want the ship to go, or hold your finger on your device and move your finger while holding your finger down (swipe controls). The goal of the game is to dodge the rocks coming towards you as you fly in your spaceship. When you hit a rock you will loose control and crash into the ground</h2>');
    document.write('<button onclick="location.reload()">Click here to go back to main menu</button>');
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var partX;
var partY;

function explode() {
    for (let i = 0; i < 20; i++) {
        var part = new Particle(partX, partY, 20, 20);
        particles.push(part);
        if (partX >= 200) {
            partY += 30;
        } else {
            partX += 40;
        }
    }
}