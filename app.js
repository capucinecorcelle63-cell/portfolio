const STORAGE_KEY = 'capucine_projects_v2';
const CONTENT_PATH = '/content/projects.json';
const IMAGE_DB_NAME = 'capucine_images_v1';
const IMAGE_STORE = 'images';
let imageDbPromise = null;

const BASE_DATA = {
    descriptions: {
        about: 'Product Designer graduate with a strong sensitivity to materials and a strategic approach to projects. I combine rigor, curiosity, and attention to detail, and I enjoy working across disciplines to build clear, crafted solutions.',
        product: 'A selection of projects focused on use, ergonomics, and materiality.',
        industrial: 'Prototyping, volumes, and manufacturing constraints.',
        graphic: 'Visual identities, editorial systems, and graphic compositions.',
        craft: 'Material explorations, gestures, and making.'
    },
    about: {
        label: 'About',
        categories: [
            { id: 'about-projects', title: 'ABOUT PROJECTS', items: [] }
        ]
    },
    craft: {
        label: 'Craft',
        categories: [
            { id: 'craft-projects', title: 'CRAFT PROJECTS', items: [] }
        ]
    },
    product: {
        label: 'Product',
        categories: [
            { id: 'product-projects', title: 'PRODUCT PROJECTS', items: [] }
        ]
    },
    graphic: {
        label: 'Graphic',
        categories: [
            { id: 'graphic-projects', title: 'GRAPHIC PROJECTS', items: [] }
        ]
    },
    industrial: {
        label: 'Industrial',
        categories: [
            { id: 'industrial-projects', title: 'INDUSTRIAL PROJECTS', items: [] }
        ]
    }
};


const adminList = document.getElementById('adminList');
const adminAddBtn = document.getElementById('adminAddBtn');
const adminCancelBtn = document.getElementById('adminCancelBtn');
const adminPageSelect = document.getElementById('adminPage');
const adminGroupSelect = document.getElementById('adminGroup');
const adminTitleInput = document.getElementById('adminTitle');
const adminTagInput = document.getElementById('adminTag') || document.getElementById('adminPill');
const adminYearInput = document.getElementById('adminYear');
const adminRoleInput = document.getElementById('adminRole');
const adminKeywordsInput = document.getElementById('adminKeywords');
const adminShortInput = document.getElementById('adminShort') || document.getElementById('adminDesc');
const adminLongInput = document.getElementById('adminLong');
const adminCoverUrlInput = document.getElementById('adminCoverUrl') || document.getElementById('adminImageUrl');
const adminCoverFileInput = document.getElementById('adminCoverFile') || document.getElementById('adminImageFile');
const adminGalleryUrlsInput = document.getElementById('adminGalleryUrls');
const adminGalleryFilesInput = document.getElementById('adminGalleryFiles');
const adminLinksInput = document.getElementById('adminLinks');
const descAboutInput = document.getElementById('descAbout');
const descProductInput = document.getElementById('descProduct');
const descIndustrialInput = document.getElementById('descIndustrial');
const descGraphicInput = document.getElementById('descGraphic');
const descCraftInput = document.getElementById('descCraft');
const adminSaveDescriptions = document.getElementById('adminSaveDescriptions');

let cachedProjects = null;

let editingProjectId = null;

function cloneBase() {
    return JSON.parse(JSON.stringify(BASE_DATA));
}

function loadProjects() {
    if (cachedProjects) return cachedProjects;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const merged = mergeWithBase(parsed);
            cachedProjects = merged;
            return merged;
        }
    } catch (err) {
        console.warn('Could not parse stored projects', err);
    }

    const base = cloneBase();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    cachedProjects = base;
    return base;
}

function saveProjects(data) {
    cachedProjects = data;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
        console.error('Save failed', err);
        alert('Saving failed (storage limit). Try using smaller images or fewer files.');
    }
}

