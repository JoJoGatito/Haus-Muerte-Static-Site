# Haus Muerte Site Maintenance Guide

This guide explains how to manage events and performers using simple copy/paste operations.

## Managing Events (events.html)

### Adding a New Event

1. Open events.html
2. Find the comment block marked `<!-- EVENT BLOCK TEMPLATE -->` at the top
3. Copy the entire block (from `<!-- EVENT BLOCK TEMPLATE -->` to `<!-- END EVENT BLOCK -->`)
4. Paste it where you want the new event to appear (events are listed chronologically)
5. Update the following in your new block:
   - Image source and alt text
   - Event title
   - Date
   - Time
   - Location
   - Description
   - Performer list

Example:
```html
<!-- EVENT BLOCK TEMPLATE - Copy this block for new events -->
<div class="event-block">
    <img src="assets/Images/events/gothic-masquerade.jpg" alt="Gothic Masquerade">
    <div class="event-info">
        <h2>Dark Elegance: A Gothic Masquerade</h2>
        <div class="event-meta">
            <span class="date"><i class="far fa-calendar"></i> June 21, 2025</span>
            <span class="time"><i class="far fa-clock"></i> 8:00 PM - 2:00 AM</span>
            <span class="location"><i class="fas fa-map-marker"></i> The Crimson Ballroom</span>
        </div>
        <div class="event-description">
            <p>Step into a realm of dark enchantment at our Gothic Masquerade...</p>
        </div>
        <div class="event-performers">
            <h3>Featured Performers</h3>
            <ul>
                <li>Morticia Blackwood</li>
                <li>Lord Ravencroft</li>
            </ul>
        </div>
    </div>
</div>
<!-- END EVENT BLOCK -->
```

### Editing an Event
1. Find the event block you want to edit
2. Update the relevant information
3. Save the file

### Removing an Event
1. Find the event block to remove (from `<div class="event-block">` to its closing `</div>`)
2. Delete the entire block
3. Don't forget to remove the event image from assets/Images/events/ if it's no longer needed

## Managing Performers (performers.html)

### Adding a New Performer

1. Open performers.html
2. Find the comment block marked `<!-- PERFORMER CARD TEMPLATE -->`
3. Copy the entire block (from `<!-- PERFORMER CARD TEMPLATE -->` to `<!-- END PERFORMER CARD -->`)
4. Paste it where you want the new performer to appear
5. Update:
   - Performer name
   - Description
   - Event list

Example:
```html
<!-- PERFORMER CARD TEMPLATE - Copy this block for new performers -->
<div class="performer-card">
    <h2>Lady Ravencroft</h2>
    <p class="performer-description">
        A mesmerizing vocalist specializing in gothic opera and dark cabaret performances.
        Known for her haunting interpretations of classical pieces.
    </p>
    <div class="upcoming-events">
        <h3>Upcoming Events</h3>
        <ul>
            <li>Dark Elegance: A Gothic Masquerade - June 21, 2025</li>
            <li>Nocturnal Cabaret - September 13, 2025</li>
        </ul>
    </div>
</div>
<!-- END PERFORMER CARD -->
```

### Editing a Performer
1. Find the performer card you want to edit
2. Update the relevant information
3. Save the file

### Removing a Performer
1. Find the performer card to remove
2. Delete the entire block (from `<div class="performer-card">` to its closing `</div>`)

## Image Guidelines

When adding event images:
1. Place images in: assets/Images/events/
2. Use JPG or PNG format
3. Recommended size: 1920x1080px
4. Optimize for web (< 500KB)

## Best Practices

1. Keep events in chronological order
2. Remove past events regularly
3. Keep performer information current
4. Update event lists in performer cards when adding/removing events
5. Always maintain proper HTML structure (don't delete partial tags)
6. Save a backup copy of the file before making major changes