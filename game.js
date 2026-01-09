// GAME LOGIC

let gamePiece;

function startGame() {
    let initialX = window.innerWidth/2 + window.screenLeft;
    let initialY = window.innerHeight/2 + window.screenTop;
    let pieceSize = 30;

    gamePiece = new Player(
        initialX, initialY, pieceSize, pieceSize
    );

    // start game loop
    gameArea.start();
}

let gameArea = {
    canvas : document.createElement("canvas"),
    
    start : function() {
        // fix canvas to window
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0px';
        this.canvas.style.left = '0px';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '88';
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });

        // make clicks go through
        this.canvas.style.pointerEvents = 'none';
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);

        // 50 fps timer for game loop
        this.interval = setInterval(updateGameArea, 20);
    },

    // used to avoid rendering graphics outside of the window
    update : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

function updateGameArea() {
    gameArea.update();
    gamePiece.update();
    gamePiece.draw();
}


// SPRITES

class Sprite {
    constructor(color, x, y, width, height) {
        this.color = color; // color of sprite
        this.x = x; // absolute position of sprite center on screen
        this.y = y;
        this.width = width; // width of sprite
        this.height = height;
    }
    draw() {
        let ctx = gameArea.context;
        let relX = this.x - window.screenLeft;
        let relY = this.y - window.screenTop;

        ctx.fillStyle = this.color;
        ctx.fillRect(relX-this.width/2, relY-this.height/2, this.width, this.height);
    }
}

function interpolate(color1, color2, t) {
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);

    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

class Player extends Sprite {
    constructor(x, y, width, height) {
        super("#000000", x, y, width, height);
        this.color = "#aaaaff";
        this.color2 = "#6953b9"
        this.speedX = 0; // current speed of player
        this.speedY = 0;
        this.length = 20;
        this.tail = []; // array of tail positions
    }
    draw() {
        let ctx = gameArea.context;

        // draw tail of snake
        let len = this.tail.length;
        for (let i = len - 1; i >= 0; i--) {
            let pos = this.tail[i];
            ctx.fillStyle = interpolate(this.color, this.color2, i / len);
            ctx.fillRect(pos[0]-window.screenLeft-this.width/2,
                         pos[1]-window.screenTop-this.height/2,
                         this.width, this.height);
        }

        // draw head
        super.draw();
    }
    update() {
        // add old pos to tail if moved
        if (this.speedX != 0 || this.speedY != 0) {
            this.tail.unshift([this.x, this.y]);
            if (this.tail.length > this.length) {
                this.tail.pop();
            }
        }

        // update pos
    	this.x += this.speedX;
        this.y += this.speedY;
    }
}


// EVENT HANDLERS

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            gamePiece.speedY = -5;
            break;
        case "a":
            gamePiece.speedX = -5;
            break;
        case "s":
            gamePiece.speedY = 5;
            break;
        case "d":
            gamePiece.speedX = 5;
            break;
        case " ":
            gamePiece.billow();
            break;
    }
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            gamePiece.speedY = Math.max(gamePiece.speedY, 0);
            break;
        case "s":
            gamePiece.speedY = Math.min(gamePiece.speedY, 0);
            break;
        case "a":
            gamePiece.speedX = Math.max(gamePiece.speedX, 0);
            break;
        case "d":
            gamePiece.speedX = Math.min(gamePiece.speedX, 0);
            break;
    }
});


// START

startGame();