async function fetchRemoteProjects() {
    try {
        const res = await fetch(CONTENT_PATH, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

async function initProjects() {
    const remote = await fetchRemoteProjects();
    if (remote) {
        const merged = mergeWithBase(remote);
        saveProjects(merged);
    } else {
        loadProjects();
    }
    renderAllCategories();
    renderSectionDescriptions();
}

function mergeWithBase(data) {
    const base = cloneBase();
    const merged = { ...base };
    Object.keys(base).forEach(key => {
        if (data && data[key] && Array.isArray(data[key].categories)) {
            merged[key] = data[key];
        }
    });
    merged.descriptions = {
        ...base.descriptions,
        ...(data && data.descriptions ? data.descriptions : {})
    };
    normalizeDataImages(merged);
    pruneLegacyCraftItems(merged);
    return merged;
}

function pruneLegacyCraftItems(data) {
    if (!data || !data.craft || !Array.isArray(data.craft.categories)) return;
    const removeTitles = new Set([
        'NARRATIVE WEAVING',
        'MODULAR FABRICS',
        'STACKED VESSELS',
        'USEFUL CONTOURS',
        'SENSITIVE NOTEBOOKS',
        'COLOR GROUNDS'
    ]);
    let changed = false;
    data.craft.categories.forEach(category => {
        if (!Array.isArray(category.items)) return;
        const original = category.items.length;
        category.items = category.items.filter(item => {
            const title = String(item.title || '').toUpperCase().trim();
            return !removeTitles.has(title);
        });
        if (category.items.length !== original) changed = true;
    });
    if (changed) saveProjects(data);
}

function normalizeImageEntry(entry) {
    if (!entry) return null;
    if (typeof entry === 'string') {
        return { src: entry, x: 0, y: 0, scale: 1, w: 0, h: 0, ratio: 0, fx: null, fy: null };
    }
    if (entry.src) {
        return {
            src: entry.src,
            x: typeof entry.x === 'number' ? entry.x : 0,
            y: typeof entry.y === 'number' ? entry.y : 0,
            scale: typeof entry.scale === 'number' ? entry.scale : 1,
            w: typeof entry.w === 'number' ? entry.w : 0,
            h: typeof entry.h === 'number' ? entry.h : 0,
            ratio: typeof entry.ratio === 'number' ? entry.ratio : 0,
            fx: typeof entry.fx === 'number' ? entry.fx : null,
            fy: typeof entry.fy === 'number' ? entry.fy : null
        };
    }
    return null;
}

function openImageDb() {
    if (imageDbPromise) return imageDbPromise;
    imageDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(IMAGE_DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(IMAGE_STORE)) {
                db.createObjectStore(IMAGE_STORE);
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    return imageDbPromise;
}

async function storeImageBlob(blob) {
    const db = await openImageDb();
    const id = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        tx.objectStore(IMAGE_STORE).put(blob, id);
        tx.oncomplete = () => resolve(id);
        tx.onerror = () => reject(tx.error);
    });
}

async function getImageBlob(id) {
    const db = await openImageDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readonly');
        const req = tx.objectStore(IMAGE_STORE).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}

async function deleteImageBlob(id) {
    const db = await openImageDb();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        tx.objectStore(IMAGE_STORE).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

function isIdbRef(src) {
    return typeof src === 'string' && src.startsWith('idb:');
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function storeFileOrDataUrl(file) {
    try {
        const id = await storeImageBlob(file);
        return `idb:${id}`;
    } catch (err) {
        console.warn('IndexedDB storage failed, falling back to data URL', err);
        try {
            return await fileToDataURL(file);
        } catch (readErr) {
            console.error('File read failed', readErr);
            return null;
        }
    }
}

async function migrateLegacyDataUrls() {
    const data = loadProjects();
    let changed = false;
    for (const page of Object.values(data)) {
        if (!page || !Array.isArray(page.categories)) continue;
        for (const category of page.categories) {
            if (!Array.isArray(category.items)) continue;
            for (const item of category.items) {
                if (!Array.isArray(item.images)) continue;
                for (const img of item.images) {
                    if (typeof img.src === 'string' && img.src.startsWith('data:')) {
                        try {
                            const blob = await fetch(img.src).then(res => res.blob());
                            const id = await storeImageBlob(blob);
                            img.src = `idb:${id}`;
                            changed = true;
                        } catch (err) {
                            console.warn('Image migration failed', err);
                        }
                    }
                }
            }
        }
    }
    if (changed) {
        saveProjects(data);
        renderAllCategories();
        renderAdminList();
    }
}

function normalizeDataImages(data) {
    Object.values(data).forEach(page => {
        if (!page || !Array.isArray(page.categories)) return;
        page.categories.forEach(category => {
            if (!Array.isArray(category.items)) return;
            category.items.forEach((item, itemIndex) => {
                if (!item.id) {
                    item.id = `${category.id}-${itemIndex}`;
                }
                const legacyImages = Array.isArray(item.images) ? item.images : [];
                const legacySingle = item.image ? [item.image] : [];
                const merged = [...legacyImages, ...legacySingle]
                    .map(normalizeImageEntry)
                    .filter(Boolean);
                item.images = merged;
                if (item.pill && !item.tag) item.tag = item.pill;
                if (item.desc && !item.short) item.short = item.desc;
                item.long = item.long || '';
                item.year = item.year || '';
                item.role = item.role || '';
                item.keywords = Array.isArray(item.keywords) ? item.keywords : [];
                item.links = Array.isArray(item.links) ? item.links : [];
                delete item.image;
                delete item.pill;
                delete item.desc;
            });
        });
    });
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderProjectCard(item) {
    const title = escapeHtml(item.title);
    const tag = escapeHtml(item.tag || '');
    const year = escapeHtml(item.year || '');
    const longDesc = escapeHtml(item.long || '');
    const role = escapeHtml(item.role || '');
    const keywords = Array.isArray(item.keywords) ? item.keywords.map(escapeHtml) : [];
    const links = Array.isArray(item.links) ? item.links : [];
    const images = Array.isArray(item.images) ? item.images : [];
    const gallery = images.length
        ? `<div class="project-gallery">${images.map((img, index) => `
            <div class="project-image-frame"
                data-project-id="${item.id}"
                data-image-index="${index}"
                data-x="${img.x || 0}"
                data-y="${img.y || 0}"
                data-scale="${img.scale || 1}"
                data-w="${img.w || 0}"
                data-h="${img.h || 0}"
                data-ratio="${img.ratio || 0}"
                data-fx="${img.fx ?? ''}"
                data-fy="${img.fy ?? ''}">
                <img ${isIdbRef(img.src) ? `data-src="${escapeHtml(img.src)}" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="` : `src="${escapeHtml(img.src)}"`} alt="${title}">
                <button class="image-move" type="button" aria-label="Move image">Move</button>
                <button class="image-remove" type="button" aria-label="Remove image">Remove</button>
                <div class="image-handle" aria-hidden="true"></div>
            </div>`).join('')}</div>`
        : '';
    const linksMarkup = links.length
        ? `<div class="project-links">${links.map(link => {
            const label = escapeHtml(link.label || link.url || 'Link');
            const url = escapeHtml(link.url || '#');
            return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
        }).join('')}</div>`
        : '';
    return (`<details class="project-card" data-project-id="${item.id}">
        <summary class="project-row">
            <span class="project-title">${title}</span>
            <span class="project-year">${year}</span>
            <span class="project-tag">${tag}</span>
        </summary>
        <div class="project-panel">
            ${longDesc ? `<p class="project-body">${longDesc}</p>` : ''}
            ${linksMarkup}
            ${gallery}
            <button class="project-close" type="button">Close</button>
        </div>
    </details>`);
}

function renderCategoriesForContainer(container, page) {
    if (!container || !page) return;
    const categoriesMarkup = page.categories
        .filter(cat => Array.isArray(cat.items) && cat.items.length)
        .map(cat => {
            const itemsMarkup = cat.items.map(renderProjectCard).join('');
            const content = itemsMarkup || '';
            return (`<section class="project-group" data-category="${escapeHtml(cat.id)}">
                <div class="project-list">${content}</div>
            </section>`);
        })
        .join('');

    container.innerHTML = categoriesMarkup || '';
}

function renderAllCategories() {
    const containers = document.querySelectorAll('.page-categories');
    const data = loadProjects();
    if (containers.length) {
        containers.forEach(container => {
            const pageKey = container.dataset.page;
            const page = data[pageKey];
            if (!page) {
                container.innerHTML = '';
                return;
            }
            renderCategoriesForContainer(container, page);
        });
        attachImageLoadHandlers();
        return;
    }

    const legacyContainer = document.getElementById('pageCategories');
    if (!legacyContainer) return;
    const pageKey = legacyContainer.dataset.page;
    const page = data[pageKey];
    if (!page) return;
    renderCategoriesForContainer(legacyContainer, page);
    attachImageLoadHandlers();
}

function renderSectionDescriptions() {
    const data = loadProjects();
    const desc = data.descriptions || {};
    document.querySelectorAll('[data-section-desc]').forEach(el => {
        const key = el.dataset.sectionDesc;
        if (key && typeof desc[key] === 'string') {
            el.textContent = desc[key];
        }
    });
}

function findProjectById(data, id) {
    for (const [pageKey, page] of Object.entries(data)) {
        if (!page || !Array.isArray(page.categories)) continue;
        for (let i = 0; i < page.categories.length; i++) {
            const category = page.categories[i];
            if (!Array.isArray(category.items)) continue;
            const itemIndex = category.items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                return { pageKey, categoryIndex: i, itemIndex };
            }
        }
    }
    return null;
}

function setAdminButtonState() {
    if (!adminAddBtn || !adminCancelBtn) return;
    if (editingProjectId) {
        adminAddBtn.textContent = 'UPDATE PROJECT';
        adminCancelBtn.style.display = 'block';
    } else {
        adminAddBtn.textContent = 'SAVE PROJECT';
        adminCancelBtn.style.display = 'none';
    }
}

function resetAdminForm() {
    editingProjectId = null;
    if (adminTitleInput) adminTitleInput.value = '';
    if (adminTagInput) adminTagInput.value = '';
    if (adminYearInput) adminYearInput.value = '';
    if (adminRoleInput) adminRoleInput.value = '';
    if (adminKeywordsInput) adminKeywordsInput.value = '';
    if (adminShortInput) adminShortInput.value = '';
    if (adminLongInput) adminLongInput.value = '';
    if (adminCoverUrlInput) adminCoverUrlInput.value = '';
    if (adminCoverFileInput) adminCoverFileInput.value = '';
    if (adminGalleryUrlsInput) adminGalleryUrlsInput.value = '';
    if (adminGalleryFilesInput) adminGalleryFilesInput.value = '';
    if (adminLinksInput) adminLinksInput.value = '';
    setAdminButtonState();
}

function updateGroupOptions(pageKey) {
    if (!adminGroupSelect) return;
    const data = loadProjects();
    const page = data[pageKey];
    if (!page) return;

    adminGroupSelect.innerHTML = page.categories
        .map(cat => `<option value="${cat.id}">${cat.title}</option>`)
        .join('');
}

function renderAdminList() {
    if (!adminList) return;
    const data = loadProjects();
    const items = [];

    Object.entries(data).forEach(([pageKey, page]) => {
        if (!page || !Array.isArray(page.categories)) return;
        page.categories.forEach(category => {
            if (!Array.isArray(category.items)) return;
            category.items.forEach(item => {
                items.push({
                    pageKey,
                    categoryId: category.id,
                    categoryTitle: category.title,
                    item
                });
            });
        });
    });

    if (!items.length) {
        adminList.innerHTML = '<div class="empty-state">No projects yet.</div>';
        return;
    }

    adminList.innerHTML = items.map(entry => {
        return (`<div class="admin-item">
            <div>
                <strong>${escapeHtml(entry.item.title)}</strong><br>
                <span>${escapeHtml(entry.pageKey.toUpperCase())} · ${escapeHtml(entry.categoryTitle)}</span>
            </div>
            <div class="admin-actions">
                <button class="admin-move" data-id="${entry.item.id}" data-dir="up">UP</button>
                <button class="admin-move" data-id="${entry.item.id}" data-dir="down">DOWN</button>
                <button class="admin-edit" data-id="${entry.item.id}">EDIT</button>
                <button class="admin-delete" data-id="${entry.item.id}">DELETE</button>
            </div>
        </div>`);
    }).join('');

    adminList.querySelectorAll('.admin-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const data = loadProjects();
            const found = findProjectById(data, id);
            if (!found) return;
            data[found.pageKey].categories[found.categoryIndex].items.splice(found.itemIndex, 1);
            saveProjects(data);
            renderAdminList();
            renderAllCategories();
        });
    });

    adminList.querySelectorAll('.admin-edit').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const data = loadProjects();
            const found = findProjectById(data, id);
            if (!found) return;
            const item = data[found.pageKey].categories[found.categoryIndex].items[found.itemIndex];
            editingProjectId = id;
            if (adminPageSelect) {
                adminPageSelect.value = found.pageKey;
                updateGroupOptions(found.pageKey);
            }
            if (adminTitleInput) adminTitleInput.value = item.title || '';
            if (adminTagInput) adminTagInput.value = item.tag || '';
            if (adminYearInput) adminYearInput.value = item.year || '';
            if (adminRoleInput) adminRoleInput.value = item.role || '';
            if (adminKeywordsInput) adminKeywordsInput.value = Array.isArray(item.keywords) ? item.keywords.join(', ') : '';
            if (adminLongInput) adminLongInput.value = item.long || '';
            if (adminCoverUrlInput) {
                const cover = item.images && item.images[0] ? item.images[0].src : '';
                adminCoverUrlInput.value = cover && cover.startsWith('http') ? cover : '';
            }
            if (adminGalleryUrlsInput) {
                const gallery = Array.isArray(item.images) ? item.images.slice(1) : [];
                const galleryUrls = gallery
                    .map(image => image.src)
                    .filter(url => url && url.startsWith('http'));
                adminGalleryUrlsInput.value = galleryUrls.join('\n');
            }
            if (adminLinksInput) {
                const links = Array.isArray(item.links) ? item.links : [];
                adminLinksInput.value = links.map(link => `${link.label || ''}${link.label ? ' | ' : ''}${link.url || ''}`).join('\n');
            }
            if (adminCoverFileInput) adminCoverFileInput.value = '';
            if (adminGalleryFilesInput) adminGalleryFilesInput.value = '';
            setAdminButtonState();
        });
    });

    adminList.querySelectorAll('.admin-move').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const dir = btn.dataset.dir;
            const data = loadProjects();
            const found = findProjectById(data, id);
            if (!found) return;
            const itemsRef = data[found.pageKey].categories[found.categoryIndex].items;
            const newIndex = dir === 'up' ? found.itemIndex - 1 : found.itemIndex + 1;
            if (newIndex < 0 || newIndex >= itemsRef.length) return;
            const [moved] = itemsRef.splice(found.itemIndex, 1);
            itemsRef.splice(newIndex, 0, moved);
            saveProjects(data);
            renderAdminList();
            renderAllCategories();
        });
    });
}

