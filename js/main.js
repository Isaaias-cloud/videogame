// 🎨 DESHABILITAR SUAVIZADO DE IMAGEN PARA PIXEL ART  
ctx.imageSmoothingEnabled = false;

// 🎯 CAMBIAR EL CURSOR A UNA MIRA PERSONALIZADA  
canvas.style.cursor = "url('assets/mira.png') 16 16, auto";

// 🔊 CARGAR SONIDO DE CLIC  
const clickSound = new Audio("assets/sound.mp3");
// 🔊 Cargar sonido de daño desde el archivo de audio
const damageSound = new Audio("assets/sound_damage.mp3");

// 🌌 CARGAR IMAGEN DE FONDO DEL JUEGO  
const bgImage = new Image();
bgImage.src = "assets/fondo_game.png";

// 🏃‍♂️ CARGAR FRAMES DE ANIMACIÓN DEL JUGADOR  
const frames = [
    "assets/player2.png",
    "assets/player3.png",
    "assets/player4.png"
];

// 🚀 CARGAR FRAMES CUANDO EL JUGADOR RECIBE DAÑO  
const damagedFrames = [
    "assets/player1_damaged2.png",
    "assets/player1_damaged3.png",
    "assets/player1_damaged4.png"
];

// 👨‍🚀 CARGAR FRAMES PARA ANIMACIÓN NORMAL DEL JUGADOR  
const normalFrames = [
    "assets/rocketman2.png",
    "assets/rocketman3.png",
    "assets/rocketman4.png"
];

// 🎞️ ÍNDICE Y VELOCIDAD DE ACTUALIZACIÓN DE FRAMES  
let frameIndex = 0;
const frameRate = 10; // Cambia cada 10 ciclos de animación

let score = 0; // Puntuación del jugador
let floatingTexts = []; // Lista para almacenar números flotantes que indican puntos ganados

/**
 * Lista que almacena los aliens de tipo "boost".
 * Estos enemigos especiales persiguen al jugador.
 */
let alienBoosts = []; 

// Lista de proyectiles disparados por los aliens
const alienProjectiles = [];

// Velocidad predeterminada de los asteroides
const asteroidSpeed = 3;

// Lista de aliens activos en pantalla
const aliens = [];

// Número de la oleada actual de asteroides
let waveNumber = 1;

// Contador de asteroides en la oleada actual
let asteroidCount = 0;

// Bandera para controlar el inicio del spawn de Boost Aliens
let spawningBoostAliens = false;

// Contador de Boost Aliens generados en la oleada actual
let alienBoostCount = 0;

// Número máximo de Boost Aliens que pueden aparecer en una oleada
let maxAlienBoosts = 5;

// Lista global de Alien Bosses en el juego
let bosses = [];

// Variable para registrar el tiempo de la última actualización de animación
let lastTime = 0;

// Almacena los asteroides en pantalla
let asteroids = [];

// Lista de explosiones activas en el juego
const explosions = [];

// Conjunto de imágenes para animar la explosión
const explosionFrames = [
    "assets/explosion1.png",
    "assets/explosion2.png",
    "assets/explosion3.png",
    "assets/explosion4.png",
    "assets/explosion5.png",
    "assets/explosion6.png",
    "assets/explosion7.png",
    "assets/explosion8.png",
    "assets/explosion9.png"
];

// 🕹️ PROPIEDADES DEL JUGADOR  
const player = {
    x: canvas.width / 2 - 32, // Posición inicial en X
    y: canvas.height / 2 - 32, // Posición inicial en Y
    width: 185, // Ancho del jugador
    height: 130, // Alto del jugador
    image: new Image(), // Imagen del jugador
    speedX: 0, // Velocidad en el eje X
    speedY: 0, // Velocidad en el eje Y
    acceleration: 0.2, // Aceleración cuando se mueve
    friction: 0.99, // Fricción para que desacelere gradualmente
    isGodMode: false // Estado del modo inmortal
};

// 🚀 ESTABLECER IMAGEN INICIAL DEL JUGADOR  
player.image.src = frames[0];

// ❤️ VIDAS DEL JUGADOR  
player.lives = 3;
// Objeto para rastrear teclas presionadas

// 🕹️ OBJETO PARA ALMACENAR TECLAS PRESIONADAS  
const keys = {};

// 🎹 EVENTOS PARA DETECTAR TECLAS PRESIONADAS Y SOLTADAS  
document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

// 🌌 FUNCIÓN PARA DIBUJAR EL FONDO DEL JUEGO  
function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

