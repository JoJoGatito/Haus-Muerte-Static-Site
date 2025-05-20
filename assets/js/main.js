/**
 * Main JavaScript for Event Platform
 * Contains common functionality used across the site
 */

// Throttle function to limit execution rate
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced parallax effect for featured image
    const featuredImage = document.querySelector('.featured-image-wrapper');
    if (featuredImage) {
        let ticking = false;
        let lastScrollY = window.pageYOffset;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const speed = 0.4; // Adjust for smoother movement
            const yPos = -(scrolled * speed);
            
            // Use transform3d for better performance
            featuredImage.style.transform = `translate3d(0, ${yPos}px, 0)`;
            
            // Add scale effect based on scroll position
            const scale = Math.max(1, 1 + (scrolled * 0.0005));
            featuredImage.querySelector('.featured-image').style.transform = `scale(${scale})`;
            
            ticking = false;
        };

        // Throttled scroll handler using requestAnimationFrame
        const onScroll = throttle(() => {
            lastScrollY = window.pageYOffset;
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        }, 10);

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // FAQ accordion on the apply page
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
    
    // Social share buttons on event pages
    const shareBtns = document.querySelectorAll('.share-btn');
    
    if (shareBtns.length > 0) {
        shareBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                
                if (this.classList.contains('facebook')) {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, 'facebook-share', 'width=580,height=296');
                } else if (this.classList.contains('twitter')) {
                    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, 'twitter-share', 'width=550,height=235');
                } else if (this.classList.contains('email')) {
                    window.location.href = `mailto:?subject=${title}&body=Check out this event: ${url}`;
                } else if (this.classList.contains('copy')) {
                    navigator.clipboard.writeText(window.location.href)
                        .then(() => {
                            alert('Link copied to clipboard!');
                        })
                        .catch(err => {
                            console.error('Failed to copy link: ', err);
                        });
                }
            });
        });
    }
    
    // Modal functionality for event flyer
    const modal = document.getElementById('flyer-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = modal.querySelector('.modal-close');
    const thumbnailButton = document.querySelector('.flyer-thumbnail-button');
    
    // Open modal when thumbnail is clicked
    thumbnailButton.addEventListener('click', function() {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        modal.setAttribute('aria-hidden', 'false');
        modalClose.focus(); // Focus the close button for accessibility
    });
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
        modal.setAttribute('aria-hidden', 'true');
        thumbnailButton.focus(); // Return focus to thumbnail
    }
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking on overlay
    modalOverlay.addEventListener('click', closeModal);
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
    
    // Trap focus within modal when open (accessibility)
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab' && modal.classList.contains('open')) {
            e.preventDefault();
            modalClose.focus();
        }
    });
});

/**
 * Formats a date object into a readable string
 * @param {Date} date - The date to format
 * @param {boolean} includeTime - Whether to include the time
 * @return {string} The formatted date string
 */
function formatDate(date, includeTime = false) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
}
