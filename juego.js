

/* =========================================
   VARIABLES GLOBALES
========================================= */

var fondo;
var carro;
var cursores;

var enemigosNivel1;
var enemigosNivel2;
var barriles;

var timerEnemigos;
var timerEnemigos2;
var timerBarriles;

var textoPuntos;
var textoVidas;
var textoNivel;

var puntos = 0;
var vidas = 3;
var nivel = 1;

var velocidadFondo = 3;
var velocidadEnemigos = 200;
var velocidadBarriles = 200;

var invulnerable = false;
var juegoTerminado = false;
var resultado = '';




var Portada = {

    create: function () {

        juego.stage.backgroundColor = '#222222';

        var titulo = juego.add.text(
            145, 130,
            'JUEGO DE CARRERAS',
            {
                font: '21px Arial',
                fill: '#FFFFFF',
                fontWeight: 'bold',
                align: 'center'
            }
        );

        titulo.anchor.setTo(0.5);

        var nombre = juego.add.text(
            145, 220,
            'Jesus Anicama:\nJesus Anicama',
            {
                font: '16px Arial',
                fill: '#FFFF00',
                align: 'center'
            }
        );

        nombre.anchor.setTo(0.5);

        var instrucciones = juego.add.text(
            145, 320,
            'CONTROLES\n\n' +
            'Flecha izquierda: Moverse a la izquierda\n' +
            'Flecha derecha: Moverse a la derecha\n\n' +
            'Recoge gasolina y evita los enemigos.',
            {
                font: '12px Arial',
                fill: '#FFFFFF',
                align: 'center'
            }
        );

        instrucciones.anchor.setTo(0.5);

        var iniciar = juego.add.text(
            145, 440,
            'PRESIONA ENTER PARA COMENZAR',
            {
                font: '15px Arial',
                fill: '#00FF00',
                fontWeight: 'bold',
                align: 'center'
            }
        );

        iniciar.anchor.setTo(0.5);

        function comenzar() {
            juego.state.start('Juego');
        }

        juego.input.onDown.addOnce(comenzar);

        juego.input.keyboard
            .addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(comenzar);
    }
};




