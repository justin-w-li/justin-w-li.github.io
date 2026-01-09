// GAME LOADER
const gameLink = document.getElementById('game');

gameLink.addEventListener('click', function(event) {
    event.preventDefault();
    const game = document.createElement('script');
    game.type = 'text/javascript';
    game.src = 'game.js';
    document.head.appendChild(game);
}, {once: true});