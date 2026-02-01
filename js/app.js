const layers = document.querySelectorAll('.key-layer');

layers.forEach((currentLayer) => {
    // On n'écoute que les calques qui ont la classe 'key-item'
    if (!currentLayer.classList.contains('key-item')) return;

    currentLayer.addEventListener('mouseenter', () => {
        const hoveredId = parseInt(currentLayer.getAttribute('data-id'));

        layers.forEach((layer) => {
            const layerId = parseInt(layer.getAttribute('data-id'));

            if (!layerId) return; // On ignore le support

            if (layerId < hoveredId) {
                // On pousse à gauche
                layer.style.transform = "translateX(-150px) rotate(-10deg)";
                layer.style.filter = "brightness(0.5) blur(2px)";
            } else if (layerId > hoveredId) {
                // On pousse à droite
                layer.style.transform = "translateX(150px) rotate(10deg)";
                layer.style.filter = "brightness(0.5) blur(2px)";
            } else {
                // Celle qu'on survole monte un peu
                layer.style.transform = "scale(1.1) translateY(-20px)";
                layer.style.filter = "brightness(1.2)";
                layer.style.zIndex = "100";
            }
        });
    });

    currentLayer.addEventListener('mouseleave', () => {
        layers.forEach((layer) => {
            layer.style.transform = "translateX(0) rotate(0) scale(1)";
            layer.style.filter = "brightness(1) blur(0)";
            layer.style.zIndex = layer.getAttribute('data-id') ? "10" : "1";
        });
    });
});