function parseImageUrls(raw) {
    return raw
        .split(/[\n,]+/)
        .map(val => val.trim())
        .filter(Boolean);
}

function parseKeywords(raw) {
    return raw
        .split(',')
        .map(val => val.trim())
        .filter(Boolean);
}

function parseLinks(raw) {
    return raw
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const parts = line.split('|').map(part => part.trim()).filter(Boolean);
            if (parts.length === 1) {
                return { label: parts[0], url: parts[0] };
            }
            return { label: parts[0], url: parts.slice(1).join(' | ') };
        });
}

function commitProjectSave(uploadedImages) {
    if (!adminPageSelect || !adminTitleInput) return;

    const title = adminTitleInput.value.trim();
    const tag = adminTagInput ? adminTagInput.value.trim() : '';
    const year = adminYearInput ? adminYearInput.value.trim() : '';
    const role = adminRoleInput ? adminRoleInput.value.trim() : '';
    const keywords = adminKeywordsInput ? parseKeywords(adminKeywordsInput.value) : [];
    const shortDesc = adminShortInput ? adminShortInput.value.trim() : '';
    const longDesc = adminLongInput ? adminLongInput.value.trim() : '';
    const coverUrl = adminCoverUrlInput ? adminCoverUrlInput.value.trim() : '';
    const galleryUrls = adminGalleryUrlsInput ? adminGalleryUrlsInput.value.trim() : '';
    const links = adminLinksInput ? parseLinks(adminLinksInput.value) : [];
    const pageKey = adminPageSelect.value;
    let groupId = adminGroupSelect ? adminGroupSelect.value : '';

    if (!title) {
        alert('Please add a project title.');
        return;
    }

    const data = loadProjects();
    const coverList = coverUrl ? [coverUrl] : [];
    const galleryList = galleryUrls ? parseImageUrls(galleryUrls) : [];
    const fileImages = uploadedImages || [];
    const allImages = [...coverList, ...galleryList, ...fileImages];
    const imageObjects = allImages.map(src => normalizeImageEntry(src)).filter(Boolean);
    const hasNewImages = coverList.length || galleryList.length || fileImages.length;

    let savedId = null;
    if (editingProjectId) {
        const found = findProjectById(data, editingProjectId);
        if (found) {
            const item = data[found.pageKey].categories[found.categoryIndex].items[found.itemIndex];
            item.title = title;
            item.tag = tag;
            item.year = year;
            item.role = role;
            item.keywords = keywords;
            item.short = shortDesc;
            item.long = longDesc;
            item.links = links;
            if (hasNewImages) {
                item.images = imageObjects;
            }
            savedId = item.id;

            if (!groupId && data[pageKey]?.categories?.length) {
                groupId = data[pageKey].categories[0].id;
            }
            if (found.pageKey !== pageKey || data[found.pageKey].categories[found.categoryIndex].id !== groupId) {
                data[found.pageKey].categories[found.categoryIndex].items.splice(found.itemIndex, 1);
                const targetCategory = data[pageKey].categories.find(cat => cat.id === groupId);
                if (targetCategory) targetCategory.items.push(item);
            }
        }
    } else {
        if (!groupId && data[pageKey]?.categories?.length) {
            groupId = data[pageKey].categories[0].id;
        }
        const newId = `p_${Date.now()}`;
        const newItem = {
            id: newId,
            title,
            tag,
            year,
            role,
            keywords,
            short: shortDesc,
            long: longDesc,
            links,
            images: imageObjects
        };
        const targetCategory = data[pageKey].categories.find(cat => cat.id === groupId);
        if (targetCategory) {
            targetCategory.items.push(newItem);
        }
        savedId = newId;
    }

    saveProjects(data);
    resetAdminForm();
    renderAdminList();
    renderAllCategories();
    return savedId;
}

