

var juego = new Phaser.Game(
    290,
    540,
    Phaser.AUTO,
    'game-container'
);

juego.state.add('Portada', Portada);
juego.state.add('Juego', Juego);
juego.state.add('Terminado', Terminado);

juego.state.start('Portada');

