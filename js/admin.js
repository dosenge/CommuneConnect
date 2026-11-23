/* ==========================================
   GESTION DES DEMANDES - RECHERCHE ET FILTRES
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchDemande');
    const filterStatut = document.getElementById('filterStatut');
    const filterDocument = document.getElementById('filterDocument');
    const resetButton = document.getElementById('resetFilters');

    const table = document.getElementById('demandesTable');
    const countElement = document.getElementById('demandesCount');
    const emptyMessage = document.getElementById('noDemandesResult');

    // Vérifier que les éléments existent sur la page
    if (!searchInput || !filterStatut || !filterDocument || !table) {
        return;
    }

    const rows = Array.from(table.querySelectorAll('tbody tr'));

    // Fonction de filtrage
    function filtrerDemandes() {
        const recherche = searchInput.value.toLowerCase().trim();
        const statut = filterStatut.value;
        const document = filterDocument.value;

        let nombreVisible = 0;

        rows.forEach(function (row) {
            const contenu = row.textContent.toLowerCase();

            const statutDemande = row.dataset.statut;
            const documentDemande = row.dataset.document;

            const correspondRecherche = contenu.includes(recherche);

            const correspondStatut = statut === '' || statutDemande === statut;

            const correspondDocument =
                document === '' || documentDemande === document;

            const afficher =
                correspondRecherche && correspondStatut && correspondDocument;

            row.style.display = afficher ? '' : 'none';

            if (afficher) {
                nombreVisible++;
            }
        });

        // Actualiser le nombre de demandes
        countElement.textContent = nombreVisible;

        // Afficher ou masquer le message
        emptyMessage.hidden = nombreVisible !== 0;
    }

    // Écouter les changements
    searchInput.addEventListener('input', filtrerDemandes);

    filterStatut.addEventListener('change', filtrerDemandes);

    filterDocument.addEventListener('change', filtrerDemandes);

    // Réinitialiser les filtres
    resetButton.addEventListener('click', function () {
        searchInput.value = '';
        filterStatut.value = '';
        filterDocument.value = '';

        filtrerDemandes();
    });

    // Initialisation
    filtrerDemandes();
});

/* ==========================================
   DETAILS DEMANDE - DECISIONS ADMINISTRATIVES
========================================== */

