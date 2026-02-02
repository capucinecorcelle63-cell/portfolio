document.addEventListener("DOMContentLoaded", () => {
    const data = window.PORTFOLIO_DATA;

    // 1. Remplissage des Previews par Catégorie
    const categories = ['product', 'graphic', 'industrial', 'craft'];
    categories.forEach(cat => {
        const container = document.getElementById(`${cat}Preview`);
        if (container && data.previews[cat]) {
            data.previews[cat].forEach(item => {
                const card = document.createElement("div");
                card.className = "preview-card";
                card.innerHTML = `
                    <span>${item.tag}</span>
                    <h3>${item.title}</h3>
                `;
                container.appendChild(card);
            });
        }
    });

    // 2. Remplissage Featured Works
    const featuredList = document.getElementById("featuredWorks");
    if (featuredList) {
        data.featured.forEach(work => {
            const article = document.createElement("article");
            article.className = "featured-card";
            article.innerHTML = `
                <p class="eyebrow">WORK ${work.number}</p>
                <h3>${work.title} (${work.year})</h3>
                <p>${work.description}</p>
                <a href="#" style="color:var(--accent); font-family:var(--mono); font-size:0.8rem;">VIEW PROJECT -></a>
            `;
            featuredList.appendChild(article);
        });
    }

    // 3. Logique du Porte-clés
    const keys = document.querySelectorAll(".key");
    keys.forEach(key => {
        key.addEventListener("click", () => {
            const targetId = key.getAttribute("data-target");
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
