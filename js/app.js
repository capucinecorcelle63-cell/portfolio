const projects = [
    { id: 1, img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle1.png" },
    { id: 2, img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle2.png" },
    { id: 3, img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle3.png" },
    { id: 4, img: "https://raw.githubusercontent.com/Arshakir/Porte-cles/main/cle4.png" }
];

const container = document.getElementById('keychain');
const grid = document.getElementById('grid');

// Création des éléments
projects.forEach(p => {
    const layer = document.createElement('div');
    layer.className = 'key-layer key-item';
    layer.setAttribute('data-id', p.id);
    layer.innerHTML = `
        <div class="hitbox"></div>
        <div class="visual"><img src="${p.img}" onerror="this.src='https://via.placeholder.com/200x400?text=Image+Manquante'"></div>
    `;
    container.appendChild(layer);

    const box = document.createElement('div');
    box.className = 'project-box';
    grid.appendChild(box);
});

const layers = document.querySelectorAll('.key-item');

// Animation
layers.forEach(item => {
    const hitbox = item.querySelector('.hitbox');
    const id = parseInt(item.getAttribute('data-id'));

    hitbox.addEventListener('mouseenter', () => {
        layers.forEach(l => {
            const lId = parseInt(l.getAttribute('data-id'));
            const diff = lId - id;
            l.classList.remove('is-active');

            if (diff < 0) l.style.transform = `rotate(${diff * 15 - 20}deg)`;
            else if (diff > 0) l.style.transform = `rotate(${diff * 15 + 20}deg)`;
            else {
                l.classList.add('is-active');
                l.style.transform = `rotate(0deg)`;
            }
        });
    });
});

document.getElementById('keychain').addEventListener('mouseleave', () => {
    layers.forEach(l => {
        l.style.transform = `rotate(0deg)`;
        l.classList.remove('is-active');
    });
});

// Scroll fluide
const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