// 🚀 FUNCIÓN PARA DIBUJAR AL JUGADOR EN SU POSICIÓN ACTUAL  
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// 🏎️ FUNCIÓN PARA ACTUALIZAR EL MOVIMIENTO DEL JUGADOR  
function updatePlayer() {
    // 🔥 AUMENTAR VELOCIDAD SI ESTÁ EN MODO INMORTAL  
    let speedMultiplier = player.isGodMode ? 3 : 1; // Aumenta 50% la velocidad si es inmortal

    // 🚀 DETECTAR TECLAS PARA MOVIMIENTO CON ACELERACIÓN  
    if (keys["w"] || keys["W"]) player.speedY -= player.acceleration * speedMultiplier; // Mover arriba  
    if (keys["s"] || keys["S"]) player.speedY += player.acceleration * speedMultiplier; // Mover abajo  
    if (keys["a"] || keys["A"]) player.speedX -= player.acceleration * speedMultiplier; // Mover izquierda  
    if (keys["d"] || keys["D"]) player.speedX += player.acceleration * speedMultiplier; // Mover derecha  

    // 🛑 APLICAR FRICCIÓN PARA DESACELERAR  
    player.speedX *= player.friction;
    player.speedY *= player.friction;

    // 🔄 ACTUALIZAR POSICIÓN DEL JUGADOR  
    player.x += player.speedX;
    player.y += player.speedY;

    // 🛑 PREVENIR QUE EL JUGADOR SALGA DEL CANVAS  
    if (player.x < 0) { 
        player.x = 0; 
        player.speedX = 0; 
    }
    if (player.x + player.width > canvas.width) { 
        player.x = canvas.width - player.width; 
        player.speedX = 0; 
    }
    if (player.y < 0) { 
        player.y = 0; 
        player.speedY = 0; 
    }
    if (player.y + player.height > canvas.height) { 
        player.y = canvas.height - player.height; 
        player.speedY = 0; 
    }
}

// 🎞️ FUNCIÓN PARA ACTUALIZAR LA ANIMACIÓN DEL JUGADOR  
function updateAnimation() {
    if (player.isGodMode) return; // No cambiar el sprite si está en modo inmortal  

    // Cambiar el sprite del jugador de forma cíclica  
    frameIndex = (frameIndex + 1) % frames.length;
    player.image.src = frames[frameIndex];
}

/**
 * Actualiza el estado del juego en cada iteración del bucle.
 * Se encarga de mover asteroides, enemigos y proyectiles, así como manejar explosiones y la nave del jugador.
 */
function updateGame() {
    updateAsteroids();         // Actualiza la posición y lógica de los asteroides
    updateBoostAliens();       // Actualiza los enemigos de tipo Boost Alien
    updateAlienProjectiles();  // Actualiza los proyectiles disparados por los aliens
    updateExplosions();        // Maneja las explosiones en pantalla
    updatePlayer();            // Actualiza la posición y estado del jugador
}

/**
 * Renderiza todos los elementos gráficos en el canvas.
 * Se encarga de limpiar la pantalla y dibujar los elementos del juego en su estado actual.
 */
function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas antes de dibujar
    drawBackground(); // Dibuja el fondo del juego
    
    // Dibuja los distintos elementos del juego en pantalla
    drawAsteroids();
    drawAliens();
    drawBoostAliens(ctx);
    drawAlienBosses();
    drawAlienProjectiles();
    drawExplosions();
    
    drawScore();         // Dibuja el puntaje en pantalla
    drawFloatingTexts(); // Dibuja textos flotantes (si hay)
    drawPlayer();        // Dibuja la nave del jugador
}

/**
 * Función principal del bucle de juego.
 * Se ejecuta en cada frame y gestiona la actualización y renderizado del juego.
 * @param {DOMHighResTimeStamp} timestamp - Tiempo en milisegundos desde el inicio del juego.
 */
function gameLoop(timestamp) {
    if (!gameStarted) return; // Detiene el loop si el juego no está en marcha
    
    updateGame(); // Actualiza la lógica del juego
    renderGame(); // Renderiza la escena en pantalla
    
    // Controla la velocidad de actualización de animaciones para optimizar rendimiento
    if (timestamp - lastTime > 100) {
        updateAnimation();
        lastTime = timestamp;
    }

    requestAnimationFrame(gameLoop); // Solicita el próximo frame de animación
}

/**
 * Selecciona aleatoriamente un tipo de asteroide basado en su probabilidad de aparición.
 * @returns {Object} Un objeto que contiene la imagen del asteroide y su tamaño.
 */
function getRandomAsteroid() {
    const asteroidTypes = [
        { src: "assets/asteroid1.png", probability: 0.6, size: [50, 100] },  // Asteroide pequeño (60% de probabilidad)
        { src: "assets/asteroid2.png", probability: 0.3, size: [100, 180] }, // Asteroide mediano (30% de probabilidad)
        { src: "assets/asteroid3.png", probability: 0.1, size: [180, 250] }  // Asteroide grande (10% de probabilidad)
    ];

    let rand = Math.random(); // Genera un número aleatorio entre 0 y 1
    let cumulativeProbability = 0;

    for (let asteroid of asteroidTypes) {
        cumulativeProbability += asteroid.probability;
        if (rand < cumulativeProbability) {
            return asteroid; // Devuelve el objeto asteroide con su imagen y tamaño
        }
    }

    return asteroidTypes[0]; // En caso de error, devuelve el asteroide por defecto
}


/**
 * Genera oleadas de asteroides en el juego.
 * Cada oleada tiene una cantidad fija de asteroides y puede desencadenar la aparición de enemigos adicionales.
 * 
 * @param {number} wave - Número de la oleada actual (1, 2 o 3).
 * @param {number|null} lastY - Última posición Y de un asteroide generado (para evitar superposición).
 */
/**
 * Genera oleadas de asteroides con duración variable según la fase del juego.
 * 
 * @param {number} wave - Número de la oleada (1, 2 o 3).
 * @param {number|null} lastY - Última posición Y utilizada para evitar superposiciones.
 */
