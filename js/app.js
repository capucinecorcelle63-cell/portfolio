const layers = document.querySelectorAll('.key-layer');
const images = document.querySelectorAll('.key-item img');

images.forEach((img) => {
    const parent = img.parentElement;
    const hoveredId = parseInt(parent.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));

            // On ignore le support
            if (!layerId) return;

            if (layerId < hoveredId) {
                // Écartement vers la gauche avec rotation inverse
                layer.style.transform = "translateX(-160px) rotate(-12deg) scale(0.85)";
                layer.style.filter = "brightness(0.4) blur(3px)";
                layer.style.opacity = "0.6";
            } 
            else if (layerId > hoveredId) {
                // Écartement vers la droite avec rotation
                layer.style.transform = "translateX(160px) rotate(12deg) scale(0.85)";
                layer.style.filter = "brightness(0.4) blur(3px)";
                layer.style.opacity = "0.6";
            } 
            else {
                // Clé sélectionnée : zoom et élévation
                layer.style.transform = "scale(1.15) translateY(-40px) translateZ(50px)";
                layer.style.filter = "brightness(1.2) blur(0)";
                layer.style.opacity = "1";
                layer.style.zIndex = "100";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            // Retour à la position initiale
            layer.style.transform = "translateX(0) rotate(0) scale(1) translateY(0)";
            layer.style.filter = "brightness(1) blur(0)";
            layer.style.opacity = "1";
            layer.style.zIndex = layer.classList.contains('key-item') ? "10" : "1";
        });
    });

    // Clic pour redirection
    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
