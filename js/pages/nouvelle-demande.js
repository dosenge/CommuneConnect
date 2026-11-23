/* ==========================================
   COMMUNECONNECT
   NOUVELLE DEMANDE
   FORMULAIRE MULTI-ÉTAPES
========================================== */

const requestForm = document.getElementById('requestForm');

const communeSelect = document.getElementById('commune');
const documentSelect = document.getElementById('documentType');
const requestReason = document.getElementById('requestReason');

const supportingDocuments = document.getElementById('supportingDocuments');
const uploadArea = document.getElementById('uploadArea');
const uploadButton = document.getElementById('uploadButton');
const uploadedFilesContainer = document.getElementById('uploadedFiles');

const summaryCommune = document.getElementById('summaryCommune');
const summaryDocument = document.getElementById('summaryDocument');
const summaryFiles = document.getElementById('summaryFiles');
const summaryPrice = document.getElementById('summaryPrice');

const currentStepElement = document.getElementById('currentStep');
const progressPercentage = document.getElementById('progressPercentage');
const progressBarFill = document.getElementById('progressBarFill');

const previousStepButton = document.getElementById('previousStep');
const nextStepButton = document.getElementById('nextStep');
const confirmRequestButton = document.getElementById('confirmRequest');
const cancelRequestButton = document.getElementById('cancelRequest');

const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');

// ==========================================
// 1. TARIFS
// ==========================================

const documentPrices = {
    'acte-naissance': 23000,
    'attestation-residence': 23000,
    'certificat-celibat': 20000,
    'attestation-perte': 23000,
    'certificat-vie': 23000,
    'composition-familiale': 20000,
};

// ==========================================
// 2. VARIABLES
// ==========================================

let currentStep = 1;

let selectedFiles = [];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

// ==========================================
// 3. FORMATAGE
// ==========================================

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FC';
}

function formatFileSize(size) {
    if (size < 1024) {
        return size + ' octets';
    }

    if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' Ko';
    }

    return (size / (1024 * 1024)).toFixed(2) + ' Mo';
}

// ==========================================
// 4. RÉCAPITULATIF
// ==========================================

function updateSummary() {
    // Commune

    summaryCommune.textContent = communeSelect.value || 'Non sélectionnée';

    // Document

    if (documentSelect.value !== '') {
        summaryDocument.textContent =
            documentSelect.options[documentSelect.selectedIndex].text;
    } else {
        summaryDocument.textContent = 'Non sélectionné';
    }

    // Fichiers

    summaryFiles.textContent =
        selectedFiles.length +
        (selectedFiles.length > 1 ? ' fichiers' : ' fichier');

    // Prix

    const price = documentPrices[documentSelect.value] || 0;

    summaryPrice.textContent = formatPrice(price);
}

// ==========================================
// 5. NAVIGATION ENTRE LES ÉTAPES
// ==========================================

