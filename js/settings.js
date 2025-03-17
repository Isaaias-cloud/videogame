// Seleccionar elementos de audio


// Seleccionar sliders
const musicVolumeSlider = document.getElementById("musicVolume");
const effectsVolumeSlider = document.getElementById("effectsVolume");

// Establecer volúmenes iniciales
musicVolumeSlider.value = gameMusic.volume;
effectsVolumeSlider.value = menuSound.volume;

// Función para actualizar el volumen de la música
musicVolumeSlider.addEventListener("input", () => {
    gameMusic.volume = musicVolumeSlider.value;
});

// Función para actualizar el volumen de los efectos de sonido
effectsVolumeSlider.addEventListener("input", () => {
    menuSound.volume = effectsVolumeSlider.value;
    gameOverSound.volume = effectsVolumeSlider.value;
    victorySound.volume = effectsVolumeSlider.value;
});

// Reproducir sonido de menú al hacer clic en cualquier botón
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
        menuSound.currentTime = 0; // Reinicia el sonido
        menuSound.play().catch(error => console.log("Error al reproducir sonido del menú:", error));
    });
});
