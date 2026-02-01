const projects = [
    { id: 1, img: "assets/key1.png" },
    { id: 2, img: "assets/key2.png" },
    { id: 3, img: "assets/key3.png" },
    { id: 4, img: "assets/key4.png" },
    { id: 5, img: "assets/key5.png" }
];

const container = document.getElementById('keychain');

// Création dynamique des éléments
projects.forEach(p => {
    const layer = document.createElement('div');
    layer.className = 'key-layer key-item';
    layer.setAttribute('data-id', p.id);
    layer.innerHTML = `
        <div class="hitbox"></div>
        <div class="visual"><img src="${p.img}" alt="Key ${p.id}"></div>
    `;
    container.appendChild(layer);
});

const layers = document.querySelectorAll('.key-item');

layers.forEach(item => {
    const hitbox = item.querySelector('.hitbox');
    const id = parseInt(item.getAttribute('data-id'));

    hitbox.addEventListener('mouseenter', () => {
        layers.forEach(l => {
            const lId = parseInt(l.getAttribute('data-id'));
            const diff = lId - id;
            l.classList.remove('is-active');

            if (diff < 0) l.style.transform = `rotate(${diff * 12 - 25}deg)`;
            else if (diff > 0) l.style.transform = `rotate(${diff * 12 + 25}deg)`;
            else {
                l.classList.add('is-active');
                l.style.transform = `rotate(0deg)`;
            }
        });
    });
});

container.addEventListener('mouseleave', () => {
    layers.forEach(l => {
        l.style.transform = `rotate(0deg)`;
        l.classList.remove('is-active');
    });
});
