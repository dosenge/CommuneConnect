// ========================================
// COMMUNECONNECT
// JavaScript principal
// ========================================

console.log('CommuneConnect est chargé !');

// ========================================
// MENU MOBILE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');

if (menuToggle && navigation) {
    menuToggle.addEventListener('click', function () {
        navigation.classList.toggle('active');

        const menuOuvert = navigation.classList.contains('active');

        menuToggle.setAttribute('aria-expanded', menuOuvert);

        menuToggle.innerHTML = menuOuvert ? '✕' : '☰';
    });
}

// Fermer le menu après avoir cliqué sur un lien

if (navigation) {
    const liensNavigation = navigation.querySelectorAll('a');

    liensNavigation.forEach(function (lien) {
        lien.addEventListener('click', function () {
            navigation.classList.remove('active');

            if (menuToggle) {
                menuToggle.innerHTML = '☰';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}