function spawnAsteroidWave(wave = 1, lastY = null) {
    if (wave > 3) return; // Detiene la generación después de la tercera oleada.

    // Ajusta el tiempo entre asteroides, reduciéndolo con cada oleada.
    let spawnDelay = 2000 - (wave - 1) * 1000; 

    // Duración de la oleada en milisegundos según la fase:
    // - Oleada 1: 20s
    // - Oleada 2: 25s
    // - Oleada 3: 30s
    let waveDuration = wave === 1 ? 20000 : wave === 2 ? 25000 : 30000;

    let spawningAsteroids = true; // Controla si se siguen generando asteroides.

    /**
     * Función interna para generar un asteroide y programar el siguiente.
     */
    function spawnNextAsteroid() {
        if (!spawningAsteroids) return; // Si el tiempo terminó, no generar más.

        // Obtiene un tipo de asteroide aleatorio.
        const asteroidData = getRandomAsteroid();
        const asteroidImage = new Image();
        asteroidImage.src = asteroidData.src;

        // Determina el tamaño del asteroide basado en su tipo.
        let size = asteroidData.src === "assets/asteroid1.png" ? 70 :
                   Math.random() * (asteroidData.size[1] - asteroidData.size[0]) + asteroidData.size[0];

        // Genera una posición Y aleatoria evitando superposiciones con el último asteroide generado.
        let yPos;
        do {
            yPos = Math.random() * (canvas.height - size - 40) + 20;
        } while (yPos === lastY);

        // Agrega el asteroide a la lista global.
        asteroids.push({
            x: -size,     // Aparece fuera del lado izquierdo de la pantalla.
            y: yPos,      // Posición vertical generada aleatoriamente.
            width: size,  // Ancho del asteroide.
            height: size, // Alto del asteroide.
            image: asteroidImage // Imagen correspondiente.
        });

        lastY = yPos; // Guarda la última posición Y usada.

        // Programa la aparición del siguiente asteroide si el tiempo de generación no ha terminado.
        if (spawningAsteroids) {
            setTimeout(spawnNextAsteroid, Math.max(500, spawnDelay - asteroids.length * 50));
        }
    }

    // Inicia la generación del primer asteroide de la oleada.
    spawnNextAsteroid();

    /**
     * Detiene la generación de asteroides después del tiempo asignado para la oleada
     * y activa la siguiente fase del juego.
     */
    setTimeout(() => {
        spawningAsteroids = false; // Detiene la generación de nuevos asteroides.

        // Después de cada oleada, se generan nuevos enemigos o jefes.
        if (wave === 1) {
            setTimeout(spawnAliens, 3000, wave); // Aparecen aliens normales tras la primera oleada.
        } else if (wave === 2 && !spawningBoostAliens) {
            spawningBoostAliens = true;
            alienBoostCount = 0;
            setTimeout(spawnBoostAlien, 3000); // Aparecen los Boost Aliens en la segunda oleada.
        } else if (wave === 3) {
            setTimeout(spawnAlienBosses, 3000); // Aparece el Alien Boss en la tercera oleada.
        }
    }, waveDuration); // Ejecuta esta parte tras la duración establecida de la oleada.
}


/**
 * Genera aliens después de una oleada de meteoritos.
 * 
 * @param {number} wave - Número de la oleada actual.
 */
function spawnAliens(wave) {
    // Reinicia la lista de aliens en pantalla
    aliens.length = 0;

    // Genera dos aliens en posiciones fijas
    for (let i = 0; i < 2; i++) {
        const alienImage = new Image();
        alienImage.src = "assets/alien_shooter.png";

        aliens.push({
            x: canvas.width / 3 + i * 300, // Posición en el eje X, separando los aliens
            y: -100, // Aparecen fuera de la pantalla y se mueven hacia abajo
            width: 140,  
            height: 192.5,
            image: alienImage,
            opacity: 1.0 // Opacidad inicial
        });
    }

    // Movimiento gradual de los aliens hacia abajo
    let moveDown = setInterval(() => {
        for (let alien of aliens) {
            if (alien.y < 50) alien.y += 5; // Se detienen al llegar a y = 50
        }
    }, 50);

    // Después de un segundo, los aliens permanecen en su posición durante 15 segundos
    setTimeout(() => {
        clearInterval(moveDown); // Detiene el movimiento descendente de los aliens

        // Esperar 15 segundos antes de iniciar el desvanecimiento
        setTimeout(() => {
            // Inicia el proceso de desvanecimiento de los aliens
            let fadeInterval = setInterval(() => {
                let allFaded = true; // Bandera para verificar si todos los aliens han desaparecido

                aliens.forEach(alien => {
                    if (alien.opacity > 0) {
                        alien.opacity -= 0.05; // Reduce la opacidad gradualmente en pasos de 0.05
                        allFaded = false; // Si al menos un alien sigue visible, la bandera se mantiene en falso
                    }
                });

                if (allFaded) {
                    clearInterval(fadeInterval); // Detiene el intervalo una vez que todos los aliens han desaparecido
                    aliens.length = 0; // Elimina los aliens del array después de desvanecerse completamente

                    // Genera la segunda oleada de asteroides tras 3 segundos
                    setTimeout(() => spawnAsteroidWave(2, null), 3000);
                }
            }, 100); // Reduce la opacidad cada 100ms para lograr un efecto de desvanecimiento suave

        }, 15000); // Esperar 15 segundos antes de comenzar el desvanecimiento

    }, 1000); // Inicia el proceso 1 segundo después de detener el movimiento de los aliens
   
}

/**
 * Dibuja los aliens en el canvas dentro del bucle principal del juego.
 */
