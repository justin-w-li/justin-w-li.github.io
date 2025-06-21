const SCREEN_WIDTH = window.screen.width;
const SCREEN_HEIGHT = window.screen.height;

let initialWidth = 400;
let initialHeight = 400;

let initialLeft = SCREEN_WIDTH/2 - initialWidth/2;
let initialTop = SCREEN_HEIGHT/2 - initialHeight/2;

function openGame() {
    window.open(
        "game.html", "_blank",
        `width=${initialWidth},height=${initialHeight},
        left=${initialLeft},top=${initialTop}`
    );
}

const gameLink = document.getElementById('game');

gameLink.addEventListener('click', function(event) {
    event.preventDefault();
    openGame();
});