// ======================================================
// COMMUNECONNECT - MES DOCUMENTS
// ======================================================

// 1. DONNÉES DE DÉMONSTRATION
const documents = [
    {
        id: 1,
        nom: 'Acte de naissance',
        reference: 'CC-KIN-2026-000115',
        commune: 'Gombe',
        dateDelivrance: '2026-11-15',
        dateExpiration: null,
        statut: 'available',
        format: 'PDF',
        description:
            'Acte officiel de naissance délivré par la commune de Gombe.',
        fichier: 'acte-naissance.pdf',
    },

    {
        id: 2,
        nom: 'Attestation de résidence',
        reference: 'CC-KIN-2026-000108',
        commune: 'Lemba',
        dateDelivrance: '2026-11-10',
        dateExpiration: '2027-11-10',
        statut: 'available',
        format: 'PDF',
        description:
            'Attestation officielle confirmant votre lieu de résidence.',
        fichier: 'attestation-residence.pdf',
    },

    {
        id: 3,
        nom: 'Certificat de célibat',
        reference: 'CC-KIN-2026-000099',
        commune: 'Matete',
        dateDelivrance: '2026-11-05',
        dateExpiration: null,
        statut: 'available',
        format: 'PDF',
        description:
            'Certificat administratif attestant votre situation matrimoniale.',
        fichier: 'certificat-celibat.pdf',
    },

    {
        id: 4,
        nom: 'Attestation de résidence',
        reference: 'CC-KIN-2025-000045',
        commune: 'Ngaliema',
        dateDelivrance: '2025-08-12',
        dateExpiration: '2026-08-12',
        statut: 'expired',
        format: 'PDF',
        description: 'Ancienne attestation de résidence arrivée à expiration.',
        fichier: 'ancienne-attestation.pdf',
    },
];

// 2. ÉLÉMENTS HTML
const documentsGrid = document.getElementById('documentsGrid');

const documentSearch = document.getElementById('documentSearch');

const documentStatusFilter = document.getElementById('documentStatusFilter');

const documentCommuneFilter = document.getElementById('documentCommuneFilter');

const documentsEmpty = document.getElementById('documentsEmpty');

const documentsCount = document.getElementById('documentsCount');

const documentModal = document.getElementById('documentModal');

const documentModalContent = document.getElementById('documentModalContent');

const closeDocumentModal = document.getElementById('closeDocumentModal');

