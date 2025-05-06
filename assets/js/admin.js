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
        console.log('Setting up event listeners');
        
        // GitHub login button
        const loginButton = document.getElementById('github-login');
        if (loginButton) {
            console.log('Login button found, adding click handler');
            loginButton.addEventListener('click', () => this.handleLoginClick());
        } else {
            console.error('Login button not found');
        }
        
        // Logout button
        const logoutButton = document.getElementById('logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => this.handleLogout());
        }

        // Navigation and other buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        document.getElementById('add-event')?.addEventListener('click', () => this.showEventModal());
        document.getElementById('add-rehearsal')?.addEventListener('click', () => this.showRehearsalModal());
        document.getElementById('add-performer')?.addEventListener('click', () => this.showPerformerModal());

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.closeModal(e.target.closest('.modal')));
        });

        document.getElementById('event-form')?.addEventListener('submit', (e) => this.handleEventSubmit(e));
    }

    async initializeGitHub() {
        try {
            console.log('Testing GitHub token...');
            // Test the token by making a simple API call
            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('GitHub API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
            }
            
            const userData = await response.json();
            console.log('Token validated successfully for user:', userData.login);
            
            // Verify repository access
            console.log('Verifying repository access...');
            const repoResponse = await fetch(`https://api.github.com/repos/${this.repo.owner}/${this.repo.repo}`, {
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!repoResponse.ok) {
                console.error('Repository access failed:', {
                    status: repoResponse.status,
                    statusText: repoResponse.statusText
                });
                throw new Error(`Repository access error: ${repoResponse.status} - ${repoResponse.statusText}`);
            }
            
            console.log('Repository access verified');
            this.showAdminPanel();
            await this.loadData();
        } catch (error) {
            console.error('GitHub initialization error:', error);
            this.handleLogout();
            this.showError('Invalid GitHub token. Please try again.');
        }
    }

    // Removed handleLogin since it's now handled in the click event

    async handleLoginClick() {
        console.log('Login click handler executing');
        try {
            const tokenInput = document.getElementById('github-token');
            console.log('Token input found:', !!tokenInput);
            
            if (!tokenInput) {
                throw new Error('Token input not found');
            }
            
            const token = tokenInput.value.trim();
            console.log('Token length:', token.length);
            console.log('Token format check:', token.startsWith('ghp_') ? 'valid prefix' : 'invalid prefix');
            
            if (!token) {
                throw new Error('Please enter a GitHub token');
            }
            
            if (!token.startsWith('ghp_')) {
                throw new Error('Invalid token format. Token should start with "ghp_"');
            }
            
            console.log('Storing token and initializing GitHub');
            localStorage.setItem('github_token', token);
            this.githubToken = token;
            
            console.log('Starting GitHub initialization...');
            await this.initializeGitHub();
            console.log('GitHub initialization completed');
        } catch (error) {
            console.error('Login click handler error:', error);
            this.showError(error.message);
        }
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
            const filePath = `${this.repo.owner}/${this.repo.repo}/contents/${this.repo.path}`;
            console.log('Fetching data from GitHub...', {
                owner: this.repo.owner,
                repo: this.repo.repo,
                path: this.repo.path
            });
            
            const response = await fetch(`https://api.github.com/repos/${filePath}`, {
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('GitHub API Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData,
                    requestedPath: filePath
                });
                throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data received from GitHub for path:', this.repo.path);
            
            if (!data.content) {
                throw new Error('No content received from GitHub');
            }

            const content = JSON.parse(atob(data.content));
            console.log('Content parsed:', content);
            
            if (!content.events || !content.rehearsals || !content.defaultPerformers) {
                throw new Error('Invalid data structure');
            }

            console.log('Rendering data...');
            this.renderEvents(content.events);
            this.renderRehearsals(content.rehearsals);
            this.renderPerformers(content.defaultPerformers);
            console.log('Data rendered successfully');
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

            // Get current file to get the SHA
            const filePath = `${this.repo.owner}/${this.repo.repo}/contents/${this.repo.path}`;
            console.log('Getting current file data...', {
                owner: this.repo.owner,
                repo: this.repo.repo,
                path: this.repo.path
            });
            
            const getResponse = await fetch(`https://api.github.com/repos/${filePath}`, {
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!getResponse.ok) {
                const errorData = await getResponse.json().catch(() => ({}));
                console.error('GitHub API Response:', {
                    status: getResponse.status,
                    statusText: getResponse.statusText,
                    error: errorData,
                    requestedPath: filePath
                });
                throw new Error(`GitHub API error: ${getResponse.status} - ${getResponse.statusText}`);
            }

            const currentFile = await getResponse.json();
            console.log('Current file data retrieved');
            if (!currentFile.sha) {
                throw new Error('Failed to get current file data');
            }

            // Update the file
            const content = btoa(JSON.stringify(data, null, 2));
            console.log('Updating file...');
            const updateResponse = await fetch(`https://api.github.com/repos/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Update events and performers',
                    content: content,
                    sha: currentFile.sha
                })
            });

            if (!updateResponse.ok) {
                const errorData = await updateResponse.json().catch(() => ({}));
                console.error('GitHub API Response:', {
                    status: updateResponse.status,
                    statusText: updateResponse.statusText,
                    error: errorData,
                    requestedPath: filePath
                });
                throw new Error(`GitHub API error: ${updateResponse.status} - ${updateResponse.statusText}`);
            }
            
            console.log('File updated successfully');

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
console.log('Admin script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    new AdminPanel();
});