function drawAliens() {
    for (let alien of aliens) {
        ctx.globalAlpha = alien.opacity; // Aplica la opacidad del alien
        ctx.drawImage(alien.image, alien.x, alien.y, alien.width, alien.height);
        ctx.globalAlpha = 1.0; // Restaura la opacidad para no afectar otros dibujos
    }
}


/**
 * Hace que los aliens disparen proyectiles cada 3.5 segundos.
 */
function alienShoot() {
    for (let alien of aliens) {
        // Calcular la dirección del disparo hacia el jugador
        let dx = player.x + player.width / 2 - (alien.x + alien.width / 2);
        let dy = player.y + player.height / 2 - (alien.y + alien.height);
        let length = Math.sqrt(dx * dx + dy * dy); // Normaliza la dirección
        dx /= length;
        dy /= length;

        // Crear un proyectil con dirección hacia el jugador
        const projectile = {
            x: alien.x + alien.width / 2 - 5, // Ajuste para que salga centrado
            y: alien.y + alien.height - 20, // Desde la parte inferior del alien
            width: 10,
            height: 10,
            speed: 10, // Velocidad constante
            dx: dx * 5, // Dirección X ajustada con velocidad
            dy: dy * 5, // Dirección Y ajustada con velocidad
            color: "rgb(255, 0, 0)"
        };

        // Agregar el proyectil a la lista global
        alienProjectiles.push(projectile);
    }

    // Repetir el disparo cada 3.5 segundos
    setTimeout(alienShoot, 2000);
}

/**
 * Actualiza la posición de los disparos enemigos y gestiona colisiones.
 * 
 * - Mueve cada proyectil en su dirección calculada.
 * - Detecta colisión con el jugador y aplica daño si impacta.
 * - Elimina proyectiles fuera de la pantalla o después de impactar.
 */
function updateAlienProjectiles() {
    for (let i = alienProjectiles.length - 1; i >= 0; i--) {
        const projectile = alienProjectiles[i];

        // Actualizar la posición del proyectil en base a su dirección
        projectile.x += projectile.dx;
        projectile.y += projectile.dy;

        // Verificar colisión con el jugador
        if (
            projectile.x < player.x + player.width &&
            projectile.x + projectile.width > player.x &&
            projectile.y < player.y + player.height &&
            projectile.y + projectile.height > player.y
        ) {
            takeDamage(); // Llamar función que reduce la vida del jugador
            alienProjectiles.splice(i, 1); // Eliminar el proyectil tras impactar
        }

        // Verificar si el proyectil ha salido de los límites de la pantalla
        if (
            projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height
        ) {
            alienProjectiles.splice(i, 1); // Eliminar proyectil fuera de pantalla
        }
    }
}

/**
 * Dibuja los disparos enemigos en el canvas.
 * 
 * - Usa `fillRect` para representar cada proyectil con un color sólido.
 */
