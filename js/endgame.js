// Cargar imágenes y sonidos
const gameOverSound = new Audio("assets/sound_lose.mp3");
const victorySound = new Audio("assets/sound_victory.mp3");

// FUNCIÓN PARA MOSTRAR LA PANTALLA FINAL (Victoria o Game Over)
function showEndScreen(isVictory) {
    // Crear un contenedor para la pantalla de fin
    const endScreen = document.createElement("div");
    endScreen.id = "endScreen";
    endScreen.style.position = "fixed";
    endScreen.style.top = "0";
    endScreen.style.left = "0";
    endScreen.style.width = "100vw";
    endScreen.style.height = "100vh";
    endScreen.style.background = `url('background.png') no-repeat center center`;
    endScreen.style.backgroundSize = "cover";
    endScreen.style.display = "flex";
    endScreen.style.flexDirection = "column";
    endScreen.style.alignItems = "center";
    endScreen.style.justifyContent = "center";
    endScreen.style.zIndex = "9999";

    // Texto de victoria o derrota
    const title = document.createElement("h1");
    title.textContent = isVictory ? "¡Victoria!" : "Game Over";
    title.style.color = "white";
    title.style.fontSize = "50px";
    title.style.marginBottom = "20px";
    endScreen.appendChild(title);

    // Reproducir sonido según el resultado
    if (isVictory) {
        victorySound.play();
    } else {
        gameOverSound.play();
    }

    // Botón de Reintentar
    const retryButton = document.createElement("button");
    retryButton.textContent = "Reintentar";
    retryButton.style.padding = "10px 20px";
    retryButton.style.fontSize = "20px";
    retryButton.style.margin = "10px";
    retryButton.addEventListener("click", () => {
        location.reload(); // Recargar la página para reiniciar el juego
    });

    // Botón de Menú Principal
    const menuButton = document.createElement("button");
    menuButton.textContent = "Menú Principal";
    menuButton.style.padding = "10px 20px";
    menuButton.style.fontSize = "20px";
    menuButton.style.margin = "10px";
    menuButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Redirigir al menú principal
    });

    // Agregar los botones a la pantalla final
    endScreen.appendChild(retryButton);
    endScreen.appendChild(menuButton);

    // Agregar la pantalla final al body
    document.body.appendChild(endScreen);
}

// FUNCIÓN PARA LLAMAR CUANDO EL JUGADOR PIERDA
function gameOver() {
    console.log("Juego terminado");
    gameStarted = false;
    gameMusic.pause();
    gameMusic.currentTime = 0;
    showEndScreen(false); // Mostrar pantalla de derrota
}

// FUNCIÓN PARA LLAMAR CUANDO EL JUGADOR GANE
function gameWin() {
    console.log("¡Has ganado!");
    gameStarted = false;
    gameMusic.pause();
    gameMusic.currentTime = 0;
    showEndScreen(true); // Mostrar pantalla de victoria
}
