const layers = document.querySelectorAll('.key-layer');
const keyImages = document.querySelectorAll('.key-item img');

keyImages.forEach((img) => {
    const parent = img.parentElement;
    const hoveredId = parseInt(parent.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        // Force la clé survolée à être au premier plan absolu
        layers.forEach(l => {
            l.classList.remove('is-active');
            l.style.zIndex = "10"; 
        });
        
        parent.classList.add('is-active');
        parent.style.zIndex = "100";

        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));
            if (!layerId) return; // Ignore le support

            const diff = layerId - hoveredId;

            if (diff < 0) {
                // Clés à gauche : rotation négative
                // On ajoute un petit décalage X pour l'effet "éventail"
                layer.style.transform = `rotate(${-25 + (diff * 2)}deg) translateX(${-10}px)`;
            } else if (diff > 0) {
                // Clés à droite : rotation positive
                layer.style.transform = `rotate(${25 + (diff * 2)}deg) translateX(${10}px)`;
            } else {
                // LA CLÉ SOUS LA SOURIS : Zéro rotation pour rester sur l'anneau
                layer.style.transform = "rotate(0deg) translateY(5px)";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            layer.style.transform = "rotate(0deg) translateX(0) translateY(0)";
            layer.classList.remove('is-active');
            // Reset z-index après l'animation pour éviter les sauts visuels
            setTimeout(() => { layer.style.zIndex = layer.dataset.id ? "10" : "5"; }, 500);
        });
    });
});
