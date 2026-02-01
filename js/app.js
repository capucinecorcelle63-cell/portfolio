const container = document.getElementById('keychain-container');
const layers = document.querySelectorAll('.key-layer'); // On prend TOUS les calques (support inclus)

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    curX += (mouseX - curX) * 0.08;
    curY += (mouseY - curY) * 0.08;

    layers.forEach((layer, index) => {
        // Chaque couche (index) bouge un peu plus que la précédente
        const depth = index * 25; 
        const moveX = curX * (index * 8); 
        const moveY = curY * (index * 5);

        layer.style.transform = `translateZ(${depth}px) rotateY(${moveX}deg) rotateX(${moveY}deg)`;
    });

    requestAnimationFrame(animate);
}
animate();
