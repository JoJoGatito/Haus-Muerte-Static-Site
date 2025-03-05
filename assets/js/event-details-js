/**
 * Event Details JavaScript for Event Platform
 * Loads and displays detailed information for a single event
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the event slug from the URL
    const slug = getEventSlugFromUrl();
    
    if (slug) {
        loadEventDetails(slug);
    } else {
        console.error('Event slug not found in URL');
    }
});

/**
 * Extracts the event slug from the current URL
 * @return {string|null} The event slug or null if not found
 */
function getEventSlugFromUrl() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename && filename.endsWith('.html')) {
        return filename.replace('.html', '');
    }
    
    return null;
}

/**
 * Loads event details from the events.json file
 * @param {string} slug - The event slug
 */
function loadEventDetails(slug) {
    fetch('/data/events.json')
        .then(response => response.json())
        .then(data => {
            // Find the event with matching slug
            const event = data.events.find(e => e.slug === slug);
            
            if (event) {
                displayEventDetails(event);
                loadRelatedEvents(event, data.events);
                initializePretixWidget(event);
            } else {
                console.error(`Event with slug "${slug}" not found`);
                document.body.innerHTML = '<div class="container text-center"><h1>Event Not Found</h1><p>The event you are looking for does not exist or has been removed.</p><a href="/events/index.html" class="btn btn-primary">View All Events</a></div>';
            }
        })
        .catch(error => {
            console.error('Error loading event details:', error);
        });
}

/**
 * Displays the event details on the page
 * @param {Object} event - The event data
 */
function displayEventDetails(event) {
    // Set page title
    document.title = `${event.title} | Haus Muerte`;
    
    // Set event banner image
    document.querySelector('.event-banner').style.backgroundImage = `url('${event.bannerImage || event.image}')`;
    
    // Set event details
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-category').textContent = event.category;
    
    // Format and set date
    const eventDate = new Date(event.date);
    document.getElementById('event-date').textContent = formatDate(eventDate);
    
    // Set time
    const startTime = event.startTime || '19:00';
    const endTime = event.endTime || '22:00';
    document.getElementById('event-time').textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    
    // Set location
    document.getElementById('event-location').textContent = event.location;
    
    // Set description
    const descriptionContent = document.getElementById('event-description-content');
    descriptionContent.innerHTML = event.description || event.shortDescription;
    
    // Set performers
    const performersList = document.getElementById('event-performers-list');
    
    if (event.performers && event.performers.length > 0) {
        performersList.innerHTML = '';
        
        event.performers.forEach(performer => {
            const performerCard = document.createElement('div');
            performerCard.classList.add('performer-card');
            
            performerCard.innerHTML = `
                <img src="${performer.image}" alt="${performer.name}" class="performer-image">
                <h3 class="performer-name">${performer.name}</h3>
                <p class="performer-role">${performer.role}</p>
            `;
            
            performersList.appendChild(performerCard);
        });
    } else {
        document.querySelector('.event-performers').style.display = 'none';
    }
    
    // Set schedule
    const scheduleContent = document.getElementById('event-schedule-content');
    
    if (event.schedule && event.schedule.length > 0) {
        scheduleContent.innerHTML = '';
        
        event.schedule.forEach(item => {
            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');
            
            scheduleItem.innerHTML = `
                <div class="schedule-time">${formatTime(item.time)}</div>
                <div class="schedule-content">
                    <h4 class="schedule-title">${item.title}</h4>
                    <p class="schedule-description">${item.description}</p>
                </div>
            `;
            
            scheduleContent.appendChild(scheduleItem);
        });
    } else {
        document.querySelector('.event-schedule').style.display = 'none';
    }
    
    // Set venue details
    const venueDetails = document.getElementById('venue-details');
    
    if (event.venue) {
        venueDetails.innerHTML = `
            <p class="venue-address"><i class="fas fa-map-marker-alt"></i> ${event.venue.address}</p>
            <p><i class="fas fa-phone"></i> ${event.venue.phone}</p>
            <p><i class="fas fa-globe"></i> <a href="${event.venue.website}" target="_blank">${event.venue.websiteLabel || 'Visit Website'}</a></p>
        `;
        
        // Set venue map
        const mapContainer = document.getElementById('venue-map');
        mapContainer.innerHTML = `
            <iframe 
                src="https://maps.google.com/maps?q=${encodeURIComponent(event.venue.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                allowfullscreen
            ></iframe>
        `;
    } else {
        document.querySelector('.venue-info').style.display = 'none';
    }
}

