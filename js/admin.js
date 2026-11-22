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