function handleSaveProject() {
    const coverFile = adminCoverFileInput && adminCoverFileInput.files[0] ? adminCoverFileInput.files[0] : null;
    const galleryFiles = adminGalleryFilesInput ? Array.from(adminGalleryFilesInput.files || []) : [];
    const fileList = [];
    if (coverFile) fileList.push(coverFile);
    fileList.push(...galleryFiles);

    if (fileList.length) {
        Promise.all(fileList.map(file => storeFileOrDataUrl(file)))
            .then(results => openSavedCard(commitProjectSave(results.filter(Boolean))))
            .catch(() => openSavedCard(commitProjectSave([])));
        return;
    }

    openSavedCard(commitProjectSave([]));
}

function openSavedCard(projectId) {
    if (!projectId) return;
    const card = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
    if (card) {
        card.setAttribute('open', '');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestAnimationFrame(() => {
            const gallery = card.querySelector('.project-gallery');
            if (gallery) layoutGalleryFrames(gallery);
        });
    }
}

function getPageFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return null;
    const data = loadProjects();
    return data[hash] ? hash : null;
}

function initAdmin() {
    if (!adminPageSelect) return;
    const currentPage = getPageFromHash();
    if (currentPage) adminPageSelect.value = currentPage;

    updateGroupOptions(adminPageSelect.value);
    setAdminButtonState();

    adminPageSelect.addEventListener('change', () => {
        updateGroupOptions(adminPageSelect.value);
    });

    if (adminAddBtn) adminAddBtn.addEventListener('click', handleSaveProject);
    if (adminCancelBtn) adminCancelBtn.addEventListener('click', resetAdminForm);
    if (adminSaveDescriptions) {
        adminSaveDescriptions.addEventListener('click', () => {
            const data = loadProjects();
            data.descriptions = {
                about: descAboutInput ? descAboutInput.value.trim() : '',
                product: descProductInput ? descProductInput.value.trim() : '',
                industrial: descIndustrialInput ? descIndustrialInput.value.trim() : '',
                graphic: descGraphicInput ? descGraphicInput.value.trim() : '',
                craft: descCraftInput ? descCraftInput.value.trim() : ''
            };
            saveProjects(data);
            renderSectionDescriptions();
        });
    }

    renderAdminList();
}