/**
 * Loads and displays related events
 * @param {Object} currentEvent - The current event
 * @param {Array} allEvents - All events data
 */
function loadRelatedEvents(currentEvent, allEvents) {
    const relatedContainer = document.getElementById('related-events-container');
    
    if (relatedContainer) {
        // Filter events in the same category, excluding the current event
        let relatedEvents = allEvents.filter(event => 
            event.slug !== currentEvent.slug && 
            event.category === currentEvent.category
        );
        
        // If not enough related events in the same category, add some other upcoming events
        if (relatedEvents.length < 3) {
            const otherEvents = allEvents.filter(event => 
                event.slug !== currentEvent.slug && 
                event.category !== currentEvent.category &&
                new Date(event.date) >= new Date()
            );
            
            relatedEvents = [...relatedEvents, ...otherEvents].slice(0, 3);
        } else {
            relatedEvents = relatedEvents.slice(0, 3);
        }
        
        // Display related events
        if (relatedEvents.length > 0) {
            relatedContainer.innerHTML = '';
            
            relatedEvents.forEach(event => {
                relatedContainer.appendChild(createEventCard(event));
            });
        } else {
            // Hide the related events section if no related events found
            document.querySelector('.related-events').style.display = 'none';
        }
    }
}

/**
 * Initializes the Pretix widget
 * @param {Object} event - The event data
 */
function initializePretixWidget(event) {
    const widgetContainer = document.getElementById('pretix-widget-container');
    
    if (widgetContainer && event.pretixEvent) {
        // Update the widget script source if needed
        const scriptElement = document.querySelector('script[src*="pretix"]');
        if (scriptElement) {
            scriptElement.src = `https://pretix.eu/widget/v1.en.js`;
        }
        
        // Initialize the Pretix widget
        const config = {
            eventSlug: event.pretixEvent.eventSlug,
            organizerSlug: event.pretixEvent.organizerSlug,
            baseUrl: 'https://pretix.eu/',
            elementId: 'pretix-widget-container',
            voucher: event.pretixEvent.voucher || null,
            subeventId: event.pretixEvent.subeventId || null
        };
        
        // Add widget initialization to page
        const initScript = document.createElement('script');
        initScript.textContent = `
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof pretixWidget !== 'undefined') {
                    pretixWidget.init(${JSON.stringify(config)});
                } else {
                    console.error('Pretix widget script not loaded');
                }
            });
        `;
        
        document.body.appendChild(initScript);
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
    const formattedDate = formatDate(eventDate, false);
    
    // Create card content
    card.innerHTML = `
        <img src="${event.image}" alt="${event.title}" class="event-card-image">
        <div class="event-card-content">
            <span class="event-card-category ${event.category.toLowerCase()}">${event.category}</span>
            <h3 class="event-card-title">${event.title}</h3>
            <p class="event-card-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
            <p class="event-card-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <div class="event-card-actions">
                <span class="event-card-price">${event.price === 0 ? 'Free' : '
  + event.price}</span>
                <a href="/events/${event.slug}.html" class="event-card-link">View Details <i class="fas fa-arrow-right"></i></a>
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

/**
 * Formats a time string (HH:MM) into a readable format
 * @param {string} timeString - The time string in format HH:MM
 * @return {string} The formatted time string
 */
function formatTime(timeString) {
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create a date object for today with the specified time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    // Format the time (e.g., "7:30 PM")
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

 