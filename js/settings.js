// 🎵 Seleccionar elementos de audio (se asume que `gameMusic`, `menuSound`, `gameOverSound` y `victorySound` ya están definidos)

// 🎚️ Seleccionar sliders de volumen desde el DOM
const musicVolumeSlider = document.getElementById("musicVolume");  // Control deslizante para la música
const effectsVolumeSlider = document.getElementById("effectsVolume");  // Control deslizante para efectos de sonido

// 🔊 Establecer valores iniciales de los sliders según los volúmenes actuales
musicVolumeSlider.value = gameMusic.volume;
effectsVolumeSlider.value = menuSound.volume; 

// 🎵 Función para actualizar el volumen de la música en tiempo real
musicVolumeSlider.addEventListener("input", () => {
    gameMusic.volume = musicVolumeSlider.value; // Ajusta el volumen de la música de fondo
});

// 🔊 Función para actualizar el volumen de los efectos de sonido en tiempo real
effectsVolumeSlider.addEventListener("input", () => {
    menuSound.volume = effectsVolumeSlider.value; // Ajusta volumen del sonido del menú
    gameOverSound.volume = effectsVolumeSlider.value; // Ajusta volumen del sonido de Game Over
    victorySound.volume = effectsVolumeSlider.value; // Ajusta volumen del sonido de victoria
});

// 🔘 Reproducir el sonido del menú al hacer clic en cualquier botón de la interfaz
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        menuSound.currentTime = 0; // Reinicia el sonido para evitar solapamientos
        menuSound.play().catch(error => console.log("Error al reproducir sonido del menú:", error));
    });
});
