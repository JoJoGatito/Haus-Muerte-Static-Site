// Workshop page functionality
document.addEventListener('DOMContentLoaded', function() {
    if (formInitialized) {
        console.log('Form already initialized, skipping...');
        return;
    }
    formInitialized = true;
    console.log('Workshop script initialized');
    const formContainer = document.getElementById('form-container');
    if (!formContainer) return;

    // Create form elements
    function createForm() {
        console.log('Creating form...');
        
        // Form customization configuration
        const formId = '1FAIpQLSdnNGFAkgZuc84sPHKkfhDMAoM4c34lxmwJsYDzXHLxet2YGw';
        const theme = {
            backgroundColor: '0A0000', // --background-dark
            headerColor: '800000',     // --primary-color
            textColor: 'F0F0F0',       // --text-light
        };

        // Create customized form URL
        const customFormUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true&usp=pp_url` +
            `&theme=dark` +
            `&bc=${theme.backgroundColor}` +
            `&tc=${theme.textColor}` +
            `&ac=${theme.headerColor}`;

        // Log any existing iframes in the form container
        const existingIframes = formContainer.getElementsByTagName('iframe');
        console.log('Existing iframes in form container:', existingIframes.length);
        for (let i = 0; i < existingIframes.length; i++) {
            console.log('Existing iframe source:', existingIframes[i].src);
        }

        const formEmbed = document.createElement('iframe');
        formEmbed.setAttribute('src', customFormUrl);
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
            console.log('Form iframe loaded');
            loadingDiv.remove();
            resizeForm(formEmbed);
        };

        // Handle form errors
        formEmbed.onerror = function(error) {
            console.error('Form iframe error:', error);
            loadingDiv.textContent = 'Error loading form. Please refresh the page or try again later.';
            loadingDiv.style.color = 'var(--error-color)';
        };

        // Log when the iframe is actually added to the DOM
        console.log('Adding iframe to form container');

        formContainer.appendChild(formEmbed);
        return formEmbed;
    }

    // Resize form based on content
    // Store message handler reference so we can remove it if needed
    let messageHandler;
    
    function resizeForm(formEmbed) {
        // Remove any existing message handler
        if (messageHandler) {
            window.removeEventListener('message', messageHandler);
        }
        
        // Create new message handler
        messageHandler = function(event) {
            console.log('Received message from form:', event.data);
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
        };
        
        // Listen for messages from the Google Form
        window.addEventListener('message', messageHandler);
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