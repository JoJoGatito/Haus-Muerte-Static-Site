# Event Platform Website

A complete static website for event management with calendar, ticket sales via Pretix, and performer application integration.

## Features

- **Interactive Event Calendar**: Using FullCalendar.js to display upcoming events
- **Event Listings and Details**: Browse events with filtering options
- **Ticket Sales**: Integration with self-hosted Pretix for ticket sales
- **Performer Applications**: Integration with LimeSurvey for performer submissions
- **Responsive Design**: Mobile-friendly layout for all device sizes

## Project Structure

```
event-website/
├── index.html               # Home page with event calendar
├── events/                  # Events pages
│   ├── index.html           # Events listing with filters
│   └── event-template.html  # Template for individual event pages
├── apply/                   # Performer application page
│   └── index.html           # Page with embedded LimeSurvey form
├── assets/
│   ├── css/                 # Stylesheets
│   │   ├── main.css         # Main styles
│   │   ├── calendar.css     # Calendar styles
│   │   ├── events.css       # Events page styles
│   │   ├── event-details.css # Event detail page styles
│   │   └── apply.css        # Application page styles
│   ├── js/                  # JavaScript files
│   │   ├── main.js          # Main site functionality
│   │   ├── calendar.js      # Calendar implementation
│   │   ├── events.js        # Events listing functionality
│   │   ├── event-details.js # Event detail page functionality
│   │   └── apply.js         # Application page functionality
│   └── images/              # Site images and event photos
├── data/
│   └── events.json          # Event data store (for static site)
└── README.md                # This documentation file
```

## Setup Instructions

### Prerequisites

- Web hosting service (like Porkbun's static hosting)
- Self-hosted Pretix instance (for ticket sales)
- Self-hosted LimeSurvey instance (for performer applications)

### Installation

1. Clone this repository
2. Customize the configuration:
   - Update the Pretix instance URL in `event-template.html` and `event-details.js`
   - Update the LimeSurvey URL in `apply/index.html`
   - Customize branding, colors, and text in CSS files
   - Add your own event data to `data/events.json`
3. Add event images to `assets/images/events/` directory
4. Upload the files to your web hosting service

### Self-Hosting Pretix on Fly.io

To set up Pretix on Fly.io:

1. Create a Fly.io account and install the flyctl CLI
2. Create a Dockerfile for Pretix:

```dockerfile
FROM pretix/standalone:latest

# Add custom configuration if needed
COPY pretix.cfg /etc/pretix/pretix.cfg

# Expose the port
EXPOSE 8000

# Set the command
CMD ["/usr/local/bin/pretix", "web"]
```

3. Create a fly.toml file:

```toml
app = "your-pretix-instance"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "8000"

[http_service]
  internal_port = 8000
  force_https = true
```

4. Deploy with:

```bash
flyctl launch
```

5. Set up a PostgreSQL database:

```bash
flyctl postgres create
flyctl postgres attach --app your-pretix-instance
```

6. Access your Pretix instance at https://your-pretix-instance.fly.dev

## Creating Event Pages

For each new event:

1. Create a new HTML file in the `events/` directory (e.g., `events/my-new-event.html`)
2. Copy the content from `event-template.html`
3. Add event data to `data/events.json` with a matching slug
4. Add event images to `assets/images/events/`

The event details page will automatically load the event data based on the slug in the URL.

## Working with Event Data

The `events.json` file contains all event data including:

- Basic information (title, date, location)
- Descriptions and images
- Performer details
- Schedule information
- Venue details
- Pretix event configuration

### Example Event Object:

```json
{
  "id": 1,
  "title": "Event Title",
  "slug": "event-slug",
  "category": "Music",
  "date": "2025-06-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "location": "Venue Name",
  "shortDescription": "Brief description of event.",
  "description": "<p>Full HTML description...</p>",
  "image": "/assets/images/events/event-image.jpg",
  "bannerImage": "/assets/images/events/event-banner.jpg",
  "price": 45,
  "featured": true,
  "pretixEvent": {
    "organizerSlug": "your-organizer",
    "eventSlug": "your-event-slug"
  },
  "performers": [
    {
      "name": "Performer Name",
      "role": "Role",
      "image": "/assets/images/performers/performer.jpg"
    }
  ],
  "schedule": [
    {
      "time": "19:00",
      "title": "Event Start",
      "description": "Description"
    }
  ],
  "venue": {
    "name": "Venue Name",
    "address": "Venue Address",
    "phone": "Phone Number",
    "website": "Website URL",
    "websiteLabel": "Display text"
  }
}
```

## Customization

### Styling

The site uses CSS variables for easy customization. Edit the `:root` section in `assets/css/main.css` to change colors, fonts, and other design elements:

```css
:root {
    /* Color palette */
    --primary-color: #6200ea;
    --primary-light: #9d46ff;
    --primary-dark: #0a00b6;
    /* Add more custom variables here */
}
```

### Adding Pages

To add new pages:
1. Create a new HTML file
2. Copy the header and footer from an existing page
3. Add your content
4. Link to the new page from the navigation menu in the header

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

- [FullCalendar](https://fullcalendar.io/) - JavaScript calendar library
- [Pretix](https://pretix.eu/) - Open source ticketing system
- [LimeSurvey](https://www.limesurvey.org/) - Open source survey tool
- [Font Awesome](https://fontawesome.com/) - Icons
