const layers = document.querySelectorAll('.key-layer');
const images = document.querySelectorAll('.key-item img');

images.forEach((img) => {
    const parent = img.parentElement;
    const hoveredId = parseInt(parent.getAttribute('data-id'));

    img.addEventListener('mouseenter', () => {
        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));

            // Le support (id null) reste fixe
            if (!layerId) return;

            if (layerId < hoveredId) {
                // Les clés à gauche pivotent vers la gauche
                layer.style.transform = "rotate(-25deg) translateX(-40px)";
                layer.style.zIndex = "5";
            } 
            else if (layerId > hoveredId) {
                // Les clés à droite pivotent vers la droite
                layer.style.transform = "rotate(25deg) translateX(40px)";
                layer.style.zIndex = "5";
            } 
            else {
                // La clé survolée s'agrandit légèrement et reste droite
                layer.style.transform = "scale(1.05) translateY(10px)";
                layer.style.zIndex = "100";
            }
        });
    });

    img.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            // Tout revient en place
            layer.style.transform = "rotate(0deg) translateX(0) scale(1) translateY(0)";
            layer.style.zIndex = layer.classList.contains('key-item') ? "10" : "1";
        });
    });

    // Redirection au clic
    img.addEventListener('click', () => {
        window.location.href = `project.html?id=${hoveredId}`;
    });
});