function drawAlienProjectiles() {
    for (let projectile of alienProjectiles) {
        ctx.fillStyle = projectile.color; // Color del disparo enemigo (rojo)
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}


/**
 * Genera un alien "boost" y lo añade a la lista.
 * 
 * - Se generan hasta `maxAlienBoosts` enemigos en total.
 * - Cada alien aparece con una imagen aleatoria de tres variantes (`alien_boost1.png`, `alien_boost2.png`, `alien_boost3.png`).
 * - Aparecen fuera de la pantalla y avanzan hacia la posición del jugador.
 * - Una vez que se generan todos, inicia la tercera oleada de asteroides.
 */
function spawnBoostAlien() {
    if (alienBoostCount >= maxAlienBoosts) {
        spawningBoostAliens = false;
        setTimeout(() => spawnAsteroidWave(3, null), 3000); // Iniciar siguiente oleada
        return;
    }

    // Cargar las imágenes para la animación
    const alienImages = [
        new Image(),
        new Image(),
        new Image()
    ];
    alienImages[0].src = "assets/alien_boost1.png";
    alienImages[1].src = "assets/alien_boost2.png";
    alienImages[2].src = "assets/alien_boost3.png";

    const alien = {
        x: -50, // Aparece fuera de la pantalla
        y: Math.random() * (canvas.height - 50), // Posición aleatoria en Y
        width: 189,
        height: 175,
        images: alienImages, // Almacena todas las imágenes de la animación
        currentFrame: 0, // Índice del frame actual
        frameDelay: 8, // Cuántos ciclos esperar antes de cambiar de imagen
        frameCounter: 0, // Contador para el cambio de frames
        speed: 4, // Velocidad de movimiento
        targetX: player.x,
        targetY: player.y
    };

    alienBoosts.push(alien);
    alienBoostCount++;

    setTimeout(spawnBoostAlien, 1400); // Generar el siguiente alien en 1.4 segundos
}


/**
 * Actualiza la posición de los aliens "boost" y maneja colisiones.
 * 
 * - Los aliens se mueven directamente hacia el jugador.
 * - Si colisionan con el jugador:
 *   - Si el jugador es inmortal, otorga puntos en vez de daño.
 *   - Si no, el jugador recibe daño.
 *   - Se genera una explosión al eliminar el alien.
 * - Se eliminan los aliens que salen de la pantalla.
 */
function updateBoostAliens() {
    alienBoosts = alienBoosts.filter((alien) => {
        // Calcular dirección hacia el jugador
        let dx = player.x - alien.x;
        let dy = player.y - alien.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (length !== 0) {
            dx /= length;
            dy /= length;
            alien.x += dx * alien.speed;
            alien.y += dy * alien.speed;
        }

        // 🚨 Verificar colisión con el jugador
        if (isColliding(alien, player)) {
            if (player.isImmortal) {
                score += 500; // Gana puntos en vez de recibir daño
                addFloatingText("+500", alien.x, alien.y);

                // 🔊 Reproducir sonido sin solapamiento
                clickSound.currentTime = 0; 
                clickSound.play();
            } else {
                takeDamage(); // Reducir vida del jugador
            }

            startExplosion(alien.x, alien.y, alien.width, alien.height); // Crear explosión
            return false; // Eliminar alien de la lista
        }

        // Mantener solo los aliens dentro de la pantalla
        return alien.y <= canvas.height;
    });
}

/**
 * Dibuja los aliens "boost" en el canvas.
 * 
 * - Se verifica que la imagen esté cargada antes de dibujarla.
 */
// 🛸 FUNCIÓN PARA DIBUJAR LOS BOOST ALIENS CON ANIMACIÓN
function drawBoostAliens() {
    for (let alien of alienBoosts) {
        // Controlar la animación de los frames
        alien.frameCounter++;
        if (alien.frameCounter >= alien.frameDelay) {
            alien.frameCounter = 0;
            alien.currentFrame = (alien.currentFrame + 1) % alien.images.length;
        }

        ctx.drawImage(alien.images[alien.currentFrame], alien.x, alien.y, alien.width, alien.height);
    }
}



/**
 * Inicia el spawn de los Alien Bosses en la tercera oleada.
 * 
 * - Se generan tres bosses en total.
 * - Cada boss aparece en un intervalo de tiempo distinto y entra desde un lado diferente de la pantalla.
 * - Su movimiento inicial es horizontal hasta alcanzar su posición de ataque.
 */
function spawnAlienBosses() {
    bosses.length = 0; // Reiniciar lista de bosses

    // 🏴‍☠️ Spawnear el primer boss (desde la izquierda hacia la derecha)
    setTimeout(() => {
        spawnSingleBoss(-120, 100, 1);
    }, 0);

    // 🏴‍☠️ Spawnear el segundo boss (desde la derecha hacia la izquierda) después de 5s
    setTimeout(() => {
        spawnSingleBoss(canvas.width + 120, 220, -1);
    }, 5000);

    // 🏴‍☠️ Spawnear el tercer boss (desde la izquierda hacia la derecha) después de 10s
    setTimeout(() => {
        spawnSingleBoss(-120, 340, 1);
    }, 12000);
}

/**
 * Crea y añade un Alien Boss con dirección específica a la lista de bosses.
 * 
 * @param {number} startX - Posición inicial en X (fuera de la pantalla).
 * @param {number} y - Posición en Y donde se detendrá.
 * @param {number} speed - Dirección de entrada (1 = derecha, -1 = izquierda).
 * 
 * - Cada boss tiene un escudo inicial y requiere 8 clics para ser destruido.
 * - Al llegar a su posición dentro del canvas, comienza a disparar.
 */
function spawnSingleBoss(startX, y, speed) {
    const bossImage = new Image();
    bossImage.src = "assets/alien_boss_shield.png"; // Imagen con escudo

    const boss = {
        x: startX,
        y: y,
        width: 210,     // Tamaño del boss
        height: 249,    
        speed: speed,   // Velocidad inicial de entrada
        shooting: false, // No dispara al inicio
        shotsFired: 0,   // Contador de disparos realizados
        movingToPlayer: false, // Indica si está persiguiendo al jugador
        image: bossImage,
        shielded: true, // Inicia con escudo
        clicksToDestroy: 8 // Cantidad de clics necesarios para destruirlo
    };

    bosses.push(boss);
    moveBoss(boss);
}

/**
 * Mueve un Alien Boss desde fuera de la pantalla hasta su posición inicial.
 * 
 * @param {object} boss - Objeto del boss a mover.
 * 
 * - El boss entra desde un lado de la pantalla (izquierda o derecha).
 * - Se mueve lentamente hasta alcanzar su posición de ataque.
 * - Una vez en posición, detiene su movimiento y comienza a disparar.
 */
function moveBoss(boss) {
    let moveInterval = setInterval(() => {
        // Si el boss ha entrado completamente en pantalla, detener movimiento y comenzar a disparar
        if ((boss.speed > 0 && boss.x >= 100) || (boss.speed < 0 && boss.x <= canvas.width - boss.width - 100)) {
            boss.speed = 0;
            boss.shooting = true;
            clearInterval(moveInterval);
            bossShoot(boss); // Iniciar ataque
            return;
        }

        // Movimiento del boss hacia su posición inicial dentro del canvas
        boss.x += boss.speed * 2;
    }, 50);
}

/**
 * Hace que un boss individual dispare proyectiles en dirección al jugador.
 * 
 * @param {object} boss - El boss que realiza el disparo.
 * 
 * - Calcula la dirección hacia el jugador y lanza un proyectil.
 * - Dispara hasta 5 veces, con intervalos de 2 segundos entre cada disparo.
 * - Tras 5 disparos, el boss pierde su escudo y se vuelve vulnerable a los clics.
 * - Si no es destruido en 5 segundos después de perder el escudo, empezará a perseguir al jugador.
 */
function bossShoot(boss) {
    if (!boss || !boss.shooting) return; // 🛑 Evita errores si el boss ya no existe

    // 📍 Calcular la dirección hacia el jugador
    let dx = player.x + player.width / 2 - (boss.x + boss.width / 2);
    let dy = player.y + player.height / 2 - (boss.y + boss.height);
    let length = Math.sqrt(dx * dx + dy * dy) || 1; // Evita dividir por 0
    dx /= length;
    dy /= length;

    // 🔫 Crear y agregar el proyectil
    alienProjectiles.push({
        x: boss.x + boss.width / 2 - 5,
        y: boss.y + boss.height - 20,
        width: 10,
        height: 10,
        speed: 10,
        dx: dx * 6,
        dy: dy * 6,
        color: "rgb(174, 0, 255)"
    });

    boss.shotsFired++; // 🔢 Contador de disparos

    // 📌 Si el boss aún no ha disparado 5 veces, programar el siguiente disparo
    if (boss.shotsFired < 6) {
        setTimeout(() => bossShoot(boss), 1200);
    } else {
        // 🔥 Después de 5 disparos, el boss se vuelve vulnerable
        boss.shooting = false;
        boss.shielded = false;

        // Solo cambiar la imagen si no es vulnerable ya
        if (boss.image.src !== "assets/alien_boss.png") {
            boss.image.src = "assets/alien_boss.png";
        }

        // ⏳ Si no es destruido en 5 segundos, empieza a perseguir al jugador
        setTimeout(() => {
            if (boss.clicksToDestroy > 0) {
                boss.movingToPlayer = true;
                moveBossToPlayer(boss);
            }
        }, 5000);
    }
}


/**
 * Mueve el Boss hacia el jugador en caso de no ser destruido a tiempo.
 * 
 * @param {object} boss - El boss que empieza a moverse hacia el jugador.
 * 
 * - El boss se dirige directamente al jugador con aceleración progresiva.
 * - Si colisiona con el jugador, causa daño o (si el jugador es inmortal) otorga puntos extra.
 * - Si el boss sale de la pantalla, es eliminado del juego.
 * - Si no quedan bosses, el juego finaliza con victoria después de 2 segundos.
 */
function moveBossToPlayer(boss) {
    let speedIncrease = 0.5; // Aceleración progresiva

    let chaseInterval = setInterval(() => {
        if (!boss.movingToPlayer) {
            clearInterval(chaseInterval);
            return;
        }

        // 📍 Calcular dirección hacia el jugador
        let dx = player.x - boss.x;
        let dy = player.y - boss.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (length !== 0) {
            dx /= length;
            dy /= length;
            boss.x += dx * (2 + speedIncrease); // Movimiento en X
            boss.y += dy * (2 + speedIncrease); // Movimiento en Y
            speedIncrease += 0.3; // Incrementar velocidad gradualmente
        }

        // 🚨 DETECTAR COLISIÓN CON EL JUGADOR 🚨
        if (isColliding(boss, player)) {
            startExplosion(boss.x, boss.y, boss.width, boss.height);
            if (player.isImmortal) {
                score += 1000; // Bonificación en modo inmortal
                addFloatingText("+1000", boss.x, boss.y);
                // 🔊 Reproducir sonido
                clickSound.currentTime = 0;
                clickSound.play();
            } else {
                takeDamage();
            }
            bosses.splice(bosses.indexOf(boss), 1); // Eliminar el boss
            clearInterval(chaseInterval);
        }

        // ❌ Eliminar el boss si sale de la pantalla
        if (boss.x < -boss.width || boss.x > canvas.width || boss.y < -boss.height || boss.y > canvas.height) {
            bosses.splice(bosses.indexOf(boss), 1);
            clearInterval(chaseInterval);
        }

        // 🏆 Si no quedan bosses, iniciar la secuencia de victoria
        if (bosses.length === 0) {
            setTimeout(gameWin, 2000);
        }
    }, 50);
}

/**
 * Detecta la secuencia de teclas "elton" para activar el Modo Inmortal.
 * 
 * - Al presionar las teclas en orden correcto ("E", "L", "T", "O", "N"),
 *   se activa el modo inmortal para el jugador.
 * - El jugador se vuelve invulnerable al daño.
 * - Se cambia su apariencia y tamaño.
 * - Se detiene la música actual y se reproduce una música especial tras 3 segundos.
 */

let godModeSequence = ""; // Almacena la secuencia ingresada
document.addEventListener("keydown", (event) => {
    let key = event.key.toLowerCase(); // Convertir la tecla a minúscula para evitar errores

    // 🕹️ Verificar si la secuencia es correcta
    if (key === "e") {
        godModeSequence = "e";
    } else if (godModeSequence === "e" && key === "l") {
        godModeSequence = "el";
    } else if (godModeSequence === "el" && key === "t") {
        godModeSequence = "elt";
    } else if (godModeSequence === "elt" && key === "o") {
        godModeSequence = "elto";
    } else if (godModeSequence === "elto" && key === "n") {
        godModeSequence = ""; // 🔄 Reiniciar secuencia después de activarla

        // 🔥 Activar el Modo Inmortal
        player.isImmortal = true;
        player.isGodMode = true;
        player.image.src = "assets/rocketman_god.png"; // Cambiar imagen a versión "Dios"

        // 📏 Aumentar el tamaño del jugador en modo inmortal
        player.width = 170;
        player.height = 286;

        // 🚫 Evitar que el jugador reciba daño
        takeDamage = function () {
            console.log("Eres inmortal. No recibes daño.");
        };

        console.log("¡Modo inmortal activado! 🚀");

        // 🎵 DETENER LA MÚSICA ACTUAL
        if (gameMusic) {
            gameMusic.pause();
            gameMusic.currentTime = 0;
        }

        // 🎶 ESPERAR 3 SEGUNDOS Y REPRODUCIR MÚSICA ESPECIAL EN BUCLE
        setTimeout(() => {
            let godModeMusic = new Audio("assets/musicgod.mp3");
            godModeMusic.loop = true;
            godModeMusic.play();
        }, 3000);
    } else {
        godModeSequence = ""; // ❌ Reiniciar la secuencia si se presiona una tecla incorrecta
    }
});

/**
 * 🎨 Dibuja los Alien Bosses en el game loop con efecto de parpadeo al recibir daño.
 * 
 * - Muestra la imagen del boss en su posición actual.
 * - Si el boss ha recibido daño recientemente, parpadea con una ligera transparencia.
 * - Si el boss es vulnerable, muestra un contador de clics restantes sobre él.
 */
function drawAlienBosses() {
    for (let boss of bosses) {
        // ✨ Si el boss está parpadeando, reducir opacidad temporalmente
        if (boss.isFlashing) {
            ctx.globalAlpha = 0.5; // Se vuelve semitransparente
        }

        // 📌 Dibujar la imagen del boss
        ctx.drawImage(boss.image, boss.x, boss.y, boss.width, boss.height);

        // 🔄 Restaurar opacidad normal
        ctx.globalAlpha = 1.0;

        // 🔢 Mostrar contador de clics si el boss es vulnerable
        if (!boss.shielded) {
            ctx.fillStyle = "white"; // Color del texto
            ctx.font = "bold 24px Arial"; // Estilo del texto
            ctx.textAlign = "center";
            ctx.fillText(boss.clicksToDestroy, boss.x + boss.width / 2, boss.y - 10);
        }
    }
}


//Cuenta dos para seguir con la mejora de efecto visual


// 📌 Agrega un evento de clic en el canvas para manejar interacciones
canvas.addEventListener("click", handleClick);

// 🌑 Función para actualizar la posición de los asteroides y manejar colisiones
function updateAsteroids() {
    // Recorre la lista de asteroides en orden inverso para facilitar su eliminación
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].x += asteroidSpeed; // Mueve el asteroide hacia la derecha

        // 🚨 DETECTAR COLISIÓN CON EL JUGADOR 🚨
        if (isColliding(asteroids[i], player)) {
            if (player.isImmortal) {
                score += 200; // Si el jugador es inmortal, gana puntos en lugar de recibir daño
                addFloatingText("+200", asteroids[i].x, asteroids[i].y); // Muestra texto flotante con la puntuación

                // 🔊 Reproducir sound.mp3 sin solapamiento
                clickSound.currentTime = 0; 
                clickSound.play();
            } else {
                takeDamage(); // Si el jugador no es inmortal, recibe daño
            }

            // Iniciar animación de explosión en la posición del asteroide
            startExplosion(asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height);
            
            // Eliminar el asteroide de la lista tras la colisión
            asteroids.splice(i, 1);
            continue; // Pasar al siguiente asteroide
        }

        // 🚀 Eliminar asteroides que han salido completamente de la pantalla
        if (asteroids[i] && asteroids[i].x > canvas.width) {
            asteroids.splice(i, 1); // Eliminar el asteroide de la lista
        }
    }
}

