// Fonction pour scroller proprement
function scrollToSec(id) {
    const target = document.getElementById(id);
    if(target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animation au clic (la clé s'agite avant de descendre)
function handleKeyClick(element, sectionId) {
    element.animate([
        { transform: element.style.transform + ' scale(1)' },
        { transform: element.style.transform + ' scale(1.1) rotate(10deg)' },
        { transform: element.style.transform + ' scale(1)' }
    ], {
        duration: 300,
        easing: 'ease-in-out'
    });

    setTimeout(() => {
        scrollToSec(sectionId);
    }, 200);
}

// Balancement initial des clés au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const tags = document.querySelectorAll('.key-tag');
    tags.forEach((tag, index) => {
        const delay = index * 150;
        tag.animate([
            { transform: 'translateX(-50%) rotate(0deg)' },
            { transform: 'translateX(-50%) rotate(15deg)' },
            { transform: 'translateX(-50%) rotate(-10deg)' },
            { transform: 'translateX(-50%) rotate(0deg)' }
        ], {
            duration: 1500,
            delay: delay,
            easing: 'ease-in-out'
        });
    });
});
