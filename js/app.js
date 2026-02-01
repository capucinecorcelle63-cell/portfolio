const container = document.getElementById('keychain-container');
const keys = document.querySelectorAll('.key-item');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function loop() {
    // Mouvement du support principal
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (container) {
        container.style.transform = `rotateX(${currentY * -15}deg) rotateY(${currentX * 20}deg)`;
    }

    // Mouvement individuel de chaque clé (le balancement)
    keys.forEach((key, index) => {
        const depth = (index + 1) * 0.15; // Chaque clé réagit différemment
        const lagX = currentX * (20 + index * 10); 
        const lagY = currentY * (10 + index * 5);
        
        // On applique une rotation propre à chaque calque
        key.style.transform = `translateZ(${index * 20}px) rotateY(${lagX * 0.2}deg) rotateX(${lagY * 0.2}deg)`;
    });

    requestAnimationFrame(loop);
}
loop();
