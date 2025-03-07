/**
 * Calendar JavaScript for Event Platform
 * Initializes and configures the FullCalendar instance
 */

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        // Fetch events data from JSON file
        fetch('data/events.json')
            .then(response => response.json())
            .then(data => {
                initializeCalendar(calendarEl, data.events);
            })
            .catch(error => {
                console.error('Error loading events for calendar:', error);
                calendarEl.innerHTML = '<p class="text-center">Failed to load calendar. Please try again later.</p>';
            });
    }
});

/**
 * Initializes the FullCalendar with events
 * @param {HTMLElement} calendarEl - The calendar container element
 * @param {Array} events - The events data
 */
function initializeCalendar(calendarEl, events) {
    // Transform events data for FullCalendar
    const calendarEvents = events.map(event => {
        // Parse date and time
        const eventDate = new Date(event.date);
        const startTime = event.startTime ? event.startTime.split(':') : ['19', '00'];
        const endTime = event.endTime ? event.endTime.split(':') : ['22', '00'];
        
        // Set event start and end times
        const start = new Date(eventDate);
        start.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
        
        const end = new Date(eventDate);
        end.setHours(parseInt(endTime[0]), parseInt(endTime[1]));
        
        return {
            title: event.title,
            start: start,
            end: end,
            url: `events/${event.slug}.html`,
            classNames: [`event-${event.category.toLowerCase()}`],
            extendedProps: {
                category: event.category,
                location: event.location,
                description: event.shortDescription
            }
        };
    });
    
    // Initialize FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek'
        },
        events: calendarEvents,
        eventTimeFormat: {
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
        },
        eventDidMount: function(info) {
            // Add tooltip with event details
            const tooltip = document.createElement('div');
            tooltip.classList.add('event-tooltip');
            
            tooltip.innerHTML = `
                <strong>${info.event.title}</strong><br>
                <em>${info.event.extendedProps.category}</em><br>
                ${info.event.extendedProps.location}<br>
                ${info.event.extendedProps.description}
            `;
            
            info.el.title = info.event.title;
        },
        eventClick: function(info) {
            // Handle event clicks
            info.jsEvent.preventDefault(); // prevent browser navigation
            
            if (info.event.url) {
                window.location.href = info.event.url;
            }
        }
    });
    
    // Render the calendar
    calendar.render();
}
