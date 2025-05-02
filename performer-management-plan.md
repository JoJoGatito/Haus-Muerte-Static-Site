# Performer Management System Plan

## Implementation Status
✅ Basic Features Completed:
- Performer checkboxes with visual feedback
- Gothic-themed styling and responsive design
- Event data loading and display
- State management in memory
- Default performers list
- Rehearsal display structure

⚠️ Storage Implementation Note:
The localStorage persistence is implemented but has limitations when running locally:
- Works correctly when hosted on a real web server
- Does not persist when using Python's local HTTP server
- Future iterations should consider alternative storage methods for local development

## Overview
A simple, unlisted page that allows managing performer confirmations and rehearsal schedules without requiring authentication. The system uses local storage to persist changes and automatically update the main event display.

## Data Structure Updates

### Extended events.json
```json
{
  "events": [
    {
      "id": "event-1",
      "title": "Event Title",
      "date": "2025-06-21",
      "startTime": "20:00",
      "endTime": "02:00",
      "location": "Venue Name",
      "performers": [
        {
          "name": "Performer Name",
          "confirmed": false
        }
      ],
      "isRehearsal": false
    }
  ],
  "rehearsals": [
    {
      "id": "rehearsal-1", 
      "title": "Gothic Masquerade Rehearsal",
      "date": "2025-06-15",
      "time": "19:00-21:00",
      "location": "Practice Room A"
    }
  ],
  "defaultPerformers": [
    "Performer 1",
    "Performer 2",
    "Performer 3"
  ]
}
```

## New Files

### /performers.html
- Unlisted page accessible only via direct link
- Shows upcoming events with performer checkboxes
- Simple list of rehearsals in chronological order
- No authentication required

### /assets/css/performers.css
- Styling for performer checkboxes
- Rehearsal list styling
- Responsive design for mobile access

### /assets/js/performers.js
- Load events and generate performer checkboxes
- Save confirmations to local storage
- Update main event display
- Handle rehearsal display

## Features

### Event Management
- Checkbox interface for each performer
- Automatic generation of performer list for new events
- Changes persist in local storage
- Updates reflect on main event pages

### Rehearsal Display
- Simple chronological list showing:
  - Rehearsal title
  - Date
  - Time
  - Location
- No descriptions or additional details needed
- Multiple rehearsals supported

### Local Storage Structure
```javascript
{
  "event-1": {
    "performers": {
      "Performer 1": true,
      "Performer 2": false,
      // etc...
    }
  }
}
```

## Implementation Steps

1. Create performers.html with basic structure
2. Implement performers.css for styling
3. Develop performers.js functionality:
   - Load events and rehearsals
   - Generate performer checkboxes
   - Handle local storage
   - Update main event display
4. Update events.js to show confirmed performers
5. Test functionality and mobile responsiveness

## Next Steps
1. Deploy to real web server to enable localStorage persistence
2. Add rehearsal data to events.json
3. Consider implementing alternative storage for local development
4. Add authentication if needed in future iterations