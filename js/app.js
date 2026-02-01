const container = document.getElementById('keychain-container');
const keys = document.querySelectorAll('.key-item');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function loop() {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;

    // On fait tourner le bloc central
    if (container) {
        container.style.transform = `rotateX(${currentY * -15}deg) rotateY(${currentX * 20}deg)`;
    }

    // On applique la profondeur à chaque clé SANS les décaler du centre
    keys.forEach((key, index) => {
        const factor = index + 1;
        const z = factor * 20; // Profondeur légère
        const rY = currentX * (factor * 5); // Balancement
        key.style.transform = `translateZ(${z}px) rotateY(${rY}deg)`;
    });

    requestAnimationFrame(loop);
}
loop();

// Gestion du clic
keys.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        if(id) window.location.href = `project.html?id=${id}`;
    });
});
