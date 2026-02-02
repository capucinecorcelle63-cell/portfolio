const data = window.PORTFOLIO_DATA;

const previewMap = {
  product: document.getElementById("productPreview"),
  graphic: document.getElementById("graphicPreview"),
  industrial: document.getElementById("industrialPreview"),
  craft: document.getElementById("craftPreview"),
};

const featuredContainer = document.getElementById("featuredWorks");
const projectGallery = document.getElementById("projectGallery");

const createPreviewCard = (item) => {
  const card = document.createElement("div");
  card.className = "preview-card";
  card.innerHTML = `
    <div>
      <h3>${item.title}</h3>
      <p>Archive card preview.</p>
    </div>
    <span>${item.tag}</span>
  `;
  return card;
};

const createGalleryTile = (label) => {
  const tile = document.createElement("div");
  tile.className = "gallery-tile";
  tile.innerHTML = `<span class="visually-hidden">${label}</span>`;
  return tile;
};

Object.entries(previewMap).forEach(([key, container]) => {
  if (!container) return;
  data.previews[key].forEach((item) => {
    container.appendChild(createPreviewCard(item));
  });
});

data.featured.forEach((item) => {
  const card = document.createElement("article");
  card.className = "featured-card";
  card.innerHTML = `
    <div class="featured-header">
      <span class="eyebrow">FEATURED WORK ${item.number}</span>
      <h3>${item.title}</h3>
      <div class="project-meta">${item.year}</div>
    </div>
    <ul>
      ${item.skills.map((skill) => `<li>${skill}</li>`).join("")}
    </ul>
    <p>${item.description}</p>
    <a class="cta" href="#project-detail">VIEW PROJECT -></a>
    <div class="featured-gallery">
      ${data.gallery.map(() => `<div class="gallery-tile"></div>`).join("")}
    </div>
  `;
  featuredContainer.appendChild(card);
});

data.gallery.forEach((label) => {
  projectGallery.appendChild(createGalleryTile(label));
});

const keychain = document.getElementById("keychain");
const keys = Array.from(keychain.querySelectorAll(".key"));

keys.forEach((key) => {
  const baseTransform = window.getComputedStyle(key).transform;
  key.dataset.baseTransform = baseTransform === "none" ? "" : baseTransform;
});

const resetActive = () => {
  keychain.classList.remove("active");
  keys.forEach((key) => key.classList.remove("active"));
};

const setActive = (activeKey) => {
  keychain.classList.add("active");
  keys.forEach((key, index) => {
    const offset = key === activeKey ? 30 : -(index + 1) * 12;
    key.style.transform = `${key.dataset.baseTransform} translateX(${offset}px)`;
    key.classList.toggle("active", key === activeKey);
  });
};

let lastTouchedKey = null;

keys.forEach((key) => {
  key.addEventListener("mouseenter", () => {
    setActive(key);
  });

  key.addEventListener("click", (event) => {
    const target = key.dataset.target;
    if (!target) return;

    if (window.matchMedia("(hover: none)").matches) {
      event.preventDefault();
      if (lastTouchedKey === key) {
        window.location.href = target;
      } else {
        setActive(key);
        lastTouchedKey = key;
      }
    } else {
      window.location.href = target;
    }
  });
});

keychain.addEventListener("mouseleave", () => {
  resetActive();
  keys.forEach((key) => {
    key.style.transform = "";
  });
});
