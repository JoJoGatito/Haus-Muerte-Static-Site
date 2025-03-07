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
    
    // Load featured events on the homepage
    loadFeaturedEvents();
});

/**
 * Fetches and displays featured events on the homepage
 */
function loadFeaturedEvents() {
    const featuredContainer = document.getElementById('featured-events-container');
    
    if (featuredContainer) {
        fetch('data/events.json')
            .then(response => response.json())
            .then(data => {
                // Filter featured events and limit to 3
                const featuredEvents = data.events
                    .filter(event => event.featured)
                    .slice(0, 3);
                
                if (featuredEvents.length > 0) {
                    featuredEvents.forEach(event => {
                        featuredContainer.appendChild(createEventCard(event));
                    });
                } else {
                    featuredContainer.innerHTML = '<p class="text-center">No featured events at this time.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading featured events:', error);
                featuredContainer.innerHTML = '<p class="text-center">Failed to load events. Please try again later.</p>';
            });
    }
}

/**
 * Creates an event card element
 * @param {Object} event - The event data
 * @return {HTMLElement} The event card element
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.classList.add('event-card');
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create card content
    card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-card-image">
        <div class="event-card-content">
            <span class="event-card-category ${event.category.toLowerCase()}">${event.category}</span>
            <h3 class="event-card-title">${event.title}</h3>
            <p class="event-card-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
            <p class="event-card-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p class="event-card-description">${event.shortDescription}</p>
            <div class="event-card-actions">
                <span class="event-card-price">${event.price === 0 ? 'Free' : '$' + event.price}</span>
                <a href="events/${event.slug}.html" class="event-card-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
    
    return card;
}

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
