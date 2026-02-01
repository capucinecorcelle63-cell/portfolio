const container = document.getElementById('keychain-container');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

// 1. Suivi de la souris
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// 2. Boucle d'animation fluide
function loop() {
    currentX += (mouseX - currentX) * 0.08; // Vitesse de suivi
    currentY += (mouseY - currentY) * 0.08;

    const rotX = currentY * -20; // Intensité inclinaison H/B
    const rotY = currentX * 25;  // Intensité inclinaison G/D

    if (container) {
        container.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }
    requestAnimationFrame(loop);
}
loop();

// 3. Gestion du clic sur les clés
document.querySelectorAll('.key-item').forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        window.location.href = `project.html?id=${id}`;
    });
});
