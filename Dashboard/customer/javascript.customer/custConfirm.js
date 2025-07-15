// JavaScript to handle modal and receipt upload
document.addEventListener('DOMContentLoaded', function() {
    const confirmBtn = document.getElementById('confirm-btn');
    const modal = document.getElementById('paymentModal');
    const closeModal = document.getElementById('close-modal');
    const receiptUpload = document.getElementById('receipt-upload');
    const bookBtn = document.getElementById('book-btn');

    if (confirmBtn && modal) {
        confirmBtn.onclick = function() {
            modal.style.display = "block";
        }
    }

    if (closeModal && modal) {
        closeModal.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (modal && event.target == modal) {
            modal.style.display = "none";
        }
    }

    if (receiptUpload && bookBtn) {
        receiptUpload.onchange = function() {
            if (this.files.length > 0) {
                bookBtn.disabled = false;
                bookBtn.classList.add('enabled');
            } else {
                bookBtn.disabled = true;
                bookBtn.classList.remove('enabled');
            }
        }
    }
});