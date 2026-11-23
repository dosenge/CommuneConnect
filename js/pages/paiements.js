// ======================================================
// COMMUNECONNECT - MES PAIEMENTS
// ======================================================

// 1. DONNÉES DE DÉMONSTRATION
const payments = [
    {
        id: 1,
        reference: 'PAY-2026-001',
        transaction: 'MP-458921',
        document: 'Acte de naissance',
        requestReference: 'CC-KIN-2026-000115',
        date: '2026-11-15',
        method: 'mpesa',
        amount: 23000,
        status: 'paid',
    },
    {
        id: 2,
        reference: 'PAY-2026-002',
        transaction: 'AT-784521',
        document: 'Attestation de résidence',
        requestReference: 'CC-KIN-2026-000108',
        date: '2026-11-12',
        method: 'airtel',
        amount: 10000,
        status: 'paid',
    },
    {
        id: 3,
        reference: 'PAY-2026-003',
        transaction: 'OR-963852',
        document: 'Certificat de célibat',
        requestReference: 'CC-KIN-2026-000099',
        date: '2026-11-10',
        method: 'orange',
        amount: 23000,
        status: 'paid',
    },
    {
        id: 4,
        reference: 'PAY-2026-004',
        transaction: 'MP-123456',
        document: 'Attestation de vie',
        requestReference: 'CC-KIN-2026-000120',
        date: '2026-11-20',
        method: 'mpesa',
        amount: 23000,
        status: 'pending',
    },
];

// 2. CONFIGURATION PAGINATION
const paymentsPerPage = 5;

let currentPaymentsPage = 1;

let filteredPayments = [...payments];

// 3. ÉLÉMENTS HTML
const paymentSearch = document.getElementById('paymentSearch');

const paymentStatusFilter = document.getElementById('paymentStatusFilter');

const paymentMethodFilter = document.getElementById('paymentMethodFilter');

const paymentsTableBody = document.getElementById('paymentsTableBody');

const paymentsEmpty = document.getElementById('paymentsEmpty');

const paymentsCount = document.getElementById('paymentsCount');

const paymentsPageInformation = document.getElementById(
    'paymentsPageInformation'
);

const paymentsPreviousPage = document.getElementById('paymentsPreviousPage');

const paymentsNextPage = document.getElementById('paymentsNextPage');

const paymentDetailsOverlay = document.getElementById('paymentDetailsOverlay');

const paymentDetailsContent = document.getElementById('paymentDetailsContent');

const closePaymentDetails = document.getElementById('closePaymentDetails');

// 4. FORMATAGE DES MONTANTS
function formatPaymentAmount(amount) {
    return amount.toLocaleString('fr-FR') + ' FC';
}

