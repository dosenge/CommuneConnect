// ==========================================
// COMMUNECONNECT - SUIVI DES DEMANDES
// ==========================================

// 1. Données de démonstration
const demandes = [
    {
        reference: 'CC-KIN-2026-000125',
        document: 'Acte de naissance',
        commune: 'Gombe',
        date: '2026-11-18',
        statut: 'processing',
        frais: 15000,
        description: "Demande d'obtention d'un acte de naissance.",
    },
    {
        reference: 'CC-KIN-2026-000124',
        document: 'Attestation de résidence',
        commune: 'Lemba',
        date: '2026-11-16',
        statut: 'pending',
        frais: 10000,
        description: "Demande d'attestation de résidence.",
    },
    {
        reference: 'CC-KIN-2026-000123',
        document: 'Certificat de célibat',
        commune: 'Matete',
        date: '2026-11-14',
        statut: 'approved',
        frais: 20000,
        description: 'Demande de certificat de célibat.',
    },
    {
        reference: 'CC-KIN-2026-000122',
        document: 'Acte de naissance',
        commune: 'Ngaliema',
        date: '2026-11-12',
        statut: 'rejected',
        frais: 15000,
        description: 'Demande rejetée pour document incomplet.',
    },
    {
        reference: 'CC-KIN-2026-000121',
        document: 'Attestation de résidence',
        commune: 'Kinshasa',
        date: '2026-11-10',
        statut: 'processing',
        frais: 10000,
        description: 'Demande en cours de traitement.',
    },
    {
        reference: 'CC-KIN-2026-000120',
        document: 'Certificat de vie',
        commune: 'Bandalungwa',
        date: '2026-11-08',
        statut: 'approved',
        frais: 10000,
        description: 'Demande de certificat de vie.',
    },
];

// 2. Variables
const requestsTableBody = document.getElementById('requestsTableBody');
const requestSearch = document.getElementById('requestSearch');
const statusFilter = document.getElementById('statusFilter');
const communeFilter = document.getElementById('communeFilter');

const requestsEmpty = document.getElementById('requestsEmpty');

const previousPageBtn = document.getElementById('previousPage');
const nextPageBtn = document.getElementById('nextPage');

const pageInformation = document.getElementById('pageInformation');

let demandesFiltrees = [...demandes];

let pageActuelle = 1;
const demandesParPage = 5;

// 3. Formatage des montants
function formaterMontant(montant) {
    return montant.toLocaleString('fr-FR') + ' FC';
}

