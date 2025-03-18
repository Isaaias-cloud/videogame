//const canvas = document.getElementById("gameCanvas");
//const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

canvas.style.cursor = "url('assets/mira.png') 16 16, auto";
// Cargar el sonido
const clickSound = new Audio("assets/sound.mp3");


//canvas.width = 1300;
//canvas.height = 700;

// Fondo
const bgImage = new Image();
bgImage.src = "assets/fondo_game.png";

// Carga los frames de la animación
const frames = [
    "assets/player2.png",
    "assets/player3.png",
    "assets/player4.png"
];
//Daño a la nave
const damagedFrames = [
    "assets/player1_damaged2.png",
    "assets/player1_damaged3.png",
    "assets/player1_damaged4.png"
];

const normalFrames = [
    "assets/rocketman2.png",
    "assets/rocketman3.png",
    "assets/rocketman4.png"
];


let frameIndex = 0;
const frameRate = 10;

const player = {
    x: canvas.width / 2 - 32,
    y: canvas.height / 2 - 32,
    width: 185,
    height: 130,
    image: new Image(),
    speedX: 0, // Velocidad en X
    speedY: 0, // Velocidad en Y
    acceleration: 0.2, // Aceleración al moverse
    friction: 0.99 // Fricción para desacelerar
    
};

player.image.src = frames[0];
player.lives = 3;
// Objeto para rastrear teclas presionadas
const keys = {};

// Eventos para detectar teclas presionadas y soltadas
document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

