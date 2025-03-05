# Haus Muerte Static Site - Developer Guide

## Build & Management
- This is a static site with no build system
- For local preview: Use `python -m http.server` or `npx serve`
- Deployment: Upload files to web hosting (Porkbun static hosting)

## Code Style Guidelines

### HTML/CSS
- HTML5 semantic elements with BEM-like class naming (`block-element--modifier`)
- Mobile-first responsive design with media queries
- CSS variables defined in `:root` for theming (colors, spacing, etc.)
- CSS classes use kebab-case: `primary-button`, `event-card`

### JavaScript
- Variable/function names: camelCase with descriptive naming
- Event listeners organized at top of files
- Error handling: Use try/catch with console.error
- Document complex functions with JSDoc comments
- Keep functions simple with single responsibility

### Data Management
- Event data stored in `data/events.json`
- Consistent JSON format for all events (see README.md example)
- Follow the event object format in the documentation

## Project Structure
- `/index.html` - Home page with event calendar (FullCalendar.js)
- `/events/` - Event listings and individual event pages
- `/apply/` - Performer application page (LimeSurvey integration)
- `/assets/` - CSS, JS, and images organized by type
- `/data/` - JSON data files

## External Dependencies
- FullCalendar.js - Calendar library
- Pretix - Ticket sales integration
- LimeSurvey - Forms for performer applications