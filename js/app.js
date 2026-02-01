const layers = document.querySelectorAll('.key-layer');
const keyImages = document.querySelectorAll('.key-item img');

keyImages.forEach((img) => {
    const parentLayer = img.parentElement;
    const hoveredId = parseInt(parentLayer.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        // On nettoie les états précédents
        layers.forEach(l => l.classList.remove('is-active'));
        
        // On active la clé sous la souris
        parentLayer.classList.add('is-active');
        parentLayer.style.zIndex = "500"; // Passe devant tout le monde

        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));
            if (!layerId) return; // Ne touche pas au support

            const distance = layerId - hoveredId;

            if (distance < 0) {
                // Écartement à gauche (proportionnel à la distance)
                const angle = -20 + (distance * 2); 
                layer.style.transform = `rotate(${angle}deg)`;
            } 
            else if (distance > 0) {
                // Écartement à droite (proportionnel à la distance)
                const angle = 20 + (distance * 2);
                layer.style.transform = `rotate(${angle}deg)`;
            } 
            else {
                // La clé survolée reste SOUDÉE au support (0 mouvement)
                layer.style.transform = "rotate(0deg) scale(1.02)";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            layer.style.transform = "rotate(0deg) scale(1)";
            layer.classList.remove('is-active');
            
            // On remet les z-index de base après l'animation
            setTimeout(() => {
                if (layer.classList.contains('key-item')) {
                    layer.style.zIndex = "10";
                } else {
                    layer.style.zIndex = "1";
                }
            }, 500);
        });
    });

    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
