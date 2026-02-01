const container = document.getElementById('keychain-container');
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener('mousemove', (e) => {
    // On récupère la position de la souris de -1 à 1
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    // On crée un mouvement fluide (Lerp)
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // On applique une rotation plus forte (30 degrés)
    const rotateY = currentX * 30; 
    const rotateX = -currentY * 30;

    if(container) {
        container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    requestAnimationFrame(animate);
}

animate();