function showStep(stepNumber) {
    currentStep = stepNumber;

    // Afficher la section correspondante

    steps.forEach(function (step) {
        step.classList.remove('active');
    });

    const activeStep = document.getElementById('step' + stepNumber);

    if (activeStep) {
        activeStep.classList.add('active');
    }

    // Mise à jour du numéro

    currentStepElement.textContent = stepNumber;

    // Progression

    const percentage = Math.round((stepNumber / 3) * 100);

    progressPercentage.textContent = percentage + '%';

    progressBarFill.style.width = percentage + '%';

    // Étapes visuelles

    progressSteps.forEach(function (step, index) {
        step.classList.remove('active', 'completed');

        if (index + 1 === stepNumber) {
            step.classList.add('active');
        } else if (index + 1 < stepNumber) {
            step.classList.add('completed');
        }
    });

    // Boutons

    previousStepButton.style.display =
        stepNumber === 1 ? 'none' : 'inline-flex';

    nextStepButton.style.display = stepNumber === 3 ? 'none' : 'inline-flex';

    confirmRequestButton.style.display =
        stepNumber === 3 ? 'inline-flex' : 'none';

    cancelRequestButton.style.display =
        stepNumber === 1 ? 'inline-flex' : 'none';

    // Mise à jour du récapitulatif

    updateSummary();

    // Retour en haut de la page

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

// ==========================================
// 6. VALIDATION ÉTAPE 1
// ==========================================

function validateStep1() {
    if (communeSelect.value === '') {
        alert('Veuillez sélectionner votre commune.');

        communeSelect.focus();

        return false;
    }

    if (documentSelect.value === '') {
        alert('Veuillez sélectionner le document souhaité.');

        documentSelect.focus();

        return false;
    }

    if (requestReason.value.trim() === '') {
        alert('Veuillez préciser le motif de votre demande.');

        requestReason.focus();

        return false;
    }

    return true;
}

// ==========================================
// 7. VALIDATION ÉTAPE 2
// ==========================================

function validateStep2() {
    // Pour le prototype, les pièces jointes ne sont pas obligatoires.
    // Nous pourrons rendre leur présence obligatoire selon le document.

    return true;
}

// ==========================================
// 8. BOUTON SUIVANT
// ==========================================

nextStepButton.addEventListener('click', function () {
    if (currentStep === 1) {
        if (!validateStep1()) {
            return;
        }

        showStep(2);

        return;
    }

    if (currentStep === 2) {
        if (!validateStep2()) {
            return;
        }

        showStep(3);
    }
});

// ==========================================
// 9. BOUTON PRÉCÉDENT
// ==========================================

previousStepButton.addEventListener('click', function () {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
});

// ==========================================
// 10. CHANGEMENT COMMUNE / DOCUMENT
// ==========================================

communeSelect.addEventListener('change', updateSummary);

documentSelect.addEventListener('change', updateSummary);

// ==========================================
// 11. SÉLECTEUR DE FICHIERS
// ==========================================

uploadButton.addEventListener('click', function (event) {
    event.stopPropagation();

    supportingDocuments.click();
});

uploadArea.addEventListener('click', function (event) {
    if (!event.target.closest('.upload-button')) {
        supportingDocuments.click();
    }
});

// ==========================================
// 12. VALIDATION FICHIER
// ==========================================

function validateFile(file) {
    const extension = file.name.split('.').pop().toLowerCase();

    // Extension

    if (!allowedExtensions.includes(extension)) {
        alert(
            'Format refusé : ' +
                file.name +
                '\nFormats acceptés : PDF, JPG, JPEG et PNG.'
        );

        return false;
    }

    // Taille

    if (file.size > MAX_FILE_SIZE) {
        alert(
            'Le fichier ' + file.name + ' dépasse la taille maximale de 5 Mo.'
        );

        return false;
    }

    // Doublon

    const duplicate = selectedFiles.some(function (existingFile) {
        return (
            existingFile.name === file.name && existingFile.size === file.size
        );
    });

    if (duplicate) {
        alert('Ce fichier a déjà été ajouté.');

        return false;
    }

    return true;
}

// ==========================================
// 13. AJOUT DES FICHIERS
// ==========================================

function addFiles(files) {
    Array.from(files).forEach(function (file) {
        if (validateFile(file)) {
            selectedFiles.push(file);
        }
    });

    renderFiles();

    updateSummary();
}

// ==========================================
// 14. AFFICHAGE DES FICHIERS
// ==========================================

function renderFiles() {
    uploadedFilesContainer.innerHTML = '';

    selectedFiles.forEach(function (file, index) {
        const fileElement = document.createElement('div');

        fileElement.classList.add('uploaded-file');

        const fileInfo = document.createElement('div');

        fileInfo.classList.add('uploaded-file-info');

        const fileIcon = document.createElement('div');

        fileIcon.classList.add('uploaded-file-icon');

        fileIcon.textContent = '📄';

        const fileDetails = document.createElement('div');

        fileDetails.classList.add('uploaded-file-details');

        const fileName = document.createElement('div');

        fileName.classList.add('uploaded-file-name');

        fileName.textContent = file.name;

        const fileSize = document.createElement('div');

        fileSize.classList.add('uploaded-file-size');

        fileSize.textContent = formatFileSize(file.size);

        fileDetails.appendChild(fileName);

        fileDetails.appendChild(fileSize);

        fileInfo.appendChild(fileIcon);

        fileInfo.appendChild(fileDetails);

        // Supprimer

        const removeButton = document.createElement('button');

        removeButton.type = 'button';

        removeButton.classList.add('remove-file');

        removeButton.textContent = '×';

        removeButton.setAttribute('aria-label', 'Supprimer ' + file.name);

        removeButton.addEventListener('click', function () {
            removeFile(index);
        });

        fileElement.appendChild(fileInfo);

        fileElement.appendChild(removeButton);

        uploadedFilesContainer.appendChild(fileElement);
    });
}

// ==========================================
// 15. SUPPRESSION FICHIER
// ==========================================

function removeFile(index) {
    selectedFiles.splice(index, 1);

    renderFiles();

    updateSummary();
}

// ==========================================
// 16. SÉLECTION DE FICHIERS
// ==========================================

supportingDocuments.addEventListener('change', function () {
    addFiles(supportingDocuments.files);

    supportingDocuments.value = '';
});

// ==========================================
// 17. GLISSER-DÉPOSER
// ==========================================

uploadArea.addEventListener('dragover', function (event) {
    event.preventDefault();

    uploadArea.classList.add('drag-active');
});

uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('drag-active');
});

