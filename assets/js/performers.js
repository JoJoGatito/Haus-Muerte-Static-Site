// Performer Management System

// Global handler for checkbox clicks
window.handlePerformerClick = function(checkbox) {
    console.log('Global click handler:', {
        id: checkbox.id,
        eventId: checkbox.dataset.eventId,
        performer: checkbox.dataset.performer,
        checked: checkbox.checked
    });
};

// Local Storage Keys
const STORAGE_KEY = 'hausMuertePerformers';

// Default performers (gothic-themed names)
const DEFAULT_PERFORMERS = [
    "Lady Ravenna Nightshade",
    "Baron Viktor Blackthorn",
    "Madame Isabella Crimson",
    "Count Dorian Graves"
];

class PerformerManager {
    constructor() {
        this.events = [];
        this.rehearsals = [];
        this.storageData = this.loadFromStorage();
        
        // Debug logging
        console.log('PerformerManager initialized');
        console.log('Initial storage data:', JSON.stringify(this.storageData, null, 2));
    }

    async initialize() {
        await this.loadEvents();
        this.displayEvents();
        this.displayRehearsals();
    }

    async loadEvents() {
        try {
            console.log('Loading events from JSON...');
            const response = await fetch('/data/events.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Loaded events data:', data);
            
            // Debug storage data
            console.log('Current storage data:', this.storageData);
            
            // Filter out past events
            const now = new Date();
            this.events = data.events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= now;
            });
            
            console.log('Filtered future events:', this.events.length);

            // Sort events by date
            this.events.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Add rehearsals if they exist in the JSON
            this.rehearsals = data.rehearsals || [];
            this.rehearsals.sort((a, b) => new Date(a.date) - new Date(b.date));
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    loadFromStorage() {
        try {
            console.log('Attempting to load from storage key:', STORAGE_KEY);
            const stored = localStorage.getItem(STORAGE_KEY);
            console.log('Raw storage value:', stored);
            
            if (!stored) {
                console.log('No data found in storage');
                return {};
            }

            const data = JSON.parse(stored);
            console.log('Successfully parsed storage data:', data);
            return data;
        } catch (error) {
            console.error('Error loading from storage:', error);
            return {};
        }
    }