// 🌑 Función para dibujar los asteroides en el canvas
function drawAsteroids() {
    for (let asteroid of asteroids) {
        ctx.drawImage(
            asteroid.image,  // Imagen del asteroide
            asteroid.x,      // Posición X
            asteroid.y,      // Posición Y
            asteroid.width,  // Ancho del asteroide
            asteroid.height  // Alto del asteroide
        );
    }
}



// 🖱️ Evento de clic en el canvas para detectar impactos y generar explosiones
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    clickSound.currentTime = 0; 
    clickSound.play();

    startExplosion(mouseX - 25, mouseY - 25, 50, 50);

    // 🚀 Verificar si el clic impactó un asteroide
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];

        if (mouseX >= asteroid.x && mouseX <= asteroid.x + asteroid.width &&
            mouseY >= asteroid.y && mouseY <= asteroid.y + asteroid.height) {
            
            startExplosion(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
            asteroids.splice(i, 1);
            let points = player.isGodMode ? 10000 : 100; 
            score += points; 
            addFloatingText(`+${points}`, asteroid.x + asteroid.width / 2, asteroid.y);
            return;
        }
    }

    // 👽 Verificar si el clic impactó un alien boost
    for (let i = alienBoosts.length - 1; i >= 0; i--) {
        const alien = alienBoosts[i];

        if (mouseX >= alien.x && mouseX <= alien.x + alien.width &&
            mouseY >= alien.y && mouseY <= alien.y + alien.height) {
            
            alien.hits = (alien.hits || 0) + 1;

            if (alien.hits >= 3) {
                startExplosion(alien.x, alien.y, alien.width, alien.height);
                alienBoosts.splice(i, 1);
                let points = player.isGodMode ? 5000 : 50;
                score += points;
                addFloatingText(`+${points}`, alien.x + alien.width / 2, alien.y);
            }
            return;
        }
    }

    // 👾 Verificar si el clic impactó un Alien Boss
    for (let i = bosses.length - 1; i >= 0; i--) {
        let boss = bosses[i];

        if (!boss.shielded &&
            mouseX >= boss.x && mouseX <= boss.x + boss.width &&
            mouseY >= boss.y && mouseY <= boss.y + boss.height) {
            
            boss.clicksToDestroy = Math.max(0, boss.clicksToDestroy - 1);

            // ✨ Efecto de parpadeo al recibir impacto
            boss.isFlashing = true;
            setTimeout(() => boss.isFlashing = false, 100);

            if (boss.clicksToDestroy === 0) {
                startExplosion(boss.x, boss.y, boss.width, boss.height);
                bosses.splice(i, 1);

                if (bosses.length === 0) {
                    setTimeout(() => gameWin(), 3000);
                }
            }
            return;
        }
    }
}


