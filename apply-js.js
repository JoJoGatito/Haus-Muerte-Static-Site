/**
 * Apply Page JavaScript for Event Platform
 * Handles the performer application page and LimeSurvey integration
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the FAQ accordion
    initializeFaq();
    
    // Set up the LimeSurvey iframe
    setupLimeSurvey();
});

/**
 * Initializes the FAQ accordion functionality
 */
function initializeFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Toggle the active class
            item.classList.toggle('active');
            
            // Change the icon
            const icon = question.querySelector('.toggle-icon i');
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });
}

/**
 * Sets up the LimeSurvey iframe
 */
function setupLimeSurvey() {
    const limeSurveyFrame = document.getElementById('limesurvey-frame');
    
    if (limeSurveyFrame) {
        // Add load event listener
        limeSurveyFrame.addEventListener('load', function() {
            // Adjust iframe height based on content if possible
            try {
                const frameHeight = limeSurveyFrame.contentWindow.document.body.scrollHeight;
                limeSurveyFrame.style.height = frameHeight + 'px';
            } catch (e) {
                console.log('Could not adjust iframe height due to cross-origin restrictions');
            }
        });
        
        // Add message listener for communication with LimeSurvey
        window.addEventListener('message', function(event) {
            // Verify the origin of the message
            if (event.origin === 'https://your-limesurvey-instance.com') {
                // Check if it's a height message
                if (event.data && event.data.type === 'resize') {
                    limeSurveyFrame.style.height = event.data.height + 'px';
                }
                
                // Check if it's a submission complete message
                if (event.data && event.data.type === 'complete') {
                    // Show a thank you message
                    const formContainer = document.querySelector('.limesurvey-container');
                    formContainer.innerHTML = `
                        <div class="thank-you-message">
                            <div class="icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h2>Thank You!</h2>
                            <p>Your application has been submitted successfully.</p>
                            <p>Our team will review your application and get back to you within 2-3 weeks.</p>
                            <a href="../index.html" class="btn btn-primary">Return to Homepage</a>
                        </div>
                    `;
                }
            }
        });
    }
}

// Additional styling for the thank you message
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .thank-you-message {
            text-align: center;
            padding: var(--spacing-xl);
        }
        
        .thank-you-message .icon {
            font-size: 4rem;
            color: var(--success-color);
            margin-bottom: var(--spacing-md);
        }
        
        .thank-you-message h2 {
            margin-bottom: var(--spacing-md);
        }
        
        .thank-you-message p {
            margin-bottom: var(--spacing-md);
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
    </style>
`);