function drawBackground() {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// Mueve la nave con aceleración y fricción
function updatePlayer() {
    if (keys["w"] || keys["W"]) player.speedY -= player.acceleration;
    if (keys["s"] || keys["S"]) player.speedY += player.acceleration;
    if (keys["a"] || keys["A"]) player.speedX -= player.acceleration;
    if (keys["d"] || keys["D"]) player.speedX += player.acceleration;

    // Aplicar fricción
    player.speedX *= player.friction;
    player.speedY *= player.friction;

    // Actualizar posición
    player.x += player.speedX;
    player.y += player.speedY;

    // Limites para que no salga del canvas
    if (player.x < 0) { player.x = 0; player.speedX = 0; }
    if (player.x + player.width > canvas.width) { player.x = canvas.width - player.width; player.speedX = 0; }
    if (player.y < 0) { player.y = 0; player.speedY = 0; }
    if (player.y + player.height > canvas.height) { player.y = canvas.height - player.height; player.speedY = 0; }
}

function updateAnimation() {
    if (player.isGodMode) return; // No cambiar el sprite si está en modo inmortal

    frameIndex = (frameIndex + 1) % frames.length;
    player.image.src = frames[frameIndex];
}

let lastTime = 0;
function updateGame() {
    updateAsteroids();
    updateBoostAliens();
    updateAlienProjectiles();
    updateExplosions();
    updatePlayer();
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    
    drawAsteroids();
    drawAliens();
    drawBoostAliens(ctx);
    drawAlienBosses();
    drawAlienProjectiles();
    drawExplosions();
    
    drawScore();
    drawFloatingTexts();
    drawPlayer();
}

function gameLoop(timestamp) {
    if (!gameStarted) return; // Detiene el juego si terminó
    
    updateGame();
    renderGame();
    
    if (timestamp - lastTime > 100) {
        updateAnimation();
        lastTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

function getRandomAsteroid() {
    const asteroidTypes = [
        { src: "assets/asteroid1.png", probability: 0.6, size: [50, 100] }, 
        { src: "assets/asteroid2.png", probability: 0.3, size: [100, 180] }, 
        { src: "assets/asteroid3.png", probability: 0.1, size: [180, 250] }  
    ];

    let rand = Math.random();
    let cumulativeProbability = 0;

    for (let asteroid of asteroidTypes) {
        cumulativeProbability += asteroid.probability;
        if (rand < cumulativeProbability) {
            return asteroid;  // 🔴 Error: Antes solo devolvía asteroid.src
        }
    }

    return asteroidTypes[0]; // 🔴 También debe devolver el objeto completo
}


let asteroids = []; // Almacena los asteroides
const explosions = []; // Almacena explosiones activas
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

const asteroidSpeed = 3; // Velocidad de movimiento de los asteroides
const aliens = []; // Lista de aliens en pantalla

let waveNumber = 1;
let asteroidCount = 0;
let spawningBoostAliens = false;
let alienBoostCount = 0;
let maxAlienBoosts = 5;


let bosses = []; // Lista global de Alien Bosses

function spawnAsteroidWave(wave = 1, lastY = null) {
    if (wave > 3) return; // Detener después de la tercera oleada

    let spawnDelay = 2500 - (wave - 1) * 500; // Reducir el tiempo en cada oleada
    asteroidCount = 0; // Reiniciar contador

    function spawnNextAsteroid() {
        if (asteroidCount >= 10) {
            if (wave === 1) {
                setTimeout(spawnAliens, 3000, wave);
            } else if (wave === 2 && !spawningBoostAliens) {
                spawningBoostAliens = true;
                alienBoostCount = 0;
                setTimeout(spawnBoostAlien, 3000);
            } else if (wave === 3) {
                setTimeout(spawnAlienBosses, 3000);
            }
            return;
        }

        const asteroidData = getRandomAsteroid();
        const asteroidImage = new Image();
        asteroidImage.src = asteroidData.src;

        let size = asteroidData.src === "assets/asteroid1.png" ? 70 :
                   Math.random() * (asteroidData.size[1] - asteroidData.size[0]) + asteroidData.size[0];

        let yPos;
        do {
            yPos = Math.random() * (canvas.height - size - 40) + 20;
        } while (yPos === lastY);

        asteroids.push({
            x: -size,
            y: yPos,
            width: size,
            height: size,
            image: asteroidImage
        });

        lastY = yPos;
        asteroidCount++;

        setTimeout(spawnNextAsteroid, Math.max(500, spawnDelay - asteroidCount * 50));
    }

    spawnNextAsteroid();
}

// Función para spawnear aliens después de una oleada de meteoritos
function spawnAliens(wave) {
    aliens.length = 0;

    for (let i = 0; i < 2; i++) {
        const alienImage = new Image();
        alienImage.src = "assets/alien_shooter.png";

        aliens.push({
            x: canvas.width / 3 + i * 300,
            y: -100,
            width: 140,     //40
            height: 192.5,    //55
            image: alienImage
        });
    }

    let moveDown = setInterval(() => {
        for (let alien of aliens) {
            if (alien.y < 50) alien.y += 5;
        }
    }, 50);

    setTimeout(() => {
        clearInterval(moveDown);
        setTimeout(() => {
            aliens.length = 0;
            setTimeout(() => spawnAsteroidWave(2, null), 3000);
        }, 15000);
    }, 1000);
}

// Dibujar aliens en el `gameLoop`
function drawAliens() {
    for (let alien of aliens) {
        ctx.drawImage(alien.image, alien.x, alien.y, alien.width, alien.height);
    }
}

const alienProjectiles = []; // Lista de disparos enemigos

// Función para que los aliens disparen cada 3.5s
function alienShoot() {
    for (let alien of aliens) {
        // Calcular dirección hacia el jugador
        let dx = player.x + player.width / 2 - (alien.x + alien.width / 2);
        let dy = player.y + player.height / 2 - (alien.y + alien.height);
        let length = Math.sqrt(dx * dx + dy * dy); // Normalizar dirección
        dx /= length;
        dy /= length;

        const projectile = {
            x: alien.x + alien.width / 2 - 5, // Ajuste para que salga centrado
            y: alien.y + alien.height - 20, // Desde la parte inferior del alien
            width: 10,
            height: 10,
            speed: 5, // Velocidad constante
            dx: dx * 5, // Velocidad en X
            dy: dy * 5, // Velocidad en Y
            color: "red"
        };

        alienProjectiles.push(projectile);
    }

    // Disparar cada 3.5 segundos
    setTimeout(alienShoot, 3500);
}

// Función para actualizar la posición de los disparos enemigos
function updateAlienProjectiles() {
    for (let i = alienProjectiles.length - 1; i >= 0; i--) {
        const projectile = alienProjectiles[i];
        projectile.x += projectile.dx;
        projectile.y += projectile.dy;

        // Verificar colisión con el jugador
        if (
            projectile.x < player.x + player.width &&
            projectile.x + projectile.width > player.x &&
            projectile.y < player.y + player.height &&
            projectile.y + projectile.height > player.y
        ) {
            takeDamage(); // El jugador recibe daño
            alienProjectiles.splice(i, 1); // Eliminar el disparo tras impactar
        }

        // Eliminar proyectiles que salen de la pantalla
        if (
            projectile.x < 0 || projectile.x > canvas.width ||
            projectile.y < 0 || projectile.y > canvas.height
        ) {
            alienProjectiles.splice(i, 1);
        }
    }
}

// Función para dibujar los disparos enemigos
function drawAlienProjectiles() {
    for (let projectile of alienProjectiles) {
        ctx.fillStyle = projectile.color;
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);
    }
}


let alienBoosts = []; // Array separado para los aliens boost

// Función para spawnear aliens boost
// 🏹 Función para spawnear aliens "boost" uno a uno
function spawnBoostAlien() {
    if (alienBoostCount >= maxAlienBoosts) {
        spawningBoostAliens = false;
        setTimeout(() => spawnAsteroidWave(3, null), 3000);
        return;
    }

    const alienImage = new Image();
    alienImage.src = `assets/alien_boost${(alienBoostCount % 3) + 1}.png`;

    const alien = {
        x: -50,
        y: Math.random() * (canvas.height - 50),
        width: 189,     //54
        height: 175,    //50
        image: alienImage,
        speed: 3,
        targetX: player.x,
        targetY: player.y
    };

    alienBoosts.push(alien);
    alienBoostCount++;

    setTimeout(spawnBoostAlien, 2000);
}


// 🔥 Movimiento de aliens boost
// 🔥 Movimiento de aliens boost
function updateBoostAliens() {
    alienBoosts = alienBoosts.filter((alien) => {
        // Movimiento hacia el jugador
        let dx = player.x - alien.x;
        let dy = player.y - alien.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (length !== 0) {
            dx /= length;
            dy /= length;
            alien.x += dx * alien.speed;
            alien.y += dy * alien.speed;
        }

        // 🚨 DETECTAR COLISIÓN CON EL JUGADOR 🚨
        if (isColliding(alien, player)) {
            if (player.isImmortal) {
                score += 500; // Gana puntos en vez de recibir daño
                addFloatingText("+500", alien.x, alien.y);

                // 🔊 Reproducir sound.mp3 sin solapamiento
                clickSound.currentTime = 0; 
                clickSound.play();
            } else {
                takeDamage();
            }
            startExplosion(alien.x, alien.y, alien.width, alien.height);
            return false; // Eliminar el alien
        }

        // Eliminar si sale de la pantalla
        return alien.y <= canvas.height;
    });
}

// Dibujar los aliens boost
function drawBoostAliens(ctx) {
    for (const alien of alienBoosts) {
        if (alien.image.complete) {
            ctx.drawImage(alien.image, alien.x, alien.y, alien.width, alien.height);
        }
    }
}



// Función para spawnear Alien Bosses en la oleada 3
// Función para spawnear los Alien Bosses en secuencia
function spawnAlienBosses() {
    bosses.length = 0; // Reiniciar lista de bosses

    // Spawnear el primer boss (izquierda → derecha)
    setTimeout(() => {
        spawnSingleBoss(-120, 100, 1);
    }, 0);

    // Spawnear el segundo boss (derecha → izquierda) después de 5s
    setTimeout(() => {
        spawnSingleBoss(canvas.width + 120, 220, -1);
    }, 5000);

    // Spawnear el tercer boss (izquierda → derecha) después de 10s
    setTimeout(() => {
        spawnSingleBoss(-120, 340, 1);
    }, 10000);
}

// Función para crear un boss con dirección específica
function spawnSingleBoss(startX, y, speed) {
    const bossImage = new Image();
    bossImage.src = "assets/alien_boss_shield.png";

    const boss = {
        x: startX,
        y: y,
        width: 210,     //70
        height: 249,    //83
        speed: speed, // Velocidad inicial de entrada
        shooting: false, // No disparan al inicio
        shotsFired: 0, // Contador de disparos
        movingToPlayer: false, // Indica si están persiguiendo al jugador
        image: bossImage,
        shielded: true,
        clicksToDestroy: 8
    };

    bosses.push(boss);
    moveBoss(boss);
}

// Función para mover un boss hacia su posición inicial
function moveBoss(boss) {
    let moveInterval = setInterval(() => {
        // Si el boss entra completamente en pantalla, detener movimiento y comenzar disparo
        if ((boss.speed > 0 && boss.x >= 100) || (boss.speed < 0 && boss.x <= canvas.width - boss.width - 100)) {
            boss.speed = 0;
            boss.shooting = true;
            clearInterval(moveInterval);
            bossShoot(boss);
            return;
        }

        // Mover lentamente el boss hasta la posición inicial dentro del canvas
        boss.x += boss.speed * 2;

    }, 50);
}

// Función para que un boss individual dispare
function bossShoot(boss) {
    if (!boss.shooting) return;

    let dx = player.x + player.width / 2 - (boss.x + boss.width / 2);
    let dy = player.y + player.height / 2 - (boss.y + boss.height);
    let length = Math.sqrt(dx * dx + dy * dy);
    dx /= length;
    dy /= length;

    alienProjectiles.push({
        x: boss.x + boss.width / 2 - 5,
        y: boss.y + boss.height - 20,
        width: 10,
        height: 10,
        speed: 6,
        dx: dx * 6,
        dy: dy * 6,
        color: "purple"
    });

    boss.shotsFired++;

    // Si ha disparado menos de 5 veces, sigue disparando
    if (boss.shotsFired < 5) {
        setTimeout(() => bossShoot(boss), 2000);
    } else {
        // Después de 5 disparos, pierde el escudo y puede ser destruido con clics
        boss.shooting = false;
        boss.shielded = false;
        boss.image.src = "assets/alien_boss.png"; // Cambia a versión vulnerable
        enableBossClick(); // Activar detección de clics para destruirlo

        // Si no es destruido en 5s, empieza a moverse hacia el jugador
        setTimeout(() => {
            if (boss.clicksToDestroy > 0) {
                boss.movingToPlayer = true;
                moveBossToPlayer(boss);
            }
        }, 5000);
    }
}

// 🚀 Movimiento del Boss hacia el jugador
function moveBossToPlayer(boss) {
    let speedIncrease = 0.5; // Aceleración gradual

    let chaseInterval = setInterval(() => {
        if (!boss.movingToPlayer) {
            clearInterval(chaseInterval);
            return;
        }

        let dx = player.x - boss.x;
        let dy = player.y - boss.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (length !== 0) {
            dx /= length;
            dy /= length;
            boss.x += dx * (2 + speedIncrease);
            boss.y += dy * (2 + speedIncrease);
            speedIncrease += 0.2;
        }

        // 🚨 DETECTAR COLISIÓN CON EL JUGADOR 🚨
        if (isColliding(boss, player)) {
            startExplosion(boss.x, boss.y, boss.width, boss.height);
            if (player.isImmortal) {
                score += 1000; // Puntos extra en modo inmortal
                addFloatingText("+1000", boss.x, boss.y);
                // 🔊 Reproducir sound.mp3 sin solapamiento
                clickSound.currentTime = 0; 
                clickSound.play();
            } else {
                takeDamage();
            }
            bosses.splice(bosses.indexOf(boss), 1);
            clearInterval(chaseInterval);
        }

        // Si el boss sale de la pantalla, eliminarlo
        if (boss.x < -boss.width || boss.x > canvas.width || boss.y < -boss.height || boss.y > canvas.height) {
            bosses.splice(bosses.indexOf(boss), 1);
            clearInterval(chaseInterval);
        }

        // Si no quedan bosses, iniciar nueva oleada
        if (bosses.length === 0) {
            setTimeout(gameWin, 2000);
        }
    }, 50);
}

let godModeSequence = ""; // Guardará las letras ingresadas

document.addEventListener("keydown", (event) => {
    let key = event.key.toLowerCase();

    // Verificar si la secuencia es correcta
    if (key === "e") {
        godModeSequence = "e";
    } else if (godModeSequence === "e" && key === "l") {
        godModeSequence = "el";
    } else if (godModeSequence === "el" && key === "t") {
        godModeSequence = "elt";
    } else if (godModeSequence === "elt" && key === "o") {
        godModeSequence = "elto";
    } else if (godModeSequence === "elto" && key === "n") {
        godModeSequence = ""; // Reiniciar secuencia después de activarla

        // Activar modo inmortal
        player.isImmortal = true;
        player.isGodMode = true;
        player.image.src = "assets/rocketman_god.png";

        // Aumentar tamaño del jugador inmortal
        player.width = 170;
        player.height = 286;

        takeDamage = function () {
            console.log("Eres inmortal. No recibes daño.");
        };

        console.log("¡Modo inmortal activado!");

        // DETENER LA MÚSICA ACTUAL
        if (gameMusic) {
            gameMusic.pause();
            gameMusic.currentTime = 0;
        }

        // ESPERAR 3 SEGUNDOS Y REPRODUCIR musicgod.mp3 EN BUCLE
        setTimeout(() => {
            let godModeMusic = new Audio("assets/musicgod.mp3");
            godModeMusic.loop = true;
            godModeMusic.play();
        }, 3000);
    } else {
        godModeSequence = ""; // Reiniciar si se presiona una tecla incorrecta
    }
});








// function winGame() {
//     console.log("¡Has ganado la partida!");
    
//     gameStarted = false; // Evitar que el juego siga corriendo

//     // Limpiar el canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     // Fondo negro
//     ctx.fillStyle = "black";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Mostrar mensaje de victoria
//     ctx.fillStyle = "white";
//     ctx.font = "50px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText("¡Felicidades, has ganado!", canvas.width / 2, canvas.height / 2 - 50);
//     ctx.font = "30px Arial";
//     ctx.fillText("Presiona 'R' para reiniciar", canvas.width / 2, canvas.height / 2 + 20);
    
//     document.addEventListener("keydown", (event) => {
//         if (event.key.toLowerCase() === "r") {
//             location.reload(); // Reiniciar el juego
//         }
//     });
// }


// Función para habilitar los clics en los bosses
function enableBossClick() {
    canvas.addEventListener("click", (event) => {
        let clickX = event.clientX - canvas.getBoundingClientRect().left;
        let clickY = event.clientY - canvas.getBoundingClientRect().top;

        for (let i = bosses.length - 1; i >= 0; i--) {
            let boss = bosses[i];

            if (!boss.shielded && // Solo si no tiene escudo
                clickX >= boss.x && clickX <= boss.x + boss.width &&
                clickY >= boss.y && clickY <= boss.y + boss.height) {

                boss.clicksToDestroy--;

                // **Si el boss es destruido con clics, explota y desaparece**
                if (boss.clicksToDestroy <= 0) {
                    startExplosion(boss.x, boss.y, boss.width, boss.height); // Explosión en el boss
                    bosses.splice(i, 1);

                    // Si no quedan bosses, iniciar nueva oleada
                    if (bosses.length === 0) {
                        setTimeout(() => spawnAsteroidWave(1, null), 3000);
                    }
                }
            }
        }
    });
}


// Función para dibujar los Alien Bosses en el gameLoop
function drawAlienBosses() {
    for (let boss of bosses) {
        ctx.drawImage(boss.image, boss.x, boss.y, boss.width, boss.height);
    }
}

canvas.addEventListener("click", handleClick);

// 🌑 Movimiento de asteroides
function updateAsteroids() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].x += asteroidSpeed;

        // 🚨 DETECTAR COLISIÓN CON EL JUGADOR 🚨
        if (isColliding(asteroids[i], player)) {
            if (player.isImmortal) {
                score += 200; // Gana puntos en lugar de recibir daño
                addFloatingText("+200", asteroids[i].x, asteroids[i].y);

                // 🔊 Reproducir sound.mp3 sin solapamiento
                clickSound.currentTime = 0; 
                clickSound.play();
            } else {
                takeDamage();
            }
            startExplosion(asteroids[i].x, asteroids[i].y, asteroids[i].width, asteroids[i].height);
            asteroids.splice(i, 1); // Eliminar asteroide
            continue;
        }

        // Eliminar asteroides que salen de la pantalla
        if (asteroids[i] && asteroids[i].x > canvas.width) {
            asteroids.splice(i, 1);
        }
    }
}