document.addEventListener('DOMContentLoaded', function () {
    const btnProcessing = document.getElementById('btnProcessing');
    const btnReject = document.getElementById('btnReject');
    const btnApprove = document.getElementById('btnApprove');

    const overlay = document.getElementById('adminConfirmOverlay');
    const confirmIcon = document.getElementById('adminConfirmIcon');
    const confirmTitle = document.getElementById('adminConfirmTitle');
    const confirmMessage = document.getElementById('adminConfirmMessage');

    const confirmCancel = document.getElementById('adminConfirmCancel');
    const confirmAction = document.getElementById('adminConfirmAction');

    const commentInput = document.getElementById('adminDecisionComment');
    const toast = document.getElementById('adminToast');

    // Vérifier si nous sommes sur la page des détails
    if (!btnProcessing || !btnReject || !btnApprove || !overlay) {
        return;
    }

    let actionEnCours = null;
    let toastTimer = null;

    /* ==========================================
       AFFICHER LA FENETRE DE CONFIRMATION
    ========================================== */

    function ouvrirConfirmation(action) {
        actionEnCours = action;

        if (action === 'processing') {
            confirmIcon.textContent = '⏳';
            confirmTitle.textContent = 'Mettre en traitement ?';

            confirmMessage.textContent =
                'Voulez-vous vraiment mettre cette demande en traitement ?';

            confirmAction.textContent = 'Confirmer';

            confirmAction.style.background = '#2563eb';
        } else if (action === 'reject') {
            const motif = commentInput.value.trim();

            if (motif === '') {
                afficherToast('Veuillez renseigner le motif du rejet.');

                commentInput.focus();

                return;
            }

            confirmIcon.textContent = '❌';
            confirmTitle.textContent = 'Rejeter la demande ?';

            confirmMessage.textContent =
                'Êtes-vous sûr de vouloir rejeter cette demande ? Cette décision sera enregistrée avec le motif fourni.';

            confirmAction.textContent = 'Confirmer le rejet';

            confirmAction.style.background = '#dc2626';
        } else if (action === 'approve') {
            confirmIcon.textContent = '✅';
            confirmTitle.textContent = 'Approuver la demande ?';

            confirmMessage.textContent =
                'Voulez-vous confirmer l’approbation de cette demande ?';

            confirmAction.textContent = 'Approuver';

            confirmAction.style.background = '#16a34a';
        }

        overlay.classList.add('show');
    }

    /* ==========================================
       FERMER LA FENETRE
    ========================================== */

    function fermerConfirmation() {
        overlay.classList.remove('show');

        actionEnCours = null;
    }

    /* ==========================================
       MODIFIER LE STATUT
    ========================================== */

    function modifierStatut(nouveauStatut, classeStatut) {
        const badges = document.querySelectorAll('.status-badge');

        badges.forEach(function (badge) {
            badge.classList.remove(
                'pending',
                'processing',
                'approved',
                'rejected'
            );

            badge.classList.add(classeStatut);

            badge.textContent = nouveauStatut;
        });

        // Mettre à jour l'historique visuel
        const timelineItems = document.querySelectorAll('.admin-timeline-item');

        timelineItems.forEach(function (item) {
            item.classList.remove('completed', 'current');
        });

        if (nouveauStatut === 'En traitement') {
            if (timelineItems[0]) {
                timelineItems[0].classList.add('completed');
            }

            if (timelineItems[1]) {
                timelineItems[1].classList.add('completed');
            }

            if (timelineItems[2]) {
                timelineItems[2].classList.add('current');
            }
        } else if (nouveauStatut === 'Approuvée') {
            timelineItems.forEach(function (item) {
                item.classList.add('completed');
            });
        } else if (nouveauStatut === 'Rejetée') {
            if (timelineItems[0]) {
                timelineItems[0].classList.add('completed');
            }

            if (timelineItems[1]) {
                timelineItems[1].classList.add('completed');
            }

            if (timelineItems[2]) {
                timelineItems[2].classList.add('current');
            }
        }
    }

    /* ==========================================
       AFFICHER UN MESSAGE
    ========================================== */

    function afficherToast(message) {
        toast.textContent = message;

        toast.classList.add('show');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove('show');
        }, 3500);
    }

    /* ==========================================
       EXECUTER L'ACTION
    ========================================== */

    function executerAction() {
        if (!actionEnCours) {
            return;
        }

        if (actionEnCours === 'processing') {
            modifierStatut('En traitement', 'processing');

            afficherToast('La demande est maintenant en traitement.');
        } else if (actionEnCours === 'approve') {
            modifierStatut('Approuvée', 'approved');

            afficherToast('La demande a été approuvée avec succès.');
        } else if (actionEnCours === 'reject') {
            modifierStatut('Rejetée', 'rejected');

            afficherToast('La demande a été rejetée.');
        }

        fermerConfirmation();
    }

    /* ==========================================
       EVENEMENTS DES BOUTONS
    ========================================== */

    btnProcessing.addEventListener('click', function () {
        ouvrirConfirmation('processing');
    });

    btnReject.addEventListener('click', function () {
        ouvrirConfirmation('reject');
    });

    btnApprove.addEventListener('click', function () {
        ouvrirConfirmation('approve');
    });

    confirmAction.addEventListener('click', function () {
        executerAction();
    });

    confirmCancel.addEventListener('click', function () {
        fermerConfirmation();
    });

    // Fermer en cliquant à l'extérieur
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            fermerConfirmation();
        }
    });

    // Fermer avec la touche Escape
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            fermerConfirmation();
        }
    });
});