// 5. FORMATAGE DES DATES
function formatPaymentDate(date) {
    const dateObject = new Date(date + 'T00:00:00');

    return dateObject.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

// 6. STATUTS
function getPaymentStatus(status) {
    const statuses = {
        paid: {
            label: 'Payé',
            class: 'paid',
            icon: 'fas fa-check-circle',
        },

        pending: {
            label: 'En attente',
            class: 'pending',
            icon: 'fas fa-clock',
        },

        failed: {
            label: 'Échoué',
            class: 'failed',
            icon: 'fas fa-times-circle',
        },
    };

    return statuses[status] || statuses.pending;
}

// 7. MOYENS DE PAIEMENT
function getPaymentMethod(method) {
    const methods = {
        mpesa: {
            label: 'M-Pesa',
            icon: 'fas fa-mobile-screen-button',
            class: 'mpesa',
        },

        airtel: {
            label: 'Airtel Money',
            icon: 'fas fa-mobile-screen-button',
            class: 'airtel',
        },

        orange: {
            label: 'Orange Money',
            icon: 'fas fa-mobile-screen-button',
            class: 'orange',
        },

        card: {
            label: 'Carte bancaire',
            icon: 'fas fa-credit-card',
            class: 'card',
        },
    };

    return methods[method] || methods.card;
}

// 8. CALCUL DES STATISTIQUES
function updatePaymentStatistics() {
    const totalPaid = payments
        .filter((payment) => payment.status === 'paid')
        .reduce((total, payment) => total + payment.amount, 0);

    const totalPending = payments
        .filter((payment) => payment.status === 'pending')
        .reduce((total, payment) => total + payment.amount, 0);

    const totalTransactions = payments.length;

    const totalPaidElement = document.getElementById('totalPaid');

    const totalPendingElement = document.getElementById('totalPending');

    const totalTransactionsElement =
        document.getElementById('totalTransactions');

    if (totalPaidElement) {
        totalPaidElement.textContent = formatPaymentAmount(totalPaid);
    }

    if (totalPendingElement) {
        totalPendingElement.textContent = formatPaymentAmount(totalPending);
    }

    if (totalTransactionsElement) {
        totalTransactionsElement.textContent = String(
            totalTransactions
        ).padStart(2, '0');
    }
}

// 9. AFFICHAGE DU TABLEAU
function displayPayments() {
    if (!paymentsTableBody) return;

    paymentsTableBody.innerHTML = '';

    const totalPages = Math.max(
        1,
        Math.ceil(filteredPayments.length / paymentsPerPage)
    );

    if (currentPaymentsPage > totalPages) {
        currentPaymentsPage = totalPages;
    }

    const startIndex = (currentPaymentsPage - 1) * paymentsPerPage;

    const currentPagePayments = filteredPayments.slice(
        startIndex,
        startIndex + paymentsPerPage
    );

    if (paymentsCount) {
        paymentsCount.textContent = `${filteredPayments.length} transaction${filteredPayments.length > 1 ? 's' : ''}`;
    }

    if (filteredPayments.length === 0) {
        if (paymentsEmpty) {
            paymentsEmpty.style.display = 'block';
        }

        const tableWrapper = document.querySelector('.payments-table-wrapper');

        if (tableWrapper) {
            tableWrapper.style.display = 'none';
        }
    } else {
        if (paymentsEmpty) {
            paymentsEmpty.style.display = 'none';
        }

        const tableWrapper = document.querySelector('.payments-table-wrapper');

        if (tableWrapper) {
            tableWrapper.style.display = 'block';
        }
    }

    currentPagePayments.forEach((payment) => {
        const status = getPaymentStatus(payment.status);

        const method = getPaymentMethod(payment.method);

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <span class="payment-reference">
                    ${payment.reference}
                </span>
            </td>

            <td>
                <span class="payment-document-name">
                    ${payment.document}
                </span>
            </td>

            <td>
                ${formatPaymentDate(payment.date)}
            </td>

            <td>
                <span class="payment-method ${method.class}">
                    <i class="${method.icon}"></i>
                    ${method.label}
                </span>
            </td>

            <td>
                <span class="payment-amount">
                    ${formatPaymentAmount(payment.amount)}
                </span>
            </td>

            <td>
                <span class="payment-status ${status.class}">
                    <i class="${status.icon}"></i>
                    ${status.label}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="payment-details-btn"
                    data-id="${payment.id}"
                >
                    <i class="fas fa-eye"></i>
                    Détails
                </button>
            </td>
        `;

        paymentsTableBody.appendChild(row);
    });

    // Boutons détails
    document.querySelectorAll('.payment-details-btn').forEach((button) => {
        button.addEventListener('click', () => {
            displayPaymentDetails(Number(button.dataset.id));
        });
    });

    // Pagination
    if (paymentsPageInformation) {
        paymentsPageInformation.textContent = `Page ${currentPaymentsPage} sur ${totalPages}`;
    }

    if (paymentsPreviousPage) {
        paymentsPreviousPage.disabled = currentPaymentsPage === 1;
    }

    if (paymentsNextPage) {
        paymentsNextPage.disabled = currentPaymentsPage === totalPages;
    }
}

// 10. RECHERCHE ET FILTRES
function filterPayments() {
    const searchValue = paymentSearch?.value.toLowerCase().trim() || '';

    const selectedStatus = paymentStatusFilter?.value || 'all';

    const selectedMethod = paymentMethodFilter?.value || 'all';

    filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.reference.toLowerCase().includes(searchValue) ||
            payment.transaction.toLowerCase().includes(searchValue) ||
            payment.document.toLowerCase().includes(searchValue) ||
            payment.requestReference.toLowerCase().includes(searchValue);

        const matchesStatus =
            selectedStatus === 'all' || payment.status === selectedStatus;

        const matchesMethod =
            selectedMethod === 'all' || payment.method === selectedMethod;

        return matchesSearch && matchesStatus && matchesMethod;
    });

    currentPaymentsPage = 1;

    displayPayments();
}

// 11. DÉTAILS TRANSACTION
function displayPaymentDetails(id) {
    const payment = payments.find((item) => item.id === id);

    if (!payment || !paymentDetailsOverlay || !paymentDetailsContent) {
        return;
    }

    const status = getPaymentStatus(payment.status);

    const method = getPaymentMethod(payment.method);

    paymentDetailsContent.innerHTML = `
        <div class="payment-detail-summary">

            <div class="payment-detail-icon">
                <i class="fas fa-receipt"></i>
            </div>

            <h3>${formatPaymentAmount(payment.amount)}</h3>

            <span class="payment-status ${status.class}">
                <i class="${status.icon}"></i>
                ${status.label}
            </span>

        </div>

        <div class="payment-detail-list">

            <div class="payment-detail-row">
                <span>Référence paiement</span>
                <strong>${payment.reference}</strong>
            </div>

            <div class="payment-detail-row">
                <span>Transaction</span>
                <strong>${payment.transaction}</strong>
            </div>

            <div class="payment-detail-row">
                <span>Document</span>
                <strong>${payment.document}</strong>
            </div>

            <div class="payment-detail-row">
                <span>Référence demande</span>
                <strong>${payment.requestReference}</strong>
            </div>

            <div class="payment-detail-row">
                <span>Date</span>
                <strong>${formatPaymentDate(payment.date)}</strong>
            </div>

            <div class="payment-detail-row">
                <span>Moyen de paiement</span>
                <strong>
                    <span class="payment-method ${method.class}">
                        <i class="${method.icon}"></i>
                        ${method.label}
                    </span>
                </strong>
            </div>

            <div class="payment-detail-row">
                <span>Montant</span>
                <strong>${formatPaymentAmount(payment.amount)}</strong>
            </div>

        </div>

        ${
            payment.status === 'paid'
                ? `
                    <button
                        type="button"
                        class="payment-receipt-btn"
                        id="downloadReceipt"
                    >
                        <i class="fas fa-download"></i>
                        Télécharger le reçu
                    </button>
                `
                : `
                    <div class="pending-payment-message">
                        <i class="fas fa-clock"></i>
                        Ce paiement est encore en attente de confirmation.
                    </div>
                `
        }
    `;

    paymentDetailsOverlay.classList.add('active');

    document.body.style.overflow = 'hidden';

    const receiptButton = document.getElementById('downloadReceipt');

    receiptButton?.addEventListener('click', () => {
        downloadPaymentReceipt(payment);
    });
}

// 12. SIMULATION DU REÇU
function downloadPaymentReceipt(payment) {
    if (payment.status !== 'paid') {
        alert('Un reçu ne peut être généré que pour un paiement confirmé.');

        return;
    }

    const method = getPaymentMethod(payment.method);

    const content = `
========================================
          COMMUNECONNECT
     SERVICES COMMUNAUX NUMÉRIQUES
========================================

             REÇU DE PAIEMENT

Référence : ${payment.reference}
Transaction : ${payment.transaction}

Document : ${payment.document}
Référence demande : ${payment.requestReference}

Date : ${formatPaymentDate(payment.date)}

Moyen de paiement : ${method.label}

Montant payé : ${formatPaymentAmount(payment.amount)}

Statut : PAYÉ

----------------------------------------
REÇU DE DÉMONSTRATION
Ce reçu est généré par le prototype frontend.
Il ne constitue pas une preuve de paiement réelle.
========================================
    `;

    const blob = new Blob([content], {
        type: 'text/plain',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download = `recu-${payment.reference}.txt`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert('Le reçu de démonstration a été téléchargé.');
}

// 13. FERMETURE MODAL
function closePaymentModal() {
    if (!paymentDetailsOverlay) return;

    paymentDetailsOverlay.classList.remove('active');

    document.body.style.overflow = '';
}

closePaymentDetails?.addEventListener('click', closePaymentModal);

paymentDetailsOverlay?.addEventListener('click', (event) => {
    if (event.target === paymentDetailsOverlay) {
        closePaymentModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closePaymentModal();
    }
});

// 14. PAGINATION
paymentsPreviousPage?.addEventListener('click', () => {
    if (currentPaymentsPage > 1) {
        currentPaymentsPage--;

        displayPayments();
    }
});

paymentsNextPage?.addEventListener('click', () => {
    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

    if (currentPaymentsPage < totalPages) {
        currentPaymentsPage++;

        displayPayments();
    }
});

// 15. ÉVÉNEMENTS FILTRES
paymentSearch?.addEventListener('input', filterPayments);

paymentStatusFilter?.addEventListener('change', filterPayments);

paymentMethodFilter?.addEventListener('change', filterPayments);

// 16. INITIALISATION
updatePaymentStatistics();

displayPayments();
