const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const startButton = document.getElementById("startGame");

canvas.width = 1300;
canvas.height = 700;

let gameStarted = false;

const menuSound = new Audio("assets/menu_sound.mp3");
const gameMusic = new Audio("assets/music.mp3");
gameMusic.loop = true;

// Reproducir sonido del menú solo si está pausado
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        if (menuSound.paused) {
            menuSound.play().catch(error => console.log("Error al reproducir sonido del menú:", error));
        }
    });
});

// FUNCIÓN QUE INICIA EL JUEGO
function startGame() {
    if (gameStarted) return;
    
    console.log("Juego iniciado!");
    gameStarted = true;

    // Ocultar menú con animación
    menuScreen.classList.add("fade-out");

    setTimeout(() => {
        menuScreen.style.display = "none"; // Ocultar menú
        gameScreen.classList.remove("d-none"); // Mostrar el juego

        // Reproducir música
        gameMusic.play().catch(error => console.log("Error al reproducir música:", error));

        // Iniciar el juego
        setTimeout(() => {
            gameLoop();
            spawnAsteroidWave();
            alienShoot();
        }, 100);
    }, 500);
}

// DETENER LA MÚSICA CUANDO EL JUGADOR MUERA
function gameOver() {
    console.log("Juego terminado");
    gameStarted = false;
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

// ASIGNAR EVENTO AL BOTÓN DE INICIO
startButton.addEventListener("click", startGame);

// Si la música termina, reiniciarla
gameMusic.addEventListener("ended", () => {
    if (gameStarted) {
        gameMusic.play().catch(error => console.log("Error al reiniciar música:", error));
    }
});
document.getElementById("startGame").addEventListener("click", function () {
    document.getElementById("menuScreen").classList.add("d-none"); // Oculta el menú
    document.getElementById("gameScreen").classList.remove("d-none"); // Muestra el juego

    startGame(); // Llama a la función que inicia el juego
});
