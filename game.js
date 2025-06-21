const SCREEN_WIDTH = window.screen.width;
const SCREEN_HEIGHT = window.screen.height;
const TOOLBAR_HEIGHT = window.outerHeight-window.innerHeight;
const WINDOW_MIN = 145;

var gamePiece;

function startGame() {
    let initialX = window.innerWidth/2 + window.screenLeft;
    let initialY = window.innerHeight/2 + window.screenTop;
    let pieceSize = 30;
    let initialWindow = 400;

    gamePiece = new Player(
        "#aaaaff", initialX, initialY,
        pieceSize, pieceSize, initialWindow, initialWindow
    );
    gameArea.start();
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
    },
    update : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

class Sprite {
    constructor(color, x, y, width, height, windowW, windowH) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.windowW = windowW;
        this.windowH = windowH;
    }
    rewindow() {
        let tempWindowW = Math.min(
            this.windowW, this.x+this.windowW/2,
            SCREEN_WIDTH-(this.x-this.windowW/2));
        let tempWindowH = Math.min(
            this.windowH, this.y+this.windowH/2,
            SCREEN_HEIGHT-(this.y-this.windowH/2));
        window.resizeTo(tempWindowW, tempWindowH+TOOLBAR_HEIGHT);
        window.moveTo(this.x-this.windowW/2, this.y-this.windowH/2);
    }
    draw() {
        this.rewindow();

        let ctx = gameArea.context;
        let relX = this.x - window.screenLeft;
        let relY = this.y - window.screenTop;

        ctx.fillStyle = this.color;
        ctx.fillRect(relX-this.width/2, relY-this.height/2, this.width, this.height);
    }
    getSpriteEdge(edge) {
        switch (edge) {
            case "top":
                return this.y-this.height/2;
            case "left":
                return this.x-this.width/2;
            case "bottom":
                return this.y+this.height/2;
            case "right":
                return this.x+this.width/2;
        }
    }
    getWindowEdge(edge) {
        switch (edge) {
            case "top":
                return window.screenTop;
            case "left":
                return window.screenLeft;
            case "bottom":
                return window.screenTop + window.innerHeight;
            case "right":
                return window.screenLeft + window.innerWidth;
        }
    }
    inBounds() {
        if (this.getSpriteEdge("top") < this.getWindowEdge("top")) {
            this.y = window.screenTop + this.height/2;
        }
        if (this.getSpriteEdge("left") < this.getWindowEdge("left")) {
            this.x = window.screenLeft + this.width/2;
        }
        if (this.getSpriteEdge("bottom") > this.getWindowEdge("bottom")) {
            this.y = window.screenTop + window.innerHeight - this.height/2;
        }
        if (this.getSpriteEdge("right") > this.getWindowEdge("right")) {
            this.x = window.screenLeft + window.innerWidth - this.width/2;
        }
    }
}

class Player extends Sprite {
    constructor(color, x, y, width, height, windowW, windowH) {
        super(color, x, y, width, height, windowW, windowH);
        this.speedX = 0;
        this.speedY = 0;
        this.expand = 0;
        this.billowRate = 0.9;
        // this.pos = new Array(20);
    }
    draw() {
        this.rewindow();
        super.draw();
        
        let ctx = gameArea.context;
        let relX = this.x - window.screenLeft;
        let relY = this.y - window.screenTop;

        // ctx.fillStyle = this.color;
        // for (const pos of this.pos) {
        //     if (pos === undefined) { continue; }
        //     ctx.fillRect(pos[0]-window.screenLeft-this.width/2,
        //                  pos[1]-window.screenTop-this.height/2,
        //                  this.width, this.height);
        // }

        ctx.lineWidth = 2;
        ctx.globalAlpha = Math.max(0, 1-0.5*(this.windowW-WINDOW_MIN)/100);
        ctx.strokeStyle = "#ffaaaa";
        ctx.strokeRect(relX-WINDOW_MIN/2, relY-WINDOW_MIN/2, WINDOW_MIN, WINDOW_MIN);
    }
    update() {
        if (this.expand > 1) {
            this.windowW += this.expand;
            this.windowH += this.expand;
            this.expand *= this.billowRate;
        }
        this.shrinkWindow();
    	this.x += this.speedX;
        this.y += this.speedY;
        this.inBounds();

        // this.pos.shift();
        // this.pos.push([this.x, this.y]);
    }
    billow() {
        let windowSmaller = Math.min(this.windowW, this.windowH);
        let billowAmount = windowSmaller >= 400
            ? 150 : 24000/windowSmaller + 90;
        console.log(billowAmount);
        this.expand = billowAmount * (1 - this.billowRate);
    }
    shrinkWindow() {
        if (this.expand > 1) { return; }
        let windowBigger = Math.max(this.windowW, this.windowH);
        let shrinkAmount = windowBigger >= 600
            ? (windowBigger-500)/400+1 : ((windowBigger-100)**2)/400000+0.5;
        this.windowW = Math.max(this.windowW-shrinkAmount, WINDOW_MIN);
        this.windowH = Math.max(this.windowH-shrinkAmount, WINDOW_MIN);
    }
}

function updateGameArea() {
    gameArea.update();
    gamePiece.update();
    gamePiece.draw();
}

window.addEventListener("load", () => {
    startGame();
});

window.addEventListener("beforeunload", function(e){
   e.preventDefault();
});

window.addEventListener("keydown", (e) => {
    switch (e.key) {
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

window.addEventListener("keyup", (e) => {
    switch (e.key) {
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

document.body.style.overflow = 'hidden';