// 1. Tes Données
const projects = [
    { id: 1, title: "Projet Un", img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle1.png" },
    { id: 2, title: "Projet Deux", img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle2.png" },
    { id: 3, title: "Projet Trois", img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle3.png" },
    { id: 4, title: "Projet Quatre", img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle4.png" },
    { id: 5, title: "Projet Cinq", img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle5.png" }
];

const wrapper = document.getElementById('keychain');

// 2. Injection des clés
projects.forEach(proj => {
    const layer = document.createElement('div');
    layer.className = 'key-layer key-item';
    layer.setAttribute('data-id', proj.id);
    
    layer.innerHTML = `
        <div class="hitbox"></div>
        <div class="visual">
            <img src="${proj.img}" alt="${proj.title}">
        </div>
    `;
    wrapper.appendChild(layer);
});

// 3. Logique de mouvement
const layers = document.querySelectorAll('.key-item');

layers.forEach((layer) => {
    const hitbox = layer.querySelector('.hitbox');
    const currentId = parseInt(layer.getAttribute('data-id'));

    hitbox.addEventListener('mouseenter', () => {
        layers.forEach((l) => {
            const lId = parseInt(l.getAttribute('data-id'));
            const diff = lId - currentId;

            l.classList.remove('is-active');

            if (diff < 0) {
                l.style.transform = `rotate(${diff * 12 - 25}deg)`;
            } else if (diff > 0) {
                l.style.transform = `rotate(${diff * 12 + 25}deg)`;
            } else {
                l.classList.add('is-active');
                l.style.transform = `rotate(0deg)`;
            }
        });
    });
});

// Reset au départ de la souris
wrapper.addEventListener('mouseleave', () => {
    layers.forEach(l => {
        l.style.transform = `rotate(0deg)`;
        l.classList.remove('is-active');
    });
});

// 4. Initialisation Lenis
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