window.addEventListener('DOMContentLoaded', () => {
    initProjects().then(() => {
        initAdmin();
        migrateLegacyDataUrls();
    });

    const backArrow = document.querySelector('.back-arrow');
    if (backArrow) {
        backArrow.addEventListener('click', (event) => {
            const openCard = document.querySelector('.project-card[open]');
            if (openCard) {
                event.preventDefault();
                openCard.removeAttribute('open');
            }
        });
    }

    initImageEditing();
    initNavCloseHandlers();
});

function openAdmin() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.add('admin-open');
    if (adminPageSelect) updateGroupOptions(adminPageSelect.value);
}

function closeAdmin() {
    const panel = document.getElementById('adminPanel');
    if (panel) panel.classList.remove('admin-open');
}

function closeOpenProject() {
    const openCard = document.querySelector('.project-card[open]');
    if (openCard) openCard.removeAttribute('open');
}

function initNavCloseHandlers() {
    document.querySelectorAll('.nav-strip a').forEach(link => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href') || '';
            if (href.startsWith('mailto:')) {
                closeOpenProject();
                return;
            }
            const targetId = href.startsWith('#') ? href : '';
            if (targetId) {
                event.preventDefault();
                closeOpenProject();
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    window.location.hash = targetId;
                }
            } else {
                closeOpenProject();
            }
        });
    });
}

