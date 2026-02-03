// Scroller vers une section
function scrollToSec(id) {
    const target = document.getElementById(id);
    if(target) target.scrollIntoView({ behavior: 'smooth' });
}

// Animation au clic
function handleKeyClick(element, sectionId) {
    element.animate([
        { transform: element.style.transform + ' scale(1)' },
        { transform: element.style.transform + ' scale(1.1) rotate(5deg)' },
        { transform: element.style.transform + ' scale(1)' }
    ], { duration: 300, easing: 'ease-in-out' });

    setTimeout(() => scrollToSec(sectionId), 250);
}

// Remplissage automatique des grilles avec data.js
window.addEventListener('DOMContentLoaded', () => {
    const data = window.PORTFOLIO_DATA;
    
    // Pour chaque catégorie (product, graphic, etc.)
    Object.keys(data.previews).forEach(cat => {
        const grid = document.getElementById(`${cat}Grid`);
        if(grid) {
            data.previews[cat].forEach(item => {
                grid.innerHTML += `
                    <div class="grid-item" style="border: 1px solid #222; padding: 20px;">
                        <span style="font-size:0.6rem; color:var(--accent)">${item.tag}</span>
                        <h4 style="margin:10px 0 0 0">${item.title}</h4>
                    </div>
                `;
            });
        }
    });

    // Balancement initial
    const tags = document.querySelectorAll('.key-tag');
    tags.forEach((tag, index) => {
        tag.animate([
            { transform: 'translateX(-50%) rotate(0deg)' },
            { transform: 'translateX(-50%) rotate(12deg)' },
            { transform: 'translateX(-50%) rotate(-8deg)' },
            { transform: 'translateX(-50%) rotate(0deg)' }
        ], { duration: 1500, delay: index * 100, easing: 'ease-in-out' });
    });
});
