class AdminPanel {
    constructor() {
        this.githubToken = localStorage.getItem('github_token');
        this.octokit = null;
        this.repo = {
            owner: 'yordan-hristov',
            repo: 'Haus-Muerte-Static-Site',
            path: 'data/events.json'
        };

        this.initializeUI();
        this.setupEventListeners();
    }

    initializeUI() {
        this.loginSection = document.getElementById('login-section');
        this.adminPanel = document.getElementById('admin-panel');
        this.eventsSection = document.getElementById('events-section');
        this.rehearsalsSection = document.getElementById('rehearsals-section');
        this.performersSection = document.getElementById('performers-section');
        
        if (this.githubToken) {
            this.initializeGitHub();
        }
    }

    setupEventListeners() {
        // Auth form submission
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('logout').addEventListener('click', () => this.handleLogout());

        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Add buttons
        document.getElementById('add-event').addEventListener('click', () => this.showEventModal());
        document.getElementById('add-rehearsal').addEventListener('click', () => this.showRehearsalModal());
        document.getElementById('add-performer').addEventListener('click', () => this.showPerformerModal());

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        // Form submissions
        document.getElementById('event-form').addEventListener('submit', (e) => this.handleEventSubmit(e));
    }

    async initializeGitHub() {
        try {
            this.octokit = new Octokit({
                auth: this.githubToken
            });
            
            // Test the token by making a simple API call
            await this.octokit.rest.users.getAuthenticated();
            this.showAdminPanel();
            await this.loadData();
        } catch (error) {
            console.error('GitHub initialization error:', error);
            this.handleLogout();
            this.showError('Invalid GitHub token. Please try again.');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const token = document.getElementById('github-token').value.trim();
        if (!token) {
            this.showError('Please enter a GitHub token');
            return;
        }
        
        localStorage.setItem('github_token', token);
        this.githubToken = token;
        this.initializeGitHub();
    }

    handleLogout() {
        localStorage.removeItem('github_token');
        window.location.reload();
    }

    showAdminPanel() {
        if (!this.loginSection || !this.adminPanel) {
            console.error('Required DOM elements not found');
            return;
        }
        
        this.loginSection.classList.add('hidden');
        this.adminPanel.classList.remove('hidden');
        
        // Show events section by default
        document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
        this.eventsSection.classList.remove('hidden');
        
        // Set events button as active
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.nav-btn[data-section="events"]').classList.add('active');
    }

    handleNavigation(e) {
        const section = e.target.dataset.section;
        
        // Update active button
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Show selected section
        document.querySelectorAll('.content-section').forEach(section => section.classList.add('hidden'));
        document.getElementById(`${section}-section`).classList.remove('hidden');
    }

    async loadData() {
        try {
            const response = await this.octokit.rest.repos.getContent({
                owner: this.repo.owner,
                repo: this.repo.repo,
                path: this.repo.path
            });
            
            if (!response.data || !response.data.content) {
                throw new Error('No content received from GitHub');
            }

            const content = JSON.parse(atob(response.data.content));
            
            if (!content.events || !content.rehearsals || !content.defaultPerformers) {
                throw new Error('Invalid data structure');
            }

            this.renderEvents(content.events);
            this.renderRehearsals(content.rehearsals);
            this.renderPerformers(content.defaultPerformers);
        } catch (error) {
            console.error('Data loading error:', error);
            this.showError('Failed to load data: ' + error.message);
        }
    }

    renderEvents(events) {
        const eventsList = document.getElementById('events-list');
        eventsList.innerHTML = events.map(event => `
            <div class="list-item" data-id="${event.id}">
                <div>
                    <h3>${event.title}</h3>
                    <p>${event.date} | ${event.startTime} - ${event.endTime}</p>
                </div>
                <div>
                    <button class="btn-secondary edit-event">Edit</button>
                    <button class="btn-danger delete-event">Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners for edit and delete buttons
        eventsList.querySelectorAll('.edit-event').forEach(btn => {
            btn.addEventListener('click', (e) => this.editEvent(e.target.closest('.list-item').dataset.id));
        });

        eventsList.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteEvent(e.target.closest('.list-item').dataset.id));
        });
    }

    renderRehearsals(rehearsals) {
        const rehearsalsList = document.getElementById('rehearsals-list');
        rehearsalsList.innerHTML = rehearsals.map(rehearsal => `
            <div class="list-item" data-id="${rehearsal.id}">
                <div>
                    <h3>${rehearsal.title}</h3>
                    <p>${rehearsal.date} | ${rehearsal.time}</p>
                </div>
                <div>
                    <button class="btn-secondary edit-rehearsal">Edit</button>
                    <button class="btn-danger delete-rehearsal">Delete</button>
                </div>
            </div>
        `).join('');
    }

    renderPerformers(performers) {
        const performersList = document.getElementById('performers-list');
        performersList.innerHTML = performers.map(performer => `
            <div class="list-item">
                <div>
                    <h3>${performer}</h3>
                </div>
                <div>
                    <button class="btn-danger delete-performer">Delete</button>
                </div>
            </div>
        `).join('');
    }

    async saveData(data) {
        try {
            // Validate data structure before saving
            if (!data.events || !data.rehearsals || !data.defaultPerformers) {
                throw new Error('Invalid data structure');
            }

            const content = btoa(JSON.stringify(data, null, 2));
            const currentFile = await this.octokit.rest.repos.getContent({
                owner: this.repo.owner,
                repo: this.repo.repo,
                path: this.repo.path
            });
            
            if (!currentFile.data || !currentFile.data.sha) {
                throw new Error('Failed to get current file data');
            }

            await this.octokit.rest.repos.createOrUpdateFileContents({
                owner: this.repo.owner,
                repo: this.repo.repo,
                path: this.repo.path,
                message: 'Update events and performers',
                content: content,
                sha: currentFile.data.sha
            });

            this.showSuccess('Changes saved successfully');
            await this.loadData(); // Reload data to show updated content
        } catch (error) {
            console.error('Save error:', error);
            this.showError('Failed to save changes: ' + error.message);
        }
    }

    showEventModal(event = null) {
        const modal = document.getElementById('event-modal');
        const form = document.getElementById('event-form');

        if (event) {
            // Populate form for editing
            form.elements['event-title'].value = event.title;
            form.elements['event-date'].value = event.date;
            form.elements['event-start'].value = event.startTime;
            form.elements['event-end'].value = event.endTime;
            form.elements['event-location'].value = event.location;
            form.elements['event-description'].value = event.description;
            form.elements['event-price'].value = event.price;
        } else {
            form.reset();
        }

        modal.classList.remove('hidden');
    }

    closeModal(modal) {
        modal.classList.add('hidden');
    }

    showSuccess(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message success';
        messageDiv.textContent = message;
        this.adminPanel.insertBefore(messageDiv, this.adminPanel.firstChild);
        setTimeout(() => messageDiv.remove(), 3000);
    }

    showError(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message error';
        messageDiv.textContent = message;
        this.adminPanel.insertBefore(messageDiv, this.adminPanel.firstChild);
        setTimeout(() => messageDiv.remove(), 3000);
    }
}

// Initialize admin panel when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});