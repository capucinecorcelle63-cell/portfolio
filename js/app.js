const layers = document.querySelectorAll('.key-layer');
const keyImages = document.querySelectorAll('.key-item img');

keyImages.forEach((img) => {
    const parentLayer = img.parentElement;
    const hoveredId = parseInt(parentLayer.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        // IMPORTANT : Quand on entre, on met la clé survolée tout devant immédiatement
        parentLayer.style.zIndex = "100";

        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));
            if (!layerId) return; // Ignore le support

            if (layerId < hoveredId) {
                // Écartement horaire (Gauche)
                layer.style.transform = "rotate(-25deg)";
            } 
            else if (layerId > hoveredId) {
                // Écartement anti-horaire (Droite)
                layer.style.transform = "rotate(25deg)";
            } 
            else {
                // L'élément survolé : AUCUN mouvement, reste soudé au support
                layer.style.transform = "rotate(0deg)";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));
            
            // Remise à zéro
            layer.style.transform = "rotate(0deg)";
            
            // On remet le z-index de base (10) après une micro-seconde 
            // pour ne pas casser la transition
            setTimeout(() => {
                if (layer.classList.contains('key-item')) {
                    layer.style.zIndex = "10";
                }
            }, 100);
        });
    });

    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
