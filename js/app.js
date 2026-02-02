function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Chargement auto des projets depuis data.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("Archive System Ready");
    // On pourrait ajouter ici la boucle qui crée les projets
});
