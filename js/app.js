const container = document.getElementById('keychain-container');
const keys = document.querySelectorAll('.key-item');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

// 1. On écoute la souris
document.addEventListener('mousemove', (e) => {
    // Coordonnées de -1 à 1
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function loop() {
    // Interpolation (le "lissage" du mouvement)
    currentX += (mouseX - currentX) * 0.07;
    currentY += (mouseY - currentY) * 0.07;

    // 2. On fait tourner le bloc entier (légèrement)
    if (container) {
        container.style.transform = `rotateX(${currentY * -10}deg) rotateY(${currentX * 15}deg)`;
    }

    // 3. On fait balancer chaque clé INDIVIDUELLEMENT
    keys.forEach((key, index) => {
        // Chaque clé bouge un peu plus que la précédente (index + 1)
        const factor = index + 1;
        const tiltX = currentX * (factor * 8); 
        const tiltY = currentY * (factor * 4);
        
        // On combine la profondeur (Z) et le balancement (rotate)
        // L'ordre est crucial : translateZ d'abord !
        key.style.transform = `translateZ(${factor * 30}px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
    });

    requestAnimationFrame(loop);
}

// 4. On lance l'animation
loop();

// 5. Lien vers les projets
keys.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if(id) window.location.href = `project.html?id=${id}`;
    });
});
