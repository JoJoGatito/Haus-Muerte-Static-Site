

🔄 Syncing Discord Events to a Static HTML Site Using GitHub Actions

1. Set Up Discord Bot
	•	Create a new bot in the Discord Developer Portal.
	•	Assign necessary permissions to read scheduled events.
	•	Invite the bot to your Discord server.

2. Prepare Your GitHub Repository
	•	Ensure your static HTML site is in a GitHub repository.
	•	Create a directory for your automation script (e.g., /scripts).

3. Write a Script to Fetch and Format Events
	•	Use a script (Node.js or Python) to:
	•	Fetch scheduled events from the Discord API.
	•	Format the data into HTML.
	•	Save the output to a file (e.g., events.html) in your repo.

4. Store Bot Token Securely
	•	Add your Discord bot token to GitHub as a repository secret.

5. Set Up GitHub Action Workflow
	•	Create a GitHub Actions workflow that:
	•	Runs the script on a schedule or manually.
	•	Commits the updated HTML to your repository.

6. Display Events on Your Website
	•	Include the generated HTML file in your site’s layout.
	•	Ensure your site rebuilds with the updated content.
