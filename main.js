
// assets/js/main.js

document.addEventListener('DOMContentLoaded', function() {
    
    // Generic confirmation for delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete-confirm');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const message = this.getAttribute('data-confirm-message') || 'Are you sure you want to delete this item?';
            if (!confirm(message)) {
                event.preventDefault();
            }
        });
    });

    // Share button functionality
    const shareButton = document.getElementById('share-btn');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            const tripId = this.getAttribute('data-trip-id');
            const feedbackEl = document.getElementById('feedback-message');
            this.disabled = true;
            this.textContent = 'Generating Link...';

            fetch(`/share-trip.php?action=generate_token&id=${tripId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const shareUrl = `${window.location.origin}/share-trip.php?token=${data.token}`;
                        
                        // Copy to clipboard
                        navigator.clipboard.writeText(shareUrl).then(() => {
                            feedbackEl.textContent = 'Share link copied to clipboard!';
                            feedbackEl.style.display = 'block';
                        }, () => {
                            feedbackEl.textContent = `Your share link: ${shareUrl}`;
                            feedbackEl.className = 'alert alert-warning';
                            feedbackEl.style.display = 'block';
                        });

                    } else {
                        feedbackEl.textContent = 'Could not generate share link. Please try again.';
                        feedbackEl.className = 'alert alert-danger';
                        feedbackEl.style.display = 'block';
                    }
                })
                .catch(error => {
                    console.error('Share error:', error);
                    feedbackEl.textContent = 'An error occurred. Please try again.';
                    feedbackEl.className = 'alert alert-danger';
                    feedbackEl.style.display = 'block';
                })
                .finally(() => {
                    this.disabled = false;
                    this.textContent = 'Share Plan';
                    setTimeout(() => { feedbackEl.style.display = 'none'; }, 5000);
                });
        });
    }
});
