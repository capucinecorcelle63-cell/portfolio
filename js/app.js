const layers = document.querySelectorAll('.key-layer');
const keyImages = document.querySelectorAll('.key-item img');

keyImages.forEach((img) => {
    const parentLayer = img.parentElement;
    const hoveredId = parseInt(parentLayer.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));

            if (!layerId) return; // Le support reste fixe

            if (layerId < hoveredId) {
                // Les clés à gauche pivotent vers la gauche
                layer.style.transform = "rotate(-25deg)";
            } 
            else if (layerId > hoveredId) {
                // Les clés à droite pivotent vers la droite
                layer.style.transform = "rotate(25deg)";
            } 
            else {
                // L'ÉLÉMENT SURVOLÉ :
                // On ne touche pas au transform pour qu'il reste accroché
                layer.style.transform = "rotate(0deg)"; 
                layer.style.zIndex = "100"; // Passe juste devant
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            // Remise à zéro totale
            layer.style.transform = "rotate(0deg)";
            layer.style.zIndex = layer.classList.contains('key-item') ? "10" : "1";
        });
    });

    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
