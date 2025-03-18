// 🎮 Selección de elementos del DOM
const canvas = document.getElementById("gameCanvas"); // Lienzo donde se dibuja el juego
const ctx = canvas.getContext("2d"); // Contexto 2D para renderizar gráficos
const menuScreen = document.getElementById("menuScreen"); // Pantalla del menú principal
const gameScreen = document.getElementById("gameScreen"); // Pantalla donde se ejecuta el juego
const startButton = document.getElementById("startGame"); // Botón para iniciar el juego

// 📏 Configuración del tamaño del canvas
canvas.width = 1300; // Ancho del lienzo del juego
canvas.height = 700; // Alto del lienzo del juego


// 🔄 Estado del juego
let gameStarted = false; // Variable que indica si el juego ha comenzado

// 🎵 Sonidos y música
const menuSound = new Audio("assets/menu_sound.mp3"); // Sonido del menú
const gameMusic = new Audio("assets/music.mp3"); // Música de fondo del juego
gameMusic.loop = true; // Habilitar la reproducción en bucle de la música del juego

// 🔊 Reproducir sonido del menú al hacer clic en cualquier botón
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        // Si el sonido del menú está pausado, se reproduce
        if (menuSound.paused) {
            menuSound.play().catch(error => console.log("Error al reproducir sonido del menú:", error));
        }
    });
});

// 🎮 FUNCIÓN QUE INICIA EL JUEGO
function startGame() {
    // 🛑 Evita que el juego se inicie más de una vez
    if (gameStarted) return;

    console.log("Juego iniciado!");
    gameStarted = true; // Marca el estado del juego como iniciado

    // 🔥 Ocultar el menú con una animación de desvanecimiento
    menuScreen.classList.add("fade-out");

    setTimeout(() => {
        menuScreen.style.display = "none"; // Oculta el menú después de la animación
        gameScreen.classList.remove("d-none"); // Muestra la pantalla del juego

        // 🎵 Iniciar la música del juego
        gameMusic.play().catch(error => console.log("Error al reproducir música:", error));

        // ⏳ Retraso breve antes de iniciar la lógica del juego
        setTimeout(() => {
            gameLoop(); // Inicia el bucle principal del juego
            spawnAsteroidWave(); // Genera la primera oleada de asteroides
            alienShoot(); // Hace que los aliens comiencen a disparar
        }, 100);
    }, 500); // Retraso para permitir la animación de salida del menú
}

// 🛑 FUNCIÓN QUE SE EJECUTA CUANDO EL JUGADOR MUERE
function gameOver() {
    console.log("Juego terminado");
    gameStarted = false; // Marca el juego como terminado

    // 🎵 Detener la música del juego y reiniciar el tiempo de reproducción
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

// 🎮 ASIGNAR EVENTO AL BOTÓN DE INICIO
startButton.addEventListener("click", startGame);

// 🔄 REINICIAR LA MÚSICA CUANDO TERMINE
gameMusic.addEventListener("ended", () => {
    if (gameStarted) {
        gameMusic.play().catch(error => console.log("Error al reiniciar música:", error));
    }
});

// 📌 EVENTO PARA OCULTAR EL MENÚ Y MOSTRAR EL JUEGO CUANDO SE PRESIONA "INICIAR"
document.getElementById("startGame").addEventListener("click", function () {
    document.getElementById("menuScreen").classList.add("d-none"); // Oculta el menú
    document.getElementById("gameScreen").classList.remove("d-none"); // Muestra el juego

    startGame(); // Inicia el juego llamando a la función principal
});