// 3. FORMATAGE DES DATES
function formaterDateDocument(date) {
    if (!date) {
        return 'Non applicable';
    }

    const dateObj = new Date(date + 'T00:00:00');

    return dateObj.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

// 4. DONNER LE LABEL DU STATUT
function obtenirStatutDocument(statut) {
    if (statut === 'available') {
        return {
            label: 'Disponible',
            classe: 'available',
        };
    }

    return {
        label: 'Expiré',
        classe: 'expired',
    };
}

// 5. ICÔNE DU DOCUMENT
function obtenirIconeDocument(format) {
    if (format === 'PDF') {
        return 'fas fa-file-pdf';
    }

    if (format === 'JPG' || format === 'PNG') {
        return 'fas fa-file-image';
    }

    return 'fas fa-file';
}

// 6. AFFICHAGE DES DOCUMENTS
function afficherDocuments(liste = documents) {
    if (!documentsGrid) return;

    documentsGrid.innerHTML = '';

    if (documentsCount) {
        documentsCount.textContent = `${liste.length} document${liste.length > 1 ? 's' : ''}`;
    }

    if (liste.length === 0) {
        if (documentsEmpty) {
            documentsEmpty.style.display = 'block';
        }

        return;
    }

    if (documentsEmpty) {
        documentsEmpty.style.display = 'none';
    }

    liste.forEach((document) => {
        const statut = obtenirStatutDocument(document.statut);

        const carte = document.createElement('article');

        carte.className = `document-card ${
            document.statut === 'expired' ? 'is-expired' : ''
        }`;

        carte.innerHTML = `
            <div class="document-card-header">

                <div class="document-file-icon pdf">
                    <i class="${obtenirIconeDocument(document.format)}"></i>
                </div>

                <div class="document-card-title">
                    <h4>${document.nom}</h4>

                    <p>${document.reference}</p>
                </div>

                <span class="document-status ${statut.classe}">
                    ${statut.label}
                </span>

            </div>

            <div class="document-card-info">

                <div class="document-info-row">
                    <span>Commune</span>
                    <strong>${document.commune}</strong>
                </div>

                <div class="document-info-row">
                    <span>Date de délivrance</span>
                    <strong>${formaterDateDocument(document.dateDelivrance)}</strong>
                </div>

                <div class="document-info-row">
                    <span>Expiration</span>
                    <strong>
                        ${
                            document.dateExpiration
                                ? formaterDateDocument(document.dateExpiration)
                                : 'Sans expiration'
                        }
                    </strong>
                </div>

            </div>

            <div class="document-card-actions">

                <button
                    type="button"
                    class="document-details-btn"
                    data-id="${document.id}"
                >
                    <i class="fas fa-eye"></i>
                    Détails
                </button>

                <button
                    type="button"
                    class="document-download-btn"
                    data-id="${document.id}"
                    ${document.statut === 'expired' ? 'disabled' : ''}
                >
                    <i class="fas fa-download"></i>
                    Télécharger
                </button>

            </div>
        `;

        documentsGrid.appendChild(carte);
    });

    // Boutons détails
    document.querySelectorAll('.document-details-btn').forEach((bouton) => {
        bouton.addEventListener('click', () => {
            afficherDetailsDocument(Number(bouton.dataset.id));
        });
    });

    // Boutons télécharger
    document.querySelectorAll('.document-download-btn').forEach((bouton) => {
        bouton.addEventListener('click', () => {
            telechargerDocument(Number(bouton.dataset.id));
        });
    });
}

// 7. RECHERCHE ET FILTRES
function filtrerDocuments() {
    const recherche = documentSearch?.value.toLowerCase().trim() || '';

    const statut = documentStatusFilter?.value || 'all';

    const commune = documentCommuneFilter?.value || 'all';

    const resultat = documents.filter((document) => {
        const correspondRecherche =
            document.nom.toLowerCase().includes(recherche) ||
            document.reference.toLowerCase().includes(recherche) ||
            document.commune.toLowerCase().includes(recherche);

        const correspondStatut = statut === 'all' || document.statut === statut;

        const correspondCommune =
            commune === 'all' || document.commune === commune;

        return correspondRecherche && correspondStatut && correspondCommune;
    });

    afficherDocuments(resultat);
}

// 8. DÉTAILS DU DOCUMENT
function afficherDetailsDocument(id) {
    const document = documents.find((doc) => doc.id === id);

    if (!document || !documentModal || !documentModalContent) {
        return;
    }

    const statut = obtenirStatutDocument(document.statut);

    documentModalContent.innerHTML = `
        <div class="document-detail-header">

            <div class="document-file-icon pdf">
                <i class="${obtenirIconeDocument(document.format)}"></i>
            </div>

            <div>
                <h3>${document.nom}</h3>

                <span class="document-status ${statut.classe}">
                    ${statut.label}
                </span>
            </div>

        </div>

        <div class="document-detail-list">

            <div class="document-info-row">
                <span>Référence</span>
                <strong>${document.reference}</strong>
            </div>

            <div class="document-info-row">
                <span>Commune</span>
                <strong>${document.commune}</strong>
            </div>

            <div class="document-info-row">
                <span>Date de délivrance</span>
                <strong>${formaterDateDocument(document.dateDelivrance)}</strong>
            </div>

            <div class="document-info-row">
                <span>Date d'expiration</span>
                <strong>
                    ${
                        document.dateExpiration
                            ? formaterDateDocument(document.dateExpiration)
                            : 'Sans expiration'
                    }
                </strong>
            </div>

            <div class="document-info-row">
                <span>Format</span>
                <strong>${document.format}</strong>
            </div>

        </div>

        <div class="document-detail-description">
            <h4>Description</h4>

            <p>${document.description}</p>
        </div>

        ${
            document.statut === 'available'
                ? `
                    <button
                        class="document-download-btn modal-download-btn"
                        id="modalDownloadButton"
                        data-id="${document.id}"
                    >
                        <i class="fas fa-download"></i>
                        Télécharger le document
                    </button>
                `
                : `
                    <div class="document-expired-message">
                        <i class="fas fa-exclamation-circle"></i>

                        Ce document a expiré.
                        Veuillez effectuer une nouvelle demande si nécessaire.
                    </div>
                `
        }
    `;

    documentModal.classList.add('active');

    document.body.style.overflow = 'hidden';

    // Télécharger depuis le modal
    const modalDownloadButton = document.getElementById('modalDownloadButton');

    modalDownloadButton?.addEventListener('click', () => {
        telechargerDocument(document.id);
    });
}

// 9. SIMULATION DU TÉLÉCHARGEMENT
function telechargerDocument(id) {
    const document = documents.find((doc) => doc.id === id);

    if (!document) return;

    if (document.statut !== 'available') {
        alert("Ce document n'est plus disponible au téléchargement.");
        return;
    }

    /*
       SIMULATION FRONTEND

       Dans la version réelle, le fichier PDF sera fourni
       par le serveur après vérification des droits.
    */

    const contenu = `
COMMUNECONNECT
SERVICES COMMUNAUX NUMÉRIQUES

DOCUMENT ADMINISTRATIF - DEMONSTRATION

Document : ${document.nom}
Référence : ${document.reference}
Commune : ${document.commune}
Date de délivrance : ${formaterDateDocument(document.dateDelivrance)}

${document.description}

Ce fichier est un document de démonstration du prototype frontend.
Il ne constitue pas un document administratif officiel.
    `;

    const blob = new Blob([contenu], {
        type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);

    const lien = document.createElement('a');

    lien.href = url;

    lien.download = document.fichier.replace('.pdf', '.txt');

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(url);

    alert(
        'Téléchargement de démonstration effectué. ' +
            "Le fichier téléchargé n'est pas un document officiel."
    );
}

// 10. FERMETURE DU MODAL
function fermerModalDocument() {
    if (!documentModal) return;

    documentModal.classList.remove('active');

    document.body.style.overflow = '';
}

closeDocumentModal?.addEventListener('click', fermerModalDocument);

documentModal?.addEventListener('click', (event) => {
    if (event.target === documentModal) {
        fermerModalDocument();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        fermerModalDocument();
    }
});

// 11. ÉVÉNEMENTS
documentSearch?.addEventListener('input', filtrerDocuments);

documentStatusFilter?.addEventListener('change', filtrerDocuments);

documentCommuneFilter?.addEventListener('change', filtrerDocuments);

// 12. INITIALISATION
afficherDocuments();
