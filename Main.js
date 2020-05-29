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
        
        if (ship.x + ship.w > this.x && ship.x < this.x + this.w && ship.y + ship.h > this.y && ship.y+22 < this.y + this.h) {
            ship.dead = true;
        }
        
        if (ship.x + ship.w-64 > this.x && ship.x < this.x + this.w && ship.y + ship.h > this.y && ship.y < this.y + this.h) {
            ship.dead = true;
        }

        if (ship.x + ship.w > this.x + this.w && this.needsAdd && !ship.dead) {
            score += this.w === 30 ? 1 : 2;
            this.needsAdd = false;
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

window.addEventListener('touchstart', function(e) {
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    touching = true;
    if (touchX > 850 && touchX < 850 + 100 && touchY > 203 && touchY < 203 + 100) {
        down();
    }
    if (touchX > 850 && touchX < 850 + 100 && touchY > 50 && touchY < 50 + 100) {
        up();
    }
})
window.addEventListener('touchend', function() {
    touching = false;
    ship.ySpeed = 0;
})

window.onload = function() {
    start();
    setInterval(update, 10);
}

function start() {
    ship = new Ship(100, 280);
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
        if (ship.y > 800) {
            deathScreen();
        }
        //show player score
        c.fillStyle = 'white';
        c.font = "50px Courier New";
        c.fillText(`Score: ${score}`, 500, 100);
    }
}

function keyDown(e) {
    switch(e.keyCode){
        case 40:
            if (!ship.dead) {
                ship.ySpeed=5;
            }
            break;
        case 38:
            if (!ship.dead) {
                ship.ySpeed=-5;
            }
            break;
    }
}

function keyUp(e) {
    switch(e.keyCode){
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
        timeBetweenDebrisSpawn-=100;
    }
}
function increaseSpeed() {
    for (let i = 0; i < debris.length; i++) {
        debris[i].xSpeed+=3;
    }
}

function startGame() {
    atMainMenu = false;
    if (!atMainMenu) {
        generateDebris();
    
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

function enableMobile() {
    document.getElementById("goUp").style.display = "block";
    document.getElementById("goDown").style.display = "block";
    document.getElementById("mobileEnable").style.display = "none";
    onMobile = true;
}