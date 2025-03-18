// 🎵 CARGAR SONIDOS DE FIN DEL JUEGO
const gameOverSound = new Audio("assets/sound_lose.mp3");  // Sonido de derrota
const victorySound = new Audio("assets/sound_victory.mp3"); // Sonido de victoria

// 🏆 FUNCIÓN PARA MOSTRAR LA PANTALLA FINAL (Victoria o Game Over)
function showEndScreen(isVictory) {
    // 📌 Crear un contenedor para la pantalla final
    const endScreen = document.createElement("div");
    endScreen.id = "endScreen";
    endScreen.style.position = "fixed";
    endScreen.style.top = "0";
    endScreen.style.left = "0";
    endScreen.style.width = "100vw";
    endScreen.style.height = "100vh";
    //endScreen.style.background = `url('assets/background.png') no-repeat center center`;
    endScreen.style.backgroundSize = "cover";
    endScreen.style.display = "flex";
    endScreen.style.flexDirection = "column";
    endScreen.style.alignItems = "center";
    endScreen.style.justifyContent = "center";
    endScreen.style.zIndex = "9999"; // Asegurar que esté sobre todo lo demás

    // 📝 Mostrar texto de "Victoria" o "Game Over" según el resultado
    const title = document.createElement("h1");
    title.textContent = isVictory ? "¡Victoria!" : "Game Over";
    title.style.color = "white";
    title.style.fontSize = "50px";
    title.style.marginBottom = "20px";
    endScreen.appendChild(title);

    // 🎵 Reproducir el sonido correspondiente
    if (isVictory) {
        victorySound.play();
    } else {
        gameOverSound.play();
    }

    // 🔄 BOTÓN PARA REINTENTAR EL JUEGO
    const retryButton = document.createElement("button");
    retryButton.textContent = "Reintentar";
    retryButton.style.padding = "10px 20px";
    retryButton.style.fontSize = "20px";
    retryButton.style.margin = "10px";
    retryButton.addEventListener("click", () => {
        location.reload(); // Recargar la página para reiniciar el juego
    });

    // 🔙 BOTÓN PARA VOLVER AL MENÚ PRINCIPAL
    const menuButton = document.createElement("button");
    menuButton.textContent = "Menú Principal";
    menuButton.style.padding = "10px 20px";
    menuButton.style.fontSize = "20px";
    menuButton.style.margin = "10px";
    menuButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Redirigir al menú principal
    });

    // 📌 Agregar los botones a la pantalla final
    endScreen.appendChild(retryButton);
    endScreen.appendChild(menuButton);

    // 📌 Agregar la pantalla final al body
    document.body.appendChild(endScreen);
}


// ❌ FUNCIÓN QUE SE EJECUTA CUANDO EL JUGADOR PIERDE
function gameOver() {
    console.log("Juego terminado"); // Mensaje en la consola
    gameStarted = false; // Detiene el estado del juego
    gameMusic.pause(); // Pausa la música de fondo
    gameMusic.currentTime = 0; // Reinicia la música al inicio
    showEndScreen(false); // Muestra la pantalla de "Game Over"
}

// 🏆 FUNCIÓN QUE SE EJECUTA CUANDO EL JUGADOR GANA
function gameWin() {
    console.log("¡Has ganado!"); // Mensaje en la consola
    gameStarted = false; // Detiene el estado del juego
    gameMusic.pause(); // Pausa la música de fondo
    gameMusic.currentTime = 0; // Reinicia la música al inicio
    showEndScreen(true); // Muestra la pantalla de "Victoria"
}