function checkAdmin() {
    const pass = document.getElementById('adminPass');
    const tools = document.getElementById('adminTools');
    if (!pass || !tools) return;
    if (pass.value === 'NUGGETS4LIFE') {
        tools.style.display = 'block';
        document.body.classList.add('is-admin');
        alert('Access Granted. Welcome Capucine.');
        const data = loadProjects();
        if (descAboutInput) descAboutInput.value = data.descriptions?.about || '';
        if (descProductInput) descProductInput.value = data.descriptions?.product || '';
        if (descIndustrialInput) descIndustrialInput.value = data.descriptions?.industrial || '';
        if (descGraphicInput) descGraphicInput.value = data.descriptions?.graphic || '';
        if (descCraftInput) descCraftInput.value = data.descriptions?.craft || '';
    } else {
        alert('Wrong password.');
    }
}

let activeFrame = null;
let dragStartX = 0;
let dragStartY = 0;
let frameStartX = 0;
let frameStartY = 0;
let resizingFrame = null;
let resizeStartX = 0;
let resizeStartW = 0;
let movingFrame = null;
let moveStartX = 0;
let moveStartY = 0;
let frameStartFx = 0;
let frameStartFy = 0;

function setFrameTransform(frame, x, y, scale) {
    const clamped = clampOffsets(frame, x, y, scale);
    frame.style.setProperty('--x', `${clamped.x}px`);
    frame.style.setProperty('--y', `${clamped.y}px`);
    frame.style.setProperty('--scale', clamped.scale);
    frame.dataset.x = clamped.x;
    frame.dataset.y = clamped.y;
    frame.dataset.scale = clamped.scale;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function persistFrameTransform(frame) {
    const projectId = frame.dataset.projectId;
    const index = Number(frame.dataset.imageIndex);
    if (!projectId || Number.isNaN(index)) return;
    const data = loadProjects();
    const found = findProjectById(data, projectId);
    if (!found) return;
    const item = data[found.pageKey].categories[found.categoryIndex].items[found.itemIndex];
    if (!item.images || !item.images[index]) return;
    item.images[index].x = Number(frame.dataset.x) || 0;
    item.images[index].y = Number(frame.dataset.y) || 0;
    item.images[index].scale = Number(frame.dataset.scale) || 1;
    item.images[index].w = Number(frame.dataset.w) || 0;
    item.images[index].h = Number(frame.dataset.h) || 0;
    item.images[index].ratio = Number(frame.dataset.ratio) || 0;
    item.images[index].fx = frame.dataset.fx === '' ? null : Number(frame.dataset.fx) || 0;
    item.images[index].fy = frame.dataset.fy === '' ? null : Number(frame.dataset.fy) || 0;
    saveProjects(data);
}

function setFramePosition(frame, fx, fy) {
    const gallery = frame.closest('.project-gallery');
    let maxX = null;
    if (gallery && gallery.clientWidth) {
        maxX = Math.max(gallery.clientWidth - frame.clientWidth, 0);
    }
    const nextX = maxX === null ? fx : clamp(fx, 0, maxX);
    const nextY = Math.max(0, fy);
    frame.style.setProperty('--fx', `${nextX}px`);
    frame.style.setProperty('--fy', `${nextY}px`);
    frame.dataset.fx = nextX;
    frame.dataset.fy = nextY;
    if (gallery) updateGalleryBounds(gallery);
}

function updateGalleryBounds(gallery) {
    const frames = Array.from(gallery.querySelectorAll('.project-image-frame'));
    if (!frames.length) return;
    let maxBottom = 0;
    frames.forEach(frame => {
        const fy = Number(frame.dataset.fy) || 0;
        const height = frame.clientHeight || Number(frame.dataset.h) || 0;
        const bottom = fy + height;
        if (bottom > maxBottom) maxBottom = bottom;
    });
    const minHeight = 240;
    gallery.style.height = `${Math.max(maxBottom, minHeight)}px`;
}

function layoutGalleryFrames(gallery) {
    if (!gallery) return;
    const frames = Array.from(gallery.querySelectorAll('.project-image-frame'));
    if (!frames.length) return;
    let maxBottom = 0;
    frames.forEach(frame => {
        if (frame.dataset.fx !== '' || frame.dataset.fy !== '') {
            const fx = Number(frame.dataset.fx) || 0;
            const fy = Number(frame.dataset.fy) || 0;
            setFramePosition(frame, fx, fy);
            const height = frame.clientHeight || Number(frame.dataset.h) || 0;
            const bottom = fy + height;
            if (bottom > maxBottom) maxBottom = bottom;
        }
    });
    let cursorY = maxBottom ? maxBottom + 16 : 0;
    frames.forEach(frame => {
        if (frame.dataset.fx === '' && frame.dataset.fy === '') {
            setFramePosition(frame, 0, cursorY);
            persistFrameTransform(frame);
            const height = frame.clientHeight || Number(frame.dataset.h) || 0;
            cursorY += height + 16;
        }
    });
    updateGalleryBounds(gallery);
}

function ensureCoverScale(frame) {
    const img = frame.querySelector('img');
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const frameRect = frame.getBoundingClientRect();
    if (!frameRect.width || !frameRect.height) return;
    const scaleX = frameRect.width / img.naturalWidth;
    const scaleY = frameRect.height / img.naturalHeight;
    const minScale = Math.max(scaleX, scaleY);
    const currentScale = Number(frame.dataset.scale) || 1;
    frame.dataset.minScale = minScale;
    if (currentScale < minScale) {
        setFrameTransform(frame, Number(frame.dataset.x) || 0, Number(frame.dataset.y) || 0, minScale);
        persistFrameTransform(frame);
    }
}

function initImageEditing() {
    document.addEventListener('pointerdown', (event) => {
        if (!document.body.classList.contains('is-admin')) return;
        const handle = event.target.closest('.image-handle');
        if (handle) {
            resizingFrame = handle.closest('.project-image-frame');
            if (!resizingFrame) return;
            resizeStartX = event.clientX;
            resizeStartW = Number(resizingFrame.dataset.w) || resizingFrame.clientWidth;
            resizingFrame.setPointerCapture(event.pointerId);
            event.preventDefault();
            return;
        }
        const moveHandle = event.target.closest('.image-move');
        if (moveHandle) {
            movingFrame = moveHandle.closest('.project-image-frame');
            if (!movingFrame) return;
            moveStartX = event.clientX;
            moveStartY = event.clientY;
            frameStartFx = Number(movingFrame.dataset.fx) || 0;
            frameStartFy = Number(movingFrame.dataset.fy) || 0;
            movingFrame.setPointerCapture(event.pointerId);
            event.preventDefault();
            return;
        }
        const removeBtn = event.target.closest('.image-remove');
        if (removeBtn) return;
        const frame = event.target.closest('.project-image-frame');
        if (!frame) return;
        activeFrame = frame;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        frameStartX = Number(frame.dataset.x) || 0;
        frameStartY = Number(frame.dataset.y) || 0;
        frame.setPointerCapture(event.pointerId);
    });

    document.addEventListener('pointermove', (event) => {
        if (resizingFrame) {
            const ratio = Number(resizingFrame.dataset.ratio) || 1;
            const gallery = resizingFrame.closest('.project-gallery');
            const maxWidth = gallery && gallery.clientWidth ? gallery.clientWidth : 720;
            let nextWidth = clamp(resizeStartW + (event.clientX - resizeStartX), 180, maxWidth);
            let nextHeight = ratio ? nextWidth / ratio : resizingFrame.clientHeight;
            const maxHeight = 360;
            if (nextHeight > maxHeight) {
                nextHeight = maxHeight;
                nextWidth = ratio ? nextHeight * ratio : nextWidth;
            }
            resizingFrame.style.width = `${nextWidth}px`;
            resizingFrame.style.height = `${nextHeight}px`;
            resizingFrame.dataset.w = nextWidth;
            resizingFrame.dataset.h = nextHeight;
            ensureCoverScale(resizingFrame);
            return;
        }
        if (movingFrame) {
            const dx = event.clientX - moveStartX;
            const dy = event.clientY - moveStartY;
            setFramePosition(movingFrame, frameStartFx + dx, frameStartFy + dy);
            return;
        }
        if (!activeFrame) return;
        const dx = event.clientX - dragStartX;
        const dy = event.clientY - dragStartY;
        setFrameTransform(activeFrame, frameStartX + dx, frameStartY + dy, Number(activeFrame.dataset.scale) || 1);
    });

    document.addEventListener('pointerup', (event) => {
        if (resizingFrame) {
            persistFrameTransform(resizingFrame);
            resizingFrame = null;
            return;
        }
        if (movingFrame) {
            persistFrameTransform(movingFrame);
            movingFrame = null;
            return;
        }
        if (!activeFrame) return;
        persistFrameTransform(activeFrame);
        activeFrame = null;
    });

    document.addEventListener('wheel', (event) => {
        if (!document.body.classList.contains('is-admin')) return;
        const frame = event.target.closest('.project-image-frame');
        if (!frame) return;
        event.preventDefault();
        const currentScale = Number(frame.dataset.scale) || 1;
        const minScale = Number(frame.dataset.minScale) || 1;
        const nextScale = clamp(currentScale + (event.deltaY * -0.001), minScale, 4);
        setFrameTransform(frame, Number(frame.dataset.x) || 0, Number(frame.dataset.y) || 0, nextScale);
        persistFrameTransform(frame);
    }, { passive: false });

    document.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('.image-remove');
        if (!removeBtn || !document.body.classList.contains('is-admin')) return;
        const frame = removeBtn.closest('.project-image-frame');
        if (!frame) return;
        const projectId = frame.dataset.projectId;
        const index = Number(frame.dataset.imageIndex);
        const data = loadProjects();
        const found = findProjectById(data, projectId);
        if (!found || Number.isNaN(index)) return;
        const item = data[found.pageKey].categories[found.categoryIndex].items[found.itemIndex];
        if (item.images && item.images[index]) {
            const src = item.images[index].src;
            if (isIdbRef(src)) {
                deleteImageBlob(src.replace('idb:', '')).catch(() => {});
            }
            item.images.splice(index, 1);
            saveProjects(data);
            renderAllCategories();
            renderAdminList();
        }
    });

    document.addEventListener('click', (event) => {
        const closeBtn = event.target.closest('.project-close');
        if (!closeBtn) return;
        const details = closeBtn.closest('details');
        if (details) {
            details.removeAttribute('open');
        }
    });

    attachImageLoadHandlers();
}

