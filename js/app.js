const container = document.getElementById('keychain-container');
const keys = document.querySelectorAll('.key-item');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function loop() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (container) {
        // On incline le bloc entier
        container.style.transform = `rotateX(${currentY * -12}deg) rotateY(${currentX * 15}deg)`;
    }

    keys.forEach((key, index) => {
        const factor = index + 1;
        // zDistance réduit pour éviter que ça ne devienne trop grand
        const zDistance = factor * 12; 
        
        // C'est ici qu'on crée le balancement indépendant
        const tiltX = currentX * (factor * 6);
        const tiltY = currentY * (factor * 3);
        
        // On applique les transformations
        key.style.transform = `translateZ(${zDistance}px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
    });

    requestAnimationFrame(loop);
}

loop();

// Clics vers les projets
keys.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if(id) window.location.href = `project.html?id=${id}`;
    });
});
