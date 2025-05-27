// Workshop page functionality
document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.getElementById('form-container');
    if (!formContainer) return;

    // Create form elements
    function createForm() {
        const formEmbed = document.createElement('iframe');
        formEmbed.setAttribute('src', 'https://docs.google.com/forms/d/e/1FAIpQLSfXK7H_8kk4zXksXVCUSzDh1YwbvJ-GpS_2F9-t7rDRkqmuLQ/viewform?embedded=true');
        formEmbed.setAttribute('width', '100%');
        formEmbed.setAttribute('height', '600px'); // Initial height
        formEmbed.setAttribute('frameborder', '0');
        formEmbed.setAttribute('marginheight', '0');
        formEmbed.setAttribute('marginwidth', '0');
        formEmbed.setAttribute('title', 'Workshop Sign-up Form');
        formEmbed.style.transition = 'height 0.3s ease';

        // Add loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'form-loading';
        loadingDiv.textContent = 'Loading form...';
        formContainer.appendChild(loadingDiv);

        // Handle form loading
        formEmbed.onload = function() {
            loadingDiv.remove();
            resizeForm(formEmbed);
        };

        // Handle form errors
        formEmbed.onerror = function() {
            loadingDiv.textContent = 'Error loading form. Please refresh the page or try again later.';
            loadingDiv.style.color = 'var(--error-color)';
        };

        formContainer.appendChild(formEmbed);
        return formEmbed;
    }

    // Resize form based on content
    function resizeForm(formEmbed) {
        // Listen for messages from the Google Form
        window.addEventListener('message', function(event) {
            if (event.origin !== 'https://docs.google.com') return;
            
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'form-height') {
                    formEmbed.style.height = data.height + 'px';
                }
                // Handle form submission
                if (data.type === 'form-submit') {
                    showThankYouMessage();
                }
            } catch (e) {
                console.error('Error parsing form message:', e);
            }
        });
    }

    // Show thank you message after submission
    function showThankYouMessage() {
        formContainer.innerHTML = `
            <div class="thank-you-message">
                <h3>Thank You for Signing Up!</h3>
                <p>We're excited to have you join our workshop. You'll receive a confirmation email shortly.</p>
            </div>
        `;
    }

    // Initialize form
    createForm();
});