function drawAsteroids() {
    for (let asteroid of asteroids) {
        ctx.drawImage(asteroid.image, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
    }
}


let score = 0; // Puntuación
let floatingTexts = []; // Lista de números flotantes

//Guardado 2
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Reproducir sonido
    clickSound.currentTime = 0; 
    clickSound.play();

    // Explosión donde hace clic el jugador
    startExplosion(mouseX - 25, mouseY - 25, 50, 50);

    // Verificar si impacta un asteroide
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        if (mouseX >= asteroid.x && mouseX <= asteroid.x + asteroid.width &&
            mouseY >= asteroid.y && mouseY <= asteroid.y + asteroid.height) {
            
            startExplosion(asteroid.x, asteroid.y, asteroid.width, asteroid.height);
            asteroids.splice(i, 1);
            
            let points = 100;
            if (player.isGodMode) points *= 100; // Multiplicar por 100 en modo inmortal
            score += points; 
            addFloatingText("+100", asteroid.x + asteroid.width / 2, asteroid.y);
            
            return; 
        }
    }

    // Verificar si impacta un alien boost
    for (let i = alienBoosts.length - 1; i >= 0; i--) {
        const alien = alienBoosts[i];
        if (mouseX >= alien.x && mouseX <= alien.x + alien.width &&
            mouseY >= alien.y && mouseY <= alien.y + alien.height) {
            
            // Reducir la vida del alien
            alien.hits = (alien.hits || 0) + 1;

            // Si ha recibido 3 impactos, explota y se elimina
            if (alien.hits >= 3) {
                startExplosion(alien.x, alien.y, alien.width, alien.height);
                alienBoosts.splice(i, 1);

                let points = 50;
                if (player.isGodMode) points *= 100; // Multiplicar por 100 en modo inmortal
                score += points;
                addFloatingText("+50", alien.x + alien.width / 2, alien.y);
            }
            return; 
        }
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Puntos: ${score}`, canvas.width - 20, 30);
}

// Función para agregar un número flotante cuando se obtiene puntuación
function addFloatingText(text, x, y) {
    floatingTexts.push({ text, x, y, opacity: 1 });
}

// Dibujar y actualizar números flotantes
function drawFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        let t = floatingTexts[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${t.opacity})`;
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(t.text, t.x, t.y);
        
        t.y -= 1; // Mover hacia arriba
        t.opacity -= 0.02; // Desvanecer

        if (t.opacity <= 0) {
            floatingTexts.splice(i, 1); // Eliminar cuando desaparezca
        }
    }
}