var Juego = {

    preload: function () {

        
        juego.load.image('bg', 'img/img/bg.png');
        juego.load.image('carro', 'img/img/carro.png');
        juego.load.image('carroMalo', 'img/img/carroMalo.png');
        juego.load.image('carroMalo1', 'img//img/carroMalo1.png');
        juego.load.image('gasolina', 'img/img/gas.png');
        juego.load.image('explosion', 'img/img/explosion.png');

        juego.forceSingleUpdate = true;
    },


    create: function () {

        
        puntos = 0;
        vidas = 3;
        nivel = 1;

        velocidadFondo = 3;
        velocidadEnemigos = 200;
        velocidadBarriles = 200;

        invulnerable = false;
        juegoTerminado = false;

        // Activar física
        juego.physics.startSystem(Phaser.Physics.ARCADE);

        // Fondo
        fondo = juego.add.tileSprite(
            0, 0, 290, 540, 'bg'
        );

        // Vehículo del jugador
        carro = juego.add.sprite(
            juego.width / 2,
            496,
            'carro'
        );

        carro.anchor.setTo(0.5);

        juego.physics.arcade.enable(carro);

        carro.body.collideWorldBounds = true;


        /* =================================
           ENEMIGOS DEL NIVEL 1
        ================================= */

        enemigosNivel1 = juego.add.group();

        enemigosNivel1.enableBody = true;
        enemigosNivel1.physicsBodyType = Phaser.Physics.ARCADE;

        enemigosNivel1.createMultiple(20, 'carroMalo');

        enemigosNivel1.setAll('anchor.x', 0.5);
        enemigosNivel1.setAll('anchor.y', 0.5);

        enemigosNivel1.setAll('outOfBoundsKill', true);
        enemigosNivel1.setAll('checkWorldBounds', true);


        /* =================================
           ENEMIGOS DEL NIVEL 2
        ================================= */

        enemigosNivel2 = juego.add.group();

        enemigosNivel2.enableBody = true;
        enemigosNivel2.physicsBodyType = Phaser.Physics.ARCADE;

        enemigosNivel2.createMultiple(20, 'carroMalo1');

        enemigosNivel2.setAll('anchor.x', 0.5);
        enemigosNivel2.setAll('anchor.y', 0.5);

        enemigosNivel2.setAll('outOfBoundsKill', true);
        enemigosNivel2.setAll('checkWorldBounds', true);


        /* =================================
           BARRILES DE GASOLINA
        ================================= */

        barriles = juego.add.group();

        barriles.enableBody = true;
        barriles.physicsBodyType = Phaser.Physics.ARCADE;

        barriles.createMultiple(20, 'gasolina');

        barriles.setAll('anchor.x', 0.5);
        barriles.setAll('anchor.y', 0.5);

        barriles.setAll('outOfBoundsKill', true);
        barriles.setAll('checkWorldBounds', true);


        /* =================================
           MARCADORES
        ================================= */

        var panel = juego.add.graphics(0, 0);

        panel.beginFill(0x000000, 0.6);
        panel.drawRect(0, 0, 290, 52);
        panel.endFill();

        textoPuntos = juego.add.text(
            8, 8,
            'Puntos: 0/6',
            {
                font: '14px Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 2
            }
        );

        textoVidas = juego.add.text(
            190, 8,
            'Vidas: 3',
            {
                font: '14px Arial',
                fill: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 2
            }
        );

        textoNivel = juego.add.text(
            8, 29,
            'Nivel: 1',
            {
                font: '13px Arial',
                fill: '#FFFF00',
                stroke: '#000000',
                strokeThickness: 2
            }
        );


        /* =================================
           TEMPORIZADORES
        ================================= */

        timerEnemigos = juego.time.events.loop(
            1500,
            this.crearEnemigoNivel1,
            this
        );

        timerBarriles = juego.time.events.loop(
            2000,
            this.crearBarril,
            this
        );

        // Controles
        cursores = juego.input.keyboard.createCursorKeys();
    },


    /* =========================================
       UPDATE
    ========================================= */

    update: function () {

        if (juegoTerminado) {
            return;
        }

        // Movimiento del fondo
        fondo.tilePosition.y += velocidadFondo;

        // Movimiento del jugador
        if (cursores.right.isDown && carro.x < 245) {

            carro.x += 5;

        } else if (cursores.left.isDown && carro.x > 45) {

            carro.x -= 5;

        }


        // Colisión con enemigos del nivel 1
        juego.physics.arcade.overlap(
            carro,
            enemigosNivel1,
            this.colisionEnemigo,
            null,
            this
        );


        // Colisión con enemigos del nivel 2
        juego.physics.arcade.overlap(
            carro,
            enemigosNivel2,
            this.colisionEnemigo,
            null,
            this
        );


        // Colisión con barriles
        juego.physics.arcade.overlap(
            carro,
            barriles,
            this.recolectarBarril,
            null,
            this
        );

    },


    /* =========================================
       CREAR ENEMIGOS NIVEL 1
    ========================================= */

    crearEnemigoNivel1: function () {

        var posiciones = [73, 145, 217];

        var posicion = Math.floor(
            Math.random() * 3
        );

        var enemigo = enemigosNivel1.getFirstDead();

        if (enemigo === null) {
            return;
        }

        enemigo.reset(posiciones[posicion], 0);

        enemigo.body.velocity.y = velocidadEnemigos;
    },


    /* =========================================
       CREAR ENEMIGOS NIVEL 2
    ========================================= */

    crearEnemigoNivel2: function () {

        var posiciones = [73, 145, 217];

        var posicion = Math.floor(
            Math.random() * 3
        );

        var enemigo = enemigosNivel2.getFirstDead();

        if (enemigo === null) {
            return;
        }

        enemigo.reset(posiciones[posicion], 0);

        enemigo.body.velocity.y = velocidadEnemigos;
    },


    /* =========================================
       CREAR BARRILES
    ========================================= */

    crearBarril: function () {

        var posiciones = [73, 145, 217];

        var posicion = Math.floor(
            Math.random() * 3
        );

        var gasolina = barriles.getFirstDead();

        if (gasolina === null) {
            return;
        }

        gasolina.reset(posiciones[posicion], 0);

        gasolina.body.velocity.y = velocidadBarriles;
    },


    /* =========================================
       EFECTO DE EXPLOSIÓN
    ========================================= */

    mostrarExplosion: function (x, y) {

        var efecto = juego.add.image(
            x, y, 'explosion'
        );

        efecto.anchor.setTo(0.5);

        efecto.width = 48;
        efecto.height = 48;

        juego.time.events.add(350, function () {

            if (efecto && efecto.exists) {
                efecto.destroy();
            }

        }, this);
    },


    /* =========================================
       COLISIÓN CONTRA ENEMIGOS
    ========================================= */

    colisionEnemigo: function (jugador, enemigo) {

        if (juegoTerminado) {
            return;
        }

        // Evitar perder muchas vidas por un choque
        if (invulnerable) {

            enemigo.kill();

            return;
        }

        // Guardar posición del enemigo
        var x = enemigo.x;
        var y = enemigo.y;

        // Eliminar enemigo
        enemigo.kill();

        // Mostrar explosión
        this.mostrarExplosion(x, y);

        // Restar vida
        vidas--;

        textoVidas.text = 'Vidas: ' + vidas;

        // Protección temporal
        invulnerable = true;

        carro.alpha = 0.5;

        juego.time.events.add(
            800,
            function () {

                invulnerable = false;
                carro.alpha = 1;

            },
            this
        );

        // Comprobar derrota
        if (vidas <= 0) {

            this.finalizarPartida('perdiste');

        }
    },


    /* =========================================
       RECOGER BARRILES
    ========================================= */

    recolectarBarril: function (jugador, gasolina) {

        if (juegoTerminado) {
            return;
        }

        gasolina.kill();

        puntos++;

        textoPuntos.text = 'Puntos: ' + puntos + '/6';

        // Pasar al segundo nivel
        if (nivel === 1 && puntos >= 3) {

            this.cambiarNivel();

        }

        // Ganar al completar los dos niveles
        else if (nivel === 2 && puntos >= 6) {

            this.finalizarPartida('ganaste');

        }
    },


    /* =========================================
       CAMBIO AL NIVEL 2
    ========================================= */

    cambiarNivel: function () {

        nivel = 2;

        // Detener temporizador del primer nivel
        juego.time.events.remove(timerEnemigos);

        // Eliminar enemigos anteriores
        enemigosNivel1.callAll('kill');

        // Aumentar velocidad
        velocidadFondo = 5;

        velocidadEnemigos = 340;

        velocidadBarriles = 260;

        // Actualizar marcador
        textoNivel.text = 'Nivel: 2';

        // Cambiar temporizador de enemigos
        timerEnemigos2 = juego.time.events.loop(
            1000,
            this.crearEnemigoNivel2,
            this
        );

        // Aumentar frecuencia de los barriles
        juego.time.events.remove(timerBarriles);

        timerBarriles = juego.time.events.loop(
            1600,
            this.crearBarril,
            this
        );

        // Eliminar los barriles que quedaron en pantalla
        barriles.callAll('kill');
    },


    

    finalizarPartida: function (estado) {

        if (juegoTerminado) {
            return;
        }

        juegoTerminado = true;

        resultado = estado;

        juego.state.start('Terminado');
    }

};