    saveToStorage() {
        try {
            console.log('Attempting to save data:', this.storageData);
            const jsonData = JSON.stringify(this.storageData);
            console.log('Stringified data:', jsonData);
            
            localStorage.setItem(STORAGE_KEY, jsonData);
            
            // Verify save
            const saved = localStorage.getItem(STORAGE_KEY);
            console.log('Verification - read back from storage:', saved);
            
            if (saved !== jsonData) {
                console.error('Storage verification failed - data mismatch');
            }
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    getPerformerStatus(eventId, performerName) {
        console.log('Getting status for:', { eventId, performerName });
        // Convert eventId to storage format
        const strEventId = `event-${eventId}`;
        const status = this.storageData[strEventId]?.performers?.[performerName] || false;
        console.log('Status:', status);
        return status;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        // Add styles
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.color = '#fff';
        notification.style.backgroundColor = type === 'success' ? '#2c8a3d' : '#8a2c2c';
        notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease';

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    handleCheckboxChange(event) {
        const checkbox = event.target;
        const eventId = checkbox.dataset.eventId;
        const performerName = checkbox.dataset.performer;
        const row = checkbox.closest('.performer-row');

        try {
            // Convert eventId to string to match storage format
            const strEventId = `event-${eventId}`;
            
            // Initialize storage structure if needed
            if (!this.storageData[strEventId]) {
                this.storageData[strEventId] = { performers: {} };
            }
            if (!this.storageData[strEventId].performers) {
                this.storageData[strEventId].performers = {};
            }

            // Update storage
            this.storageData[strEventId].performers[performerName] = checkbox.checked;
            this.saveToStorage();

            // Visual feedback
            row.style.transition = 'background-color 0.3s ease';
            row.style.backgroundColor = checkbox.checked ? 'rgba(44, 138, 61, 0.2)' : 'transparent';
            setTimeout(() => {
                row.style.backgroundColor = 'transparent';
            }, 500);

            // Show success notification
            const event = this.events.find(e => e.id === Number(eventId));
            if (!event) {
                throw new Error(`Event not found with ID: ${eventId}`);
            }
            this.showNotification(
                `${performerName} ${checkbox.checked ? 'confirmed' : 'unconfirmed'} for ${event.title}`,
                'success'
            );

        } catch (error) {
            console.error('Error updating performer status:', error.message);
            // Revert checkbox state
            checkbox.checked = !checkbox.checked;
            // Show error notification
            this.showNotification('Failed to update performer status. Please try again.', 'error');
        }
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatTime(timeStr) {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    displayEvents() {
        const container = document.querySelector('.events-list');
        if (!container) {
            console.error('Events container not found');
            return;
        }
        
        console.log('Displaying events:', this.events);
        console.log('Container found at:', container.getBoundingClientRect());

        container.innerHTML = '';

        this.events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'event-item';
            
            const date = this.formatDate(event.date);
            const startTime = this.formatTime(event.startTime);
            const endTime = this.formatTime(event.endTime);

            eventElement.innerHTML = `
                <h2>${event.title}</h2>
                <p class="event-details">
                    ${date}<br>
                    ${startTime} - ${endTime}<br>
                    ${event.location}
                </p>
                <div class="performers-list">
                    <h3>Performers</h3>
                    ${DEFAULT_PERFORMERS.map(performer => {
                        const eventId = event.id;
                        const performerId = `${eventId}-${performer.replace(/\s+/g, '-')}`;
                        const isConfirmed = this.getPerformerStatus(eventId, performer);
                        return `
                            <div class="performer-checkbox" data-performer-id="${performerId}">
                                <div class="performer-row">
                                    <div class="checkbox-container">
                                        <input type="checkbox"
                                            id="${performerId}"
                                            data-event-id="${eventId}"
                                            data-performer="${performer}"
                                            ${isConfirmed ? 'checked' : ''}
                                        >
                                        <span class="gothic-checkbox">
                                            <i class="fas fa-skull"></i>
                                        </span>
                                    </div>
                                    <label for="${performerId}">
                                        ${performer}
                                        ${isConfirmed ? '<i class="fas fa-crow" style="color: var(--accent-color); margin-left: 8px;"></i>' : ''}
                                    </label>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Add event listeners
            const manager = this;
            const performerRows = eventElement.querySelectorAll('.performer-row');
            performerRows.forEach(row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                
                // Handle row click
                row.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Row clicked:', {
                        eventId: checkbox.dataset.eventId,
                        performer: checkbox.dataset.performer
                    });
                    checkbox.checked = !checkbox.checked;
                    manager.handleCheckboxChange({ target: checkbox });
                });
                
                // Handle direct checkbox changes
                checkbox.addEventListener('change', function(e) {
                    e.stopPropagation();
                    console.log('Checkbox changed:', {
                        eventId: this.dataset.eventId,
                        performer: this.dataset.performer,
                        checked: this.checked
                    });
                    manager.handleCheckboxChange(e);
                });
            });

            container.appendChild(eventElement);
        });
    }

    displayRehearsals() {
        const container = document.querySelector('.rehearsals-list');
        if (!container) {
            console.error('Rehearsals container not found');
            return;
        }
        
        if (!this.rehearsals.length) {
            console.log('No rehearsals to display');
            container.innerHTML = '<p class="no-rehearsals">No upcoming rehearsals scheduled.</p>';
            return;
        }
        
        console.log('Displaying rehearsals:', this.rehearsals);

        container.innerHTML = this.rehearsals.map(rehearsal => `
            <div class="rehearsal-item">
                <h3><i class="fas fa-theater-masks"></i> ${rehearsal.title}</h3>
                <p>
                    <i class="far fa-calendar-alt"></i> ${this.formatDate(rehearsal.date)}<br>
                    <i class="far fa-clock"></i> ${rehearsal.time}<br>
                    <i class="fas fa-map-marker-alt"></i> ${rehearsal.location}
                </p>
            </div>
        `).join('');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const manager = new PerformerManager();
    manager.initialize();

    // Initialize the manager
});