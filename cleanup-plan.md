# Site Cleanup Plan

## Current Site Structure
The site consists of:
- Homepage with single hardcoded event
- Apply/perform page with embedded form
- About section (part of homepage)

## Files to Remove

### Directories
- `events/` - Not used, event content is static
- `data/` - Not used, no JSON data needed

### JavaScript Files
- `assets/js/calendar.js` - No calendar functionality used
- `assets/js/event-details.js` - No event detail pages
- `assets/js/performers.js` - No performer management

### CSS Files
- `assets/css/calendar.css` - No calendar functionality
- `assets/css/event-details.css` - No event detail pages
- `assets/css/events.css` - Events handled in home.css
- `assets/css/performers.css` - No performer management

## Files to Keep
1. HTML Files:
   - `index.html`
   - `apply/index.html`

2. CSS Files:
   - `assets/css/main.css`
   - `assets/css/home.css`
   - `assets/css/apply-css.css`

3. JavaScript Files:
   - `assets/js/main.js`
   - `assets/js/apply.js`

4. Images:
   - All files in `assets/Images/events/` (used for featured event)

## Implementation Steps
1. Verify no references to removed files in kept files
2. Back up files to be removed
3. Remove obsolete files and directories
4. Test site functionality:
   - Homepage event display
   - Navigation
   - Apply form
   - Responsive design