// 🏆 Función para dibujar la puntuación en pantalla
function drawScore() {
    ctx.fillStyle = "white"; // Color del texto
    ctx.font = "20px Arial"; // Fuente y tamaño del texto
    ctx.textAlign = "right"; // Alineación del texto a la derecha
    ctx.fillText(`Puntos: ${score}`, canvas.width - 20, 30); // Dibujar la puntuación en la esquina superior derecha
}

// 📢 Función para agregar un número flotante cuando se obtiene puntuación
function addFloatingText(text, x, y) {
    // Se agrega un objeto a la lista de textos flotantes con su posición y opacidad inicial
    floatingTexts.push({ text, x, y, opacity: 1 });
}

// ✨ Dibujar y actualizar números flotantes en la pantalla
function drawFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let t = floatingTexts[i]; // Obtener el texto flotante actual

        // 🖌️ Dibujar el texto flotante con opacidad variable
        ctx.fillStyle = `rgba(255, 255, 255, ${t.opacity})`; // Color blanco con transparencia
        ctx.font = "18px Arial"; // Fuente y tamaño del texto
        ctx.textAlign = "center"; // Alineación centrada
        ctx.fillText(t.text, t.x, t.y); // Dibujar el texto en la posición actual
        
        t.y -= 1; // ☁️ Mover el texto hacia arriba simulando flotación
        t.opacity -= 0.02; // 🔄 Reducir la opacidad gradualmente para efecto de desvanecimiento

        // 🗑️ Eliminar el texto de la lista cuando desaparezca completamente
        if (t.opacity <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
}

