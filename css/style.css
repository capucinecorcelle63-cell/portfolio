const overlay = document.getElementById('projectOverlay');
const overlayTitle = document.getElementById('overlayTitle');
const overlayDesc = document.getElementById('overlayDesc');
const overlayType = document.getElementById('overlayType');
const overlayScrollBtn = document.getElementById('overlayScrollBtn');

const adminList = document.getElementById('adminList');
const adminAddBtn = document.getElementById('adminAddBtn');

const STORAGE_KEY = 'capucine_projects_v1';

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
        { id: 'p1', title: 'Project Title', meta: 'Material exploration · 2024', image: '' },
        { id: 'p2', title: 'Project Title', meta: 'User-centered concept · 2023', image: '' }
    ],
    graphic: [
        { id: 'g1', title: 'Project Title', meta: 'Identity system · 2024', image: '' }
    ],
    industrial: [
        { id: 'i1', title: 'Project Title', meta: 'Prototype & testing · 2023', image: '' }
    ],
    craft: [
        { id: 'c1', title: 'Project Title', meta: 'Crafted object · 2022', image: '' }
    ]
};

function loadUserProjects() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (err) {
        console.warn('Could not load projects', err);
        return [];
    }
}

function saveUserProjects(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderGrid(id, items) {
    const grid = document.getElementById(id);
    if (!grid) return;

    grid.innerHTML = items.map(item => {
        const imageMarkup = item.image
            ? `<div class="card-image"><img src="${item.image}" alt="${item.title}"></div>`
            : `<div class="card-image"></div>`;

        return (`<article class="card">
            ${imageMarkup}
            <div>
                <div class="card-title">${item.title}</div>
                <div class="card-meta">${item.meta || ''}</div>
            </div>
        </article>`);
    }).join('');
}

function renderAllGrids() {
    const userProjects = loadUserProjects();

    Object.keys(gridContent).forEach(section => {
        const combined = [...gridContent[section], ...userProjects.filter(p => p.category === section)];
        renderGrid(section + 'Grid', combined);
    });
}

function addProjectToList(project) {
    const item = document.createElement('div');
    item.className = 'admin-item';
    item.innerHTML = `<div>
        <strong>${project.title}</strong><br>
        <span>${project.category}</span>
    </div>`;

    const del = document.createElement('button');
    del.className = 'admin-delete';
    del.textContent = 'DELETE';
    del.addEventListener('click', () => {
        const list = loadUserProjects().filter(p => p.id !== project.id);
        saveUserProjects(list);
        renderAdminList();
        renderAllGrids();
    });

    item.appendChild(del);
    adminList.appendChild(item);
}

function renderAdminList() {
    adminList.innerHTML = '';
    const list = loadUserProjects();
    list.forEach(addProjectToList);
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
    const baseTransform = getComputedStyle(element).transform;
    element.animate([
        { transform: baseTransform },
        { transform: baseTransform + ' scale(1.03)' },
        { transform: baseTransform }
    ], {
        duration: 260,
        easing: 'ease-in-out'
    });

    setTimeout(() => {
        openOverlay(sectionId);
    }, 180);
}

function getAdminFormData() {
    return {
        category: document.getElementById('adminCategory').value,
        title: document.getElementById('adminTitle').value.trim(),
        desc: document.getElementById('adminDesc').value.trim(),
        imageUrl: document.getElementById('adminImage').value.trim(),
        file: document.getElementById('adminFile').files[0]
    };
}

function resetAdminForm() {
    document.getElementById('adminTitle').value = '';
    document.getElementById('adminDesc').value = '';
    document.getElementById('adminImage').value = '';
    document.getElementById('adminFile').value = '';
}

function buildProjectPayload(formData, imageDataUrl) {
    return {
        id: `u_${Date.now()}`,
        category: formData.category,
        title: formData.title || 'Untitled Project',
        meta: formData.desc || '',
        image: imageDataUrl || formData.imageUrl || ''
    };
}

function handleAddProject() {
    const formData = getAdminFormData();
    if (!formData.title && !formData.desc && !formData.imageUrl && !formData.file) {
        alert('Please add at least a title, description, or image.');
        return;
    }

    if (formData.file) {
        const reader = new FileReader();
        reader.onload = () => {
            const project = buildProjectPayload(formData, reader.result);
            const list = loadUserProjects();
            list.push(project);
            saveUserProjects(list);
            renderAdminList();
            renderAllGrids();
            resetAdminForm();
        };
        reader.readAsDataURL(formData.file);
        return;
    }

    const project = buildProjectPayload(formData, '');
    const list = loadUserProjects();
    list.push(project);
    saveUserProjects(list);
    renderAdminList();
    renderAllGrids();
    resetAdminForm();
}

// Parallax léger + swing des clés
const scene = document.querySelector('.scene');
const keyTags = Array.from(document.querySelectorAll('.key-tag'));
let parallaxTarget = { x: 0, y: 0 };
let parallaxCurrent = { x: 0, y: 0 };

function onMouseMove(e) {
    const rect = scene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    parallaxTarget = { x: x * 8, y: y * 8 };

    keyTags.forEach((key, index) => {
        const factor = 1 + (index - 2) * 0.08;
        const swing = x * 10 * factor;
        key.style.setProperty('--swing', `${swing}deg`);
    });
}

function resetSwing() {
    keyTags.forEach(key => key.style.setProperty('--swing', '0deg'));
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
        tag.style.animationDelay = `${index * 140}ms`;
        tag.classList.add('intro-swing');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    introSwing();
    renderAllGrids();
    renderAdminList();

    const tags = document.querySelectorAll('.key-tag');
    tags.forEach(tag => {
        const target = tag.dataset.target;
        tag.addEventListener('click', () => handleKeyClick(tag, target));
    });

    document.querySelector('.overlay-close').addEventListener('click', closeOverlay);
    document.querySelector('.overlay-backdrop').addEventListener('click', closeOverlay);

    if (scene) {
        scene.addEventListener('mousemove', onMouseMove);
        scene.addEventListener('mouseleave', resetSwing);
        animateParallax();
    }

    if (adminAddBtn) {
        adminAddBtn.addEventListener('click', handleAddProject);
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
