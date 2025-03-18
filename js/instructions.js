// 📜 Evento que se ejecuta cuando el documento ha cargado completamente
document.addEventListener("DOMContentLoaded", function() {
    // 📌 Seleccionar elementos del DOM
    const instructionsBox = document.getElementById("instructionsBox"); // Contenedor de instrucciones
    const toggleButton = document.getElementById("toggleInstructions"); // Botón para mostrar/ocultar instrucciones
    const instructionsContent = document.querySelector(".instructions-content"); // Contenido de las instrucciones

    // 🔍 Mostrar el contenido de las instrucciones al cargar la página
    instructionsContent.style.display = "block";

    // 🎛️ Agregar evento de clic al botón para alternar la visibilidad del contenido
    toggleButton.addEventListener("click", function() {
        instructionsBox.classList.toggle("open"); // Alterna la clase "open" en el contenedor

        // 🎭 Mostrar u ocultar el contenido de las instrucciones
        if (instructionsBox.classList.contains("open")) {
            instructionsContent.style.display = "block"; // Mostrar si está abierto
        } else {
            instructionsContent.style.display = "none"; // Ocultar si está cerrado
        }
    });
});