var Terminado = {

    create: function () {

        juego.stage.backgroundColor = '#222222';

        var mensaje;

        if (resultado === 'ganaste') {

            mensaje = '¡GANASTE!';

        } else {

            mensaje = '¡VUELVE A INTENTARLO!';

        }

        var titulo = juego.add.text(
            145, 180,
            mensaje,
            {
                font: '23px Arial',
                fill: resultado === 'ganaste' ? '#00FF00' : '#FF0000',
                fontWeight: 'bold',
                align: 'center'
            }
        );

        titulo.anchor.setTo(0.5);

        var marcador = juego.add.text(
            145, 260,
            'Puntaje final: ' + puntos + '\n' +
            'Nivel alcanzado: ' + nivel,
            {
                font: '17px Arial',
                fill: '#FFFFFF',
                align: 'center'
            }
        );

        marcador.anchor.setTo(0.5);

        var reiniciar = juego.add.text(
            145, 390,
            'PRESIONA ENTER PARA REINICIAR',
            {
                font: '14px Arial',
                fill: '#FFFF00',
                align: 'center'
            }
        );

        reiniciar.anchor.setTo(0.5);

        function volver() {

            juego.state.start('Portada');

        }

        juego.input.onDown.addOnce(volver);

        juego.input.keyboard
            .addKey(Phaser.Keyboard.ENTER)
            .onDown.addOnce(volver);
    }

};