// 4. Formatage des dates
function formaterDate(date) {
    const dateObj = new Date(date);

    return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

// 5. Définition des statuts
function obtenirStatut(statut) {
    const statuts = {
        pending: {
            label: 'En attente',
            classe: 'status-pending',
        },

        processing: {
            label: 'En traitement',
            classe: 'status-processing',
        },

        approved: {
            label: 'Validée',
            classe: 'status-approved',
        },

        rejected: {
            label: 'Rejetée',
            classe: 'status-rejected',
        },
    };

    return (
        statuts[statut] || {
            label: 'Inconnu',
            classe: '',
        }
    );
}

// 6. Affichage des demandes
function afficherDemandes() {
    if (!requestsTableBody) return;

    requestsTableBody.innerHTML = '';

    const debut = (pageActuelle - 1) * demandesParPage;
    const fin = debut + demandesParPage;

    const demandesPage = demandesFiltrees.slice(debut, fin);

    if (demandesPage.length === 0) {
        requestsTableBody.innerHTML = '';

        if (requestsEmpty) {
            requestsEmpty.style.display = 'block';
        }

        mettreAJourPagination();

        return;
    }

    if (requestsEmpty) {
        requestsEmpty.style.display = 'none';
    }

    demandesPage.forEach((demande) => {
        const statut = obtenirStatut(demande.statut);

        const ligne = document.createElement('tr');

        ligne.innerHTML = `
            <td>
                <span class="request-reference">
                    ${demande.reference}
                </span>
            </td>

            <td>
                <div class="request-document">
                    ${demande.document}
                </div>
            </td>

            <td>${demande.commune}</td>

            <td>${formaterDate(demande.date)}</td>

            <td>
                <span class="status-badge ${statut.classe}">
                    ${statut.label}
                </span>
            </td>

            <td>
                <strong>${formaterMontant(demande.frais)}</strong>
            </td>

            <td>
                <button 
                    class="view-request-btn"
                    data-reference="${demande.reference}"
                    title="Voir les détails"
                >
                    Voir
                </button>
            </td>
        `;

        requestsTableBody.appendChild(ligne);
    });

    // Boutons de détails
    document.querySelectorAll('.view-request-btn').forEach((bouton) => {
        bouton.addEventListener('click', () => {
            afficherDetailsDemande(bouton.dataset.reference);
        });
    });

    mettreAJourPagination();
}

// 7. Recherche
function rechercherDemandes() {
    const recherche = requestSearch?.value.toLowerCase().trim() || '';

    const statut = statusFilter?.value || 'all';

    const commune = communeFilter?.value || 'all';

    demandesFiltrees = demandes.filter((demande) => {
        const correspondRecherche =
            demande.reference.toLowerCase().includes(recherche) ||
            demande.document.toLowerCase().includes(recherche) ||
            demande.commune.toLowerCase().includes(recherche);

        const correspondStatut = statut === 'all' || demande.statut === statut;

        const correspondCommune =
            commune === 'all' || demande.commune === commune;

        return correspondRecherche && correspondStatut && correspondCommune;
    });

    pageActuelle = 1;

    afficherDemandes();
}

// 8. Pagination
function mettreAJourPagination() {
    const totalPages = Math.max(
        1,
        Math.ceil(demandesFiltrees.length / demandesParPage)
    );

    if (pageInformation) {
        pageInformation.textContent = `Page ${pageActuelle} sur ${totalPages}`;
    }

    if (previousPageBtn) {
        previousPageBtn.disabled = pageActuelle <= 1;
    }

    if (nextPageBtn) {
        nextPageBtn.disabled = pageActuelle >= totalPages;
    }
}

// Page précédente
previousPageBtn?.addEventListener('click', () => {
    if (pageActuelle > 1) {
        pageActuelle--;

        afficherDemandes();
    }
});

// Page suivante
nextPageBtn?.addEventListener('click', () => {
    const totalPages = Math.ceil(demandesFiltrees.length / demandesParPage);

    if (pageActuelle < totalPages) {
        pageActuelle++;

        afficherDemandes();
    }
});

// 9. Détails d'une demande
function afficherDetailsDemande(reference) {
    const demande = demandes.find((d) => d.reference === reference);

    if (!demande) return;

    const statut = obtenirStatut(demande.statut);

    const overlay = document.getElementById('requestDetailsOverlay');

    const contenu = document.getElementById('requestDetailsContent');

    if (!overlay || !contenu) return;

    contenu.innerHTML = `
        <div class="request-detail-item">
            <span>Référence</span>
            <strong>${demande.reference}</strong>
        </div>

        <div class="request-detail-item">
            <span>Document demandé</span>
            <strong>${demande.document}</strong>
        </div>

        <div class="request-detail-item">
            <span>Commune</span>
            <strong>${demande.commune}</strong>
        </div>

        <div class="request-detail-item">
            <span>Date de demande</span>
            <strong>${formaterDate(demande.date)}</strong>
        </div>

        <div class="request-detail-item">
            <span>Statut</span>
            <strong>
                <span class="status-badge ${statut.classe}">
                    ${statut.label}
                </span>
            </strong>
        </div>

        <div class="request-detail-item">
            <span>Frais estimés</span>
            <strong>${formaterMontant(demande.frais)}</strong>
        </div>

        <div class="request-detail-description">
            <span>Description</span>
            <p>${demande.description}</p>
        </div>
    `;

    overlay.classList.add('active');

    document.body.style.overflow = 'hidden';
}

// 10. Fermeture du modal
const closeDetailsBtn = document.getElementById('closeDetails');

const detailsOverlay = document.getElementById('requestDetailsOverlay');

closeDetailsBtn?.addEventListener('click', fermerDetails);

detailsOverlay?.addEventListener('click', (event) => {
    if (event.target === detailsOverlay) {
        fermerDetails();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        fermerDetails();
    }
});

function fermerDetails() {
    if (!detailsOverlay) return;

    detailsOverlay.classList.remove('active');

    document.body.style.overflow = '';
}

// 11. Événements des filtres
requestSearch?.addEventListener('input', rechercherDemandes);

statusFilter?.addEventListener('change', rechercherDemandes);

communeFilter?.addEventListener('change', rechercherDemandes);

// 12. Initialisation
document.addEventListener('DOMContentLoaded', () => {
    afficherDemandes();
});
