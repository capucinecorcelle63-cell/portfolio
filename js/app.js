const container = document.getElementById('keychain-container');
const items = document.querySelectorAll('.key-item');

// Effet de mouvement 3D au mouvement de la souris
document.addEventListener('mousemove', (e) => {
    const container = document.getElementById('keychain-container');
    if(!container) return; // Sécurité si l'élément n'est pas chargé

    let x = (e.clientX / window.innerWidth) - 0.5;
    let y = (e.clientY / window.innerHeight) - 0.5;
    
    // On limite la rotation à 15 degrés pour ne pas perdre l'image
    container.style.transform = `rotateX(${-y * 15}deg) rotateY(${x * 15}deg)`;
});

// Animation au survol et lien vers le projet
items.forEach(item => {
    item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        window.location.href = `project.html?id=${id}`;
    });
});

// Bouton Connexion Admin
document.getElementById('loginBtn').onclick = () => {
    const pass = prompt("Mot de passe admin :");
    if(pass === "admin123") {
        localStorage.setItem('isAdmin', 'true');
        window.location.href = 'admin.html';
    }
};