function attachImageLoadHandlers() {
    hydrateImageSources();
    document.querySelectorAll('.project-image-frame img').forEach(img => {
        if (img.dataset.bound === 'true') return;
        img.dataset.bound = 'true';
        if (img.complete) {
            const frame = img.closest('.project-image-frame');
            if (frame) ensureFrameSize(frame);
        } else {
            img.addEventListener('load', () => {
                const frame = img.closest('.project-image-frame');
                if (frame) ensureFrameSize(frame);
            });
        }
    });
}

function hydrateImageSources() {
    document.querySelectorAll('img[data-src^="idb:"]').forEach(img => {
        if (img.dataset.hydrated === 'true') return;
        const ref = img.dataset.src;
        const id = ref.replace('idb:', '');
        img.dataset.hydrated = 'true';
        getImageBlob(id)
            .then(blob => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                img.src = url;
                img.dataset.blobUrl = url;
            })
            .catch(() => {});
    });
}

function clampOffsets(frame, x, y, scale) {
    const img = frame.querySelector('img');
    if (!img || !img.naturalWidth || !img.naturalHeight) {
        return { x, y, scale };
    }
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const scaledWidth = img.naturalWidth * scale;
    const scaledHeight = img.naturalHeight * scale;
    const maxX = Math.max(0, (scaledWidth - frameWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - frameHeight) / 2);
    return {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY),
        scale
    };
}

