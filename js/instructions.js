document.addEventListener("DOMContentLoaded", function() {
    const instructionsBox = document.getElementById("instructionsBox");
    const toggleButton = document.getElementById("toggleInstructions");
    const instructionsContent = document.querySelector(".instructions-content");

    // Mostrar el contenido al cargar
    instructionsContent.style.display = "block";

    toggleButton.addEventListener("click", function() {
        instructionsBox.classList.toggle("open");

        // Mostrar/ocultar las instrucciones debajo del botón
        if (instructionsBox.classList.contains("open")) {
            instructionsContent.style.display = "block";
        } else {
            instructionsContent.style.display = "none";
        }
    });
});
