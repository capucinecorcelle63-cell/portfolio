const defaultProjects = [
    { id: 1, title: "Projet Un", subject: "Design", description: "Détails du projet 1." },
    { id: 2, title: "Projet Deux", subject: "Photo", description: "Détails du projet 2." },
    { id: 3, title: "Projet Trois", subject: "Video", description: "Détails du projet 3." },
    { id: 4, title: "Projet Quatre", subject: "Architecture", description: "Détails du projet 4." },
    { id: 5, title: "Projet Cinq", subject: "Web", description: "Détails du projet 5." }
];

function getProjects() {
    const stored = localStorage.getItem('portfolio_projects');
    return stored ? JSON.parse(stored) : defaultProjects;
}
