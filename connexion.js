// ========================================
// COMMUNECONNECT
// PAGE DE CONNEXION
// ========================================

// Récupération des éléments

const loginForm = document.getElementById('loginForm');

const identifier = document.getElementById('identifier');

const password = document.getElementById('password');

const togglePassword = document.getElementById('togglePassword');

const loginMessage = document.getElementById('loginMessage');

// ========================================
// AFFICHER / MASQUER LE MOT DE PASSE
// ========================================

if (togglePassword && password) {
    togglePassword.addEventListener('click', function () {
        if (password.type === 'password') {
            password.type = 'text';

            togglePassword.textContent = '🙈';

            togglePassword.setAttribute(
                'aria-label',
                'Masquer le mot de passe'
            );
        } else {
            password.type = 'password';

            togglePassword.textContent = '👁';

            togglePassword.setAttribute(
                'aria-label',
                'Afficher le mot de passe'
            );
        }
    });
}

// ========================================
// VALIDATION DU FORMULAIRE
// ========================================

if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const identifiant = identifier.value.trim();

        const motDePasse = password.value;

        // Vérification des champs

        if (identifiant === '' || motDePasse === '') {
            afficherMessage('Veuillez remplir tous les champs.', 'error');

            return;
        }

        // Démonstration frontend uniquement

        afficherMessage(
            'Formulaire validé ! La connexion réelle sera mise en place avec PHP et MySQL.',
            'success'
        );

        console.log('Identifiant saisi :', identifiant);
    });
}

// ========================================
// AFFICHAGE DES MESSAGES
// ========================================

function afficherMessage(message, type) {
    loginMessage.textContent = message;

    loginMessage.className = 'login-message ' + type;
}
