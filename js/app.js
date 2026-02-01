const layers = document.querySelectorAll('.key-layer');
const items = document.querySelectorAll('.key-item');

items.forEach((item) => {
    item.addEventListener('mouseenter', () => {
        // On récupère l'ID de la clé survolée (ex: "3")
        const hoveredId = parseInt(item.getAttribute('data-id'));

        layers.forEach((layer) => {
            const layerImg = layer.querySelector('img');
            // On vérifie si ce layer contient une image de clé avec un data-id
            const itemInside = layer.getAttribute('data-id');
            const layerId = itemInside ? parseInt(itemInside) : null;

            if (!layerId) return; // On ne touche pas au support fixe (index 0)

            if (layerId < hoveredId) {
                // Éléments à gauche : décalage vers la gauche + petite rotation
                layer.style.transform = "translateX(-120px) rotate(-8deg) scale(0.9)";
                layer.style.opacity = "0.4";
                layer.style.filter = "blur(4px)";
            } 
            else if (layerId > hoveredId) {
                // Éléments à droite : décalage vers la droite + petite rotation
                layer.style.transform = "translateX(120px) rotate(8deg) scale(0.9)";
                layer.style.opacity = "0.4";
                layer.style.filter = "blur(4px)";
            } 
            else {
                // L'élément survolé : on le met en avant
                layer.style.transform = "translateX(0) scale(1.15) translateZ(50px)";
                layer.style.opacity = "1";
                layer.style.filter = "blur(0)";
                layer.style.zIndex = "100";
            }
        });
    });

    // Quand on quitte le survol : tout revient à zéro
    item.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            layer.style.transform = "translateX(0) rotate(0) scale(1) translateZ(0)";
            layer.style.opacity = "1";
            layer.style.filter = "blur(0)";
            layer.style.zIndex = ""; // Reset le z-index
        });
    });
});

// Redirection vers les pages projets
items.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if(id) window.location.href = `project.html?id=${id}`;
    });
});
