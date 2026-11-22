// ========================================
// COMMUNECONNECT
// INSCRIPTION CITOYEN
// ========================================

const registerForm = document.getElementById('registerForm');

const registerPassword = document.getElementById('registerPassword');

const confirmPassword = document.getElementById('confirmPassword');

const registerMessage = document.getElementById('registerMessage');

// ========================================
// AFFICHER / MASQUER LES MOTS DE PASSE
// ========================================

const passwordButtons = document.querySelectorAll('.password-toggle');

passwordButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

        if (!input) return;

        if (input.type === 'password') {
            input.type = 'text';

            button.textContent = '🙈';
        } else {
            input.type = 'password';

            button.textContent = '👁';
        }
    });
});

// ========================================
// VALIDATION
// ========================================

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Vérifier la correspondance des mots de passe

    if (registerPassword.value !== confirmPassword.value) {
        afficherMessageInscription(
            'Les mots de passe ne correspondent pas.',
            'error'
        );

        confirmPassword.focus();

        return;
    }

    // Vérifier la longueur

    if (registerPassword.value.length < 8) {
        afficherMessageInscription(
            'Le mot de passe doit contenir au moins 8 caractères.',
            'error'
        );

        return;
    }

    // Vérifier l'acceptation des conditions

    const acceptTerms = document.getElementById('acceptTerms');

    if (!acceptTerms.checked) {
        afficherMessageInscription(
            "Veuillez accepter les conditions d'utilisation.",
            'error'
        );

        return;
    }

    // Validation frontend

    afficherMessageInscription(
        'Inscription validée côté frontend ! La création réelle du compte sera développée avec PHP et MySQL.',
        'success'
    );

    console.log("Formulaire d'inscription validé.");
});

// ========================================
// AFFICHAGE DES MESSAGES
// ========================================

function afficherMessageInscription(message, type) {
    registerMessage.textContent = message;

    registerMessage.className = 'login-message ' + type;
}