function startExplosion(x, y, width, height) {
    explosions.push({
        x,
        y,
        width,
        height,
        frameIndex: 0,
        image: new Image()
    });
}
function updateExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
        const explosion = explosions[i];

        // Avanzar al siguiente frame cada 100ms
        if (explosion.frameIndex < explosionFrames.length - 1) {
            explosion.frameIndex++;
        } else {
            explosions.splice(i, 1); // Eliminar la explosión cuando termine la animación
        }
    }
}

function drawExplosions() {
    for (let explosion of explosions) {
        const explosionImage = new Image();
        explosionImage.src = explosionFrames[explosion.frameIndex];
        ctx.drawImage(explosionImage, explosion.x, explosion.y, explosion.width, explosion.height);
    }
}
// Cargar sonido de daño
const damageSound = new Audio("assets/sound_damage.mp3");

function takeDamage() {
    if (player.lives > 0) {
        player.lives--;

        // Reproducir sonido de daño
        damageSound.currentTime = 0; // Reiniciar el sonido si ya se estaba reproduciendo
        damageSound.play().catch(error => console.log("Error al reproducir sonido de daño:", error));

        // Generar explosión en la posición de la nave
        startExplosion(player.x, player.y, player.width, player.height);

        // Alternar entre animaciones y ajustar tamaño
        if (player.lives % 2 === 0) {
            frames.length = 0;
            frames.push(...damagedFrames);
            player.width = 185;     // 37
            player.height = 130;    //26
        } else {
            frames.length = 0;
            frames.push(...normalFrames);
            player.width = 68;      // 34
            player.height = 112;    //56
        }

        frameIndex = 0; // Reiniciar la animación con la nueva secuencia
        player.image.src = frames[frameIndex];
    }

    if (player.lives <= 0) {
        console.log("GAME OVER"); // Aquí puedes manejar el fin del juego
        gameOver();
    }
}


// 📏 Función genérica para detectar colisiones
function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

//gameLoop();
//spawnAsteroidWave();
//alienShoot(); // Iniciar disparos de aliens



// Código para los asteroides