// 💥 Iniciar una nueva explosión en la posición especificada
function startExplosion(x, y, width, height) {
    // Agrega una nueva explosión al array de explosiones con los datos iniciales
    explosions.push({
        x,              // Posición en el eje X
        y,              // Posición en el eje Y
        width,          // Ancho de la explosión
        height,         // Alto de la explosión
        frameIndex: 0,  // Índice del fotograma actual en la animación
        image: new Image() // Imagen que se usará para la animación
    });
}

// 🔄 Actualizar el estado de las explosiones (animación)
function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];

        // ⏳ Avanzar la animación cada 100ms hasta llegar al último frame
        if (explosion.frameIndex < explosionFrames.length - 1) {
            explosion.frameIndex++; // Pasar al siguiente fotograma
        } else {
            explosions.splice(i, 1); // 🗑️ Eliminar la explosión cuando termine la animación
        }
    }
}

// 🎆 Dibujar las explosiones en el canvas
function drawExplosions() {
    for (let explosion of explosions) {
        const explosionImage = new Image();
        explosionImage.src = explosionFrames[explosion.frameIndex]; // Seleccionar el frame actual
        ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.width, explosion.height);
    }
}


// 🚀 Función para gestionar el daño al jugador
function takeDamage() {
    if (player.lives > 0) { // Verifica si el jugador aún tiene vidas
        player.lives--; // Reducir una vida

        // 🎵 Reproducir sonido de daño
        damageSound.currentTime = 0; // Reinicia el sonido si ya se estaba reproduciendo
        damageSound.play().catch(error => console.log("Error al reproducir sonido de daño:", error));

        // 💥 Generar una explosión en la posición del jugador
        startExplosion(player.x, player.y, player.width, player.height);

        // 🎭 Alternar entre animaciones y ajustar el tamaño del sprite según el daño recibido
        if (player.lives % 2 === 0) {
            frames.length = 0;
            frames.push(...damagedFrames); // Cambiar a sprites de nave dañada
            player.width = 185;   // Ajustar ancho
            player.height = 130;  // Ajustar alto
        } else {
            frames.length = 0;
            frames.push(...normalFrames); // Restaurar sprites normales
            player.width = 68;    // Restaurar ancho original
            player.height = 112;  // Restaurar alto original
        }

        frameIndex = 0; // Reiniciar la animación con la nueva secuencia de imágenes
        player.image.src = frames[frameIndex]; // Actualizar la imagen de la nave
    }

    // 💀 Verificar si el jugador ha perdido todas las vidas
    if (player.lives <= 0) {
        console.log("GAME OVER"); // Mensaje en la consola (puede ser reemplazado por una animación o mensaje en pantalla)
        gameOver(); // Llamar a la función que maneja el fin del juego
    }
}

// 📏 Función genérica para detectar colisiones entre dos objetos
function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&  // Verifica si obj1 colisiona en el eje X con obj2
        obj1.x + obj1.width > obj2.x &&  // Verifica el lado opuesto en el eje X
        obj1.y < obj2.y + obj2.height && // Verifica si obj1 colisiona en el eje Y con obj2
        obj1.y + obj1.height > obj2.y    // Verifica el lado opuesto en el eje Y
    );
}