function ensureFrameSize(frame) {
    const img = frame.querySelector('img');
    if (!img || !img.naturalWidth || !img.naturalHeight) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    const gallery = frame.closest('.project-gallery');
    const maxWidth = gallery && gallery.clientWidth ? gallery.clientWidth : 720;
    const maxHeight = 360;
    const storedW = Number(frame.dataset.w) || 0;
    const storedH = Number(frame.dataset.h) || 0;
    let width = storedW;
    let height = storedH;
    if (!storedW || !storedH) {
        const scale = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight, 1);
        width = Math.round(img.naturalWidth * scale);
        height = Math.round(img.naturalHeight * scale);
    }
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    frame.dataset.w = width;
    frame.dataset.h = height;
    frame.dataset.ratio = ratio;
    const currentScale = Number(frame.dataset.scale) || 1;
    if (!storedW && !storedH) {
        const fitScale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
        frame.dataset.scale = fitScale;
        frame.style.setProperty('--scale', fitScale);
    } else {
        frame.dataset.scale = currentScale;
        frame.style.setProperty('--scale', currentScale);
    }
    ensureCoverScale(frame);
    setFrameTransform(
        frame,
        Number(frame.dataset.x) || 0,
        Number(frame.dataset.y) || 0,
        Number(frame.dataset.scale) || 1
    );
    if (frame.dataset.fx === '' && frame.dataset.fy === '') {
        const galleryRef = frame.closest('.project-gallery');
        if (galleryRef) {
            layoutGalleryFrames(galleryRef);
        }
    } else {
        setFramePosition(frame, Number(frame.dataset.fx) || 0, Number(frame.dataset.fy) || 0);
    }
    persistFrameTransform(frame);
}
