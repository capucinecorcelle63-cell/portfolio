const overlay = document.getElementById('projectOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const overlayType = document.getElementById('overlayType');
const overlayScrollBtn = document.getElementById('overlayScrollBtn');

const projects = {
    product: {
        title: 'Product Design',
        type: 'Portfolio Section',
        desc: 'A selection of product design projects with a focus on material sensibility, systems, and user experience.'
    },
    graphic: {
        title: 'Graphic Design',
        type: 'Portfolio Section',
        desc: 'Visual narratives, editorial systems, and identity work that balance structure with expressive detail.'
    },
    industrial: {
        title: 'Industrial Design',
        type: 'Portfolio Section',
        desc: 'Concept-to-prototype work exploring form, ergonomics, and manufacturing constraints.'
    },
    craft: {
        title: 'Craft & Design',
        type: 'Portfolio Section',
        desc: 'Hands-on explorations and crafted objects where narrative and materiality meet.'
    },
    about: {
        title: 'About Capucine',
        type: 'Profile',
        desc: 'Background, design approach, and the way I collaborate across disciplines.'
    }
};

const gridContent = {
    product: [
        { title: 'Project Title', meta: 'Material exploration · 2024' },
        { title: 'Project Title', meta: 'User-centered concept · 2023' }
    ],
    graphic: [
        { title: 'Project Title', meta: 'Identity system · 2024' }
    ],
    industrial: [
        { title: 'Project Title', meta: 'Prototype & testing · 2023' }
    ],
    craft: [
        { title: 'Project Title', meta: 'Crafted object · 2022' }
    ]
};

function renderGrid(id, items) {
    const grid = document.getElementById(id);
    if (!grid || !items?.length) return;

    grid.innerHTML = items.map(item => (
        `<article class="card">
            <div class="card-title">${item.title}</div>
            <div class="card-meta">${item.meta}</div>
        </article>`
    )).join('');
}

function scrollToSec(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

function openOverlay(key) {
    const data = projects[key];
    if (!data) {
        scrollToSec(key);
        return;
    }

    overlayType.textContent = data.type;
    overlayTitle.textContent = data.title;
    overlayDesc.textContent = data.desc;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    overlayScrollBtn.onclick = () => {
        closeOverlay();
        setTimeout(() => scrollToSec(key), 150);
    };
}

function closeOverlay() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
}

function handleKeyClick(element, sectionId) {
    element.animate([
        { transform: element.style.transform + ' scale(1)' },
        { transform: element.style.transform + ' scale(1.08) rotate(8deg)' },
        { transform: element.style.transform + ' scale(1)' }
    ], {
        duration: 300,
        easing: 'ease-in-out'
    });

    setTimeout(() => {
        openOverlay(sectionId);
    }, 180);
}

// Parallax léger
const scene = document.querySelector('.scene');
let parallaxTarget = { x: 0, y: 0 };
let parallaxCurrent = { x: 0, y: 0 };

function onMouseMove(e) {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxTarget = { x: x * 12, y: y * 12 };
}

function animateParallax() {
    parallaxCurrent.x += (parallaxTarget.x - parallaxCurrent.x) * 0.08;
    parallaxCurrent.y += (parallaxTarget.y - parallaxCurrent.y) * 0.08;
    scene.style.transform = `translate3d(${parallaxCurrent.x}px, ${parallaxCurrent.y}px, 0)`;
    requestAnimationFrame(animateParallax);
}

// Animation d'intro
function introSwing() {
    const tags = document.querySelectorAll('.key-tag');
    tags.forEach((tag, index) => {
        const delay = index * 140;
        tag.animate([
            { transform: 'translateX(-50%) rotate(0deg)' },
            { transform: 'translateX(-50%) rotate(12deg)' },
            { transform: 'translateX(-50%) rotate(-8deg)' },
            { transform: 'translateX(-50%) rotate(0deg)' }
        ], {
            duration: 1400,
            delay: delay,
            easing: 'ease-in-out'
        });
    });
}

window.addEventListener('DOMContentLoaded', () => {
    introSwing();
    renderGrid('productGrid', gridContent.product);
    renderGrid('graphicGrid', gridContent.graphic);
    renderGrid('industrialGrid', gridContent.industrial);
    renderGrid('craftGrid', gridContent.craft);

    const tags = document.querySelectorAll('.key-tag');
    tags.forEach(tag => {
        const target = tag.dataset.target;
        tag.addEventListener('click', () => handleKeyClick(tag, target));
    });

    document.querySelector('.overlay-close').addEventListener('click', closeOverlay);
    document.querySelector('.overlay-backdrop').addEventListener('click', closeOverlay);

    if (scene) {
        scene.addEventListener('mousemove', onMouseMove);
        animateParallax();
    }
});

function openAdmin() {
    document.getElementById('adminPanel').classList.add('admin-open');
}

function closeAdmin() {
    document.getElementById('adminPanel').classList.remove('admin-open');
}

function checkAdmin() {
    const pass = document.getElementById('adminPass').value;
    if (pass === "NUGGETS4LIFE") {
        document.getElementById('adminTools').style.display = 'block';
        alert("Access Granted. Welcome Capucine.");
    } else {
        alert("Wrong password.");
    }
}
