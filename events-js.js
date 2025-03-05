/**
 * Events Page JavaScript for Event Platform
 * Handles the event listing, filtering, and pagination
 */

// Global variables
let allEvents = [];
let filteredEvents = [];
let eventsPerPage = 6;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    // Load events data
    loadEvents();
    
    // Set up event listeners for filters
    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-events');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterEvents);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterEvents);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }
    
    // Set up load more button
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreEvents);
    }
});

/**
 * Fetches and loads events data
 */
function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    
    if (eventsContainer) {
        fetch('/data/events.json')
            .then(response => response.json())
            .then(data => {
                // Store all events
                allEvents = data.events;
                
                // Initial filtering
                filterEvents();
            })
            .catch(error => {
                console.error('Error loading events:', error);
                eventsContainer.innerHTML = '<p class="text-center">Failed to load events. Please try again later.</p>';
            });
    }
}

/**
 * Filters events based on current filter selections
 */
function filterEvents() {
    const categoryFilter = document.getElementById('category-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-events');
    
    // Get filter values
    const category = categoryFilter ? categoryFilter.value : 'all';
    const dateRange = dateFilter ? dateFilter.value : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Filter events
    filteredEvents = allEvents.filter(event => {
        // Category filter
        if (category !== 'all' && event.category.toLowerCase() !== category) {
            return false;
        }
        
        // Date filter
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight
        
        if (dateRange === 'today') {
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            if (eventDate < today || eventDate > todayEnd) {
                return false;
            }
        } else if (dateRange === 'this-week') {
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            if (eventDate < today || eventDate > weekEnd) {
                return false;
            }
        } else if (dateRange === 'this-month') {
            const monthEnd = new Date(today);
            monthEnd.setMonth(today.getMonth() + 1);
            if (eventDate < today || eventDate > monthEnd) {
                return false;
            }
        } else if (dateRange === 'next-month') {
            const nextMonthStart = new Date(today);
            nextMonthStart.setMonth(today.getMonth() + 1);
            
            const nextMonthEnd = new Date(nextMonthStart);
            nextMonthEnd.setMonth(nextMonthStart.getMonth() + 1);
            
            if (eventDate < nextMonthStart || eventDate > nextMonthEnd) {
                return false;
            }
        }
        
        // Search filter
        if (searchTerm && !event.title.toLowerCase().includes(searchTerm) &&
            !event.shortDescription.toLowerCase().includes(searchTerm) &&
            !event.location.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });
    
    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Reset pagination
    currentPage = 1;
    
    // Display events
    displayEvents();
}

/**
 * Displays the filtered events with pagination
 */
function displayEvents() {
    const eventsContainer = document.getElementById('events-container');
    const noEventsMessage = document.getElementById('no-events-message');
    const loadMoreBtn = document.getElementById('load-more');
    
    if (eventsContainer) {
        // Clear container
        eventsContainer.innerHTML = '';
        
        // Show message if no events found
        if (filteredEvents.length === 0) {
            if (noEventsMessage) {
                noEventsMessage.classList.remove('hidden');
            }
            if (loadMoreBtn) {
                loadMoreBtn.classList.add('hidden');
            }
            return;
        }
        
        // Hide no events message
        if (noEventsMessage) {
            noEventsMessage.classList.add('hidden');
        }
        
        // Display events for current page
        const eventsToShow = filteredEvents.slice(0, currentPage * eventsPerPage);
        
        eventsToShow.forEach(event => {
            eventsContainer.appendChild(createEventCard(event));
        });
        
        // Show/hide load more button
        if (loadMoreBtn) {
            if (eventsToShow.length < filteredEvents.length) {
                loadMoreBtn.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    }
}

/**
 * Creates an event card element with badges
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
    
    // Add badges if needed
    let badges = '';
    if (event.featured) {
        badges += '<span class="event-badge featured">Featured</span>';
    }
    if (event.soldOut) {
        badges += '<span class="event-badge sold-out">Sold Out</span>';
    } else if (event.fewTickets) {
        badges += '<span class="event-badge few-tickets">Few Tickets Left</span>';
    }
    
    // Create card content
    card.innerHTML = `
        <div style="position: relative;">
            <img src="${event.image}" alt="${event.title}" class="event-card-image">
            ${badges ? `<div class="event-card-badges">${badges}</div>` : ''}
        </div>
        <div class="event-card-content">
            <span class="event-card-category ${event.category.toLowerCase()}">${event.category}</span>
            <h3 class="event-card-title">${event.title}</h3>
            <p class="event-card-date"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
            <p class="event-card-location"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p class="event-card-description">${event.shortDescription}</p>
            <div class="event-card-actions">
                <span class="event-card-price">${event.price === 0 ? 'Free' : '$' + event.price}</span>
                <a href="/events/${event.slug}.html" class="event-card-link">View Details <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Loads more events when clicking the load more button
 */
function loadMoreEvents() {
    currentPage++;
    displayEvents();
}
