/**
 * Main JavaScript for Event Platform
 * Contains common functionality used across the site
 */

document.addEventListener('DOMContentLoaded', function() {
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