uploadArea.addEventListener('drop', function (event) {
    event.preventDefault();

    uploadArea.classList.remove('drag-active');

    addFiles(event.dataTransfer.files);
});

// ==========================================
// 18. CONFIRMATION FINALE
// ==========================================

// ==========================================
// 18. CONFIRMATION FINALE
// ==========================================

const successOverlay = document.getElementById('successOverlay');

const requestReference = document.getElementById('requestReference');

const successDocument = document.getElementById('successDocument');

const successCommune = document.getElementById('successCommune');

const successPrice = document.getElementById('successPrice');

const copyReferenceButton = document.getElementById('copyReference');

function generateReference() {
    const year = new Date().getFullYear();

    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return 'CC-KIN-' + year + '-' + randomNumber;
}

requestForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateStep1()) {
        showStep(1);

        return;
    }

    const documentName =
        documentSelect.options[documentSelect.selectedIndex].text;

    const communeName = communeSelect.value;

    const price = documentPrices[documentSelect.value] || 0;

    const confirmationMessage =
        'Confirmez-vous votre demande ?\n\n' +
        'Commune : ' +
        communeName +
        '\n' +
        'Document : ' +
        documentName +
        '\n' +
        'Frais : ' +
        formatPrice(price);

    if (!confirm(confirmationMessage)) {
        return;
    }

    // Génération de la référence

    const reference = generateReference();

    // Remplir les informations

    requestReference.textContent = reference;

    successDocument.textContent = documentName;

    successCommune.textContent = communeName;

    successPrice.textContent = formatPrice(price);

    // Afficher la confirmation

    successOverlay.classList.add('active');

    document.body.style.overflow = 'hidden';
});

// ==========================================
// 19. COPIER LA RÉFÉRENCE
// ==========================================

copyReferenceButton.addEventListener('click', async function () {
    const reference = requestReference.textContent.trim();

    try {
        await navigator.clipboard.writeText(reference);

        copyReferenceButton.textContent = 'Copié ✓';

        setTimeout(function () {
            copyReferenceButton.textContent = 'Copier la référence';
        }, 2000);
    } catch (error) {
        alert('Impossible de copier automatiquement. Référence : ' + reference);
    }
});

// ==========================================
// 20. INITIALISATION
// ==========================================

showStep(1);

updateSummary();

// ==========================================
// 19. INITIALISATION
// ==========================================

showStep(1);

updateSummary();
