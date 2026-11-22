/* ==========================================
   COMMUNECONNECT - ESPACE CITOYEN
========================================== */

// Récupération des éléments HTML
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

// Création de l'overlay mobile
const sidebarOverlay = document.createElement('div');

sidebarOverlay.classList.add('sidebar-overlay');
sidebarOverlay.id = 'sidebarOverlay';

document.body.appendChild(sidebarOverlay);

/* ==========================================
   OUVRIR LE MENU LATÉRAL
========================================== */

function ouvrirSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');

    sidebarToggle.setAttribute('aria-expanded', 'true');
}

/* ==========================================
   FERMER LE MENU LATÉRAL
========================================== */

function fermerSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');

    sidebarToggle.setAttribute('aria-expanded', 'false');
}

/* ==========================================
   BOUTON MENU
========================================== */

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
        if (sidebar.classList.contains('open')) {
            fermerSidebar();
        } else {
            ouvrirSidebar();
        }
    });
}

/* ==========================================
   FERMETURE EN CLIQUANT À L'EXTÉRIEUR
========================================== */

sidebarOverlay.addEventListener('click', fermerSidebar);

/* ==========================================
   FERMETURE AVEC LA TOUCHE ESCAPE
========================================== */

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        fermerSidebar();
    }
});

/* ==========================================
   FERMETURE APRÈS NAVIGATION MOBILE
========================================== */

const navigationLinks = document.querySelectorAll(
    '.sidebar-navigation .nav-link'
);

navigationLinks.forEach(function (link) {
    link.addEventListener('click', function () {
        fermerSidebar();
    });
});

/* ==========================================
   GESTION DU REDIMENSIONNEMENT
========================================== */

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        fermerSidebar();
    }
});

/* ==========================================
   ANNÉE AUTOMATIQUE
========================================== */

const currentYear = new Date().getFullYear();

const footerYear = document.querySelector('[data-current-year]');

if (footerYear) {
    footerYear.textContent = currentYear;
}
