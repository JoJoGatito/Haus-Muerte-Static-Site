/**
 * Events Page JavaScript
 * Handles displaying featured upcoming events
 */

document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedEvents();
});

/**
 * Fetches and loads featured events
 */
function loadFeaturedEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    if (eventsContainer) {
        fetch('../data/events.json')
            .then(response => response.json())
            .then(data => {
                // Get upcoming featured events
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const upcomingEvents = data.events
                    .filter(event => new Date(event.date) >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 2); // Show only next 2 events
                
                // Display events
                if (upcomingEvents.length > 0) {
                    upcomingEvents.forEach(event => {
                        eventsContainer.appendChild(createEventCard(event));
                    });
                } else {
                    eventsContainer.innerHTML = `
                        <div class="gothic-frame text-center">
                            <h2>Next Event Coming Soon</h2>
                            <div class="gothic-divider">
                                <span class="divider-line"></span>
                                <i class="fas fa-crow"></i>
                                <span class="divider-line"></span>
                            </div>
                            <p>Stay tuned for our next dark elegance experience</p>
                        </div>
                    `;
                }
            })
            .catch(error => {
                console.error('Error loading events:', error);
                eventsContainer.innerHTML = '<p class="text-center">Failed to load events. Please try again later.</p>';
            });
    }
}

/**
 * Creates an event card element with badges
 * @param {Object} event - The event data
 * @return {HTMLElement} The event card element
 */
/**
 * Creates an event card element
 * @param {Object} event - The event data
 * @return {HTMLElement} The event card element
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.classList.add('event-card');
    
    // Get confirmed performers
    const storedData = localStorage.getItem('hausMuertePerformers');
    const performerData = storedData ? JSON.parse(storedData) : {};
    const confirmedPerformers = [];
    
    if (performerData[event.id]?.performers) {
        for (const [performer, confirmed] of Object.entries(performerData[event.id].performers)) {
            if (confirmed) {
                confirmedPerformers.push(performer);
            }
        }
    }
    
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const formattedTime = event.startTime + ' - ' + event.endTime;
    
    // Create card content
    card.innerHTML = `
        <div class="event-card-inner">
            <div style="position: relative;">
                <img src="${event.image}" alt="${event.title}" class="event-card-image">
            </div>
            <div class="event-card-content">
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-date">
                    <i class="far fa-calendar-alt"></i> ${formattedDate}<br>
                    <i class="far fa-clock"></i> ${formattedTime}
                </p>
                <p class="event-card-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                <p class="event-card-description">${event.shortDescription}</p>
                ${confirmedPerformers.length > 0 ? `
                <div class="event-performers gothic-frame">
                    <h4><i class="fas fa-theater-masks"></i> Featured Performers</h4>
                    <div class="gothic-divider">
                        <span class="divider-line"></span>
                        <i class="fas fa-skull"></i>
                        <span class="divider-line"></span>
                    </div>
                    <p class="performer-names">${confirmedPerformers.join(' • ')}</p>
                </div>
                ` : ''}
                <div class="event-card-actions">
                    <span class="event-card-price">${event.price === 0 ? 'Free' : '$' + event.price}</span>
                    <a href="${event.slug}.html" class="event-card-link">Enter the Darkness <i class="fas fa-skull"></i></a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}
