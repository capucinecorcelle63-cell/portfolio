const layers = document.querySelectorAll('.key-layer');
const keyImages = document.querySelectorAll('.key-item img');

keyImages.forEach((img) => {
    const parentLayer = img.parentElement;
    const hoveredId = parseInt(parentLayer.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        // 1. On nettoie les anciennes classes actives
        layers.forEach(l => l.classList.remove('is-active'));
        
        // 2. On met la clé actuelle au premier plan
        parentLayer.classList.add('is-active');

        // 3. On applique les rotations
        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));

            if (!layerId) return; // Support fixe

            if (layerId < hoveredId) {
                layer.style.transform = "rotate(-25deg)";
            } 
            else if (layerId > hoveredId) {
                layer.style.transform = "rotate(25deg)";
            } 
            else {
                // L'élément sous la souris ne bouge pas d'un poil
                layer.style.transform = "rotate(0deg)";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            // Remise à zéro
            layer.style.transform = "rotate(0deg)";
            layer.classList.remove('is-active');
        });
    });

    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
