const container = document.getElementById('keychain-container');

document.addEventListener('mousemove', (e) => {
    if (!container) return;

    // Calcul de la position de la souris (de -0.5 à 0.5)
    const x = (e.clientX / window.innerWidth) - 0.5;
    const y = (e.clientY / window.innerHeight) - 0.5;

    // Rotation limitée pour éviter de perdre l'image
    const rotateX = y * -20; // Max 20 degrés
    const rotateY = x * 20;

    container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Gestion du clic sur les clés
document.querySelectorAll('.key-item').forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        window.location.href = `project.html?id=${id}`;
    });
});
