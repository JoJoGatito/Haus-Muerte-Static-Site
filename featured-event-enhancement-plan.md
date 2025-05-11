# Featured Event Enhancement Plan

## Overview
Transform the featured event section into a more prominent and visually striking component that serves as the main focus of the homepage while maintaining the dark, gothic aesthetic of Haus Muerte.

## Visual Design

### Hero Treatment
- Convert to full-width hero section spanning viewport width
- Minimum height of 80vh to create dramatic impact
- Implement parallax scrolling effect for depth

### Image Enhancement
- Large, high-quality event image as background
- Optimize image loading with progressive enhancement
- Add subtle zoom effect on hover
- Implement custom gradient overlay:
  ```css
  background: linear-gradient(
    135deg,
    rgba(106, 16, 23, 0.9) 0%,
    rgba(0, 0, 0, 0.85) 100%
  );
  ```

### Typography
- Increase event title size to 3.5rem using UnifrakturMaguntia font
- Implement text shadow for better readability
- Use EB Garamond for event details with increased size
- Add subtle animation for text entrance

## Layout Structure

### Split-Screen Design
- Image section: 60% width
- Content section: 40% width with semi-transparent background
- Floating content box with glass-morphism effect
- Strategic white space for improved readability

### Content Organization
```
[Event Image Background]
|
|-- Event Title (Large, Gothic)
|-- Event Date & Time (Elegant serif)
|-- Location (With icon)
|-- Description (Clean, readable)
|-- Performer List (Interactive)
|-- CTA Button (Prominent)
```

### Interactive Elements
- Hover effects on performer names
- Pulsing CTA button
- Smooth transitions between states
- Subtle background movement on scroll

## Technical Specifications

### CSS Variables
```css
:root {
  --featured-event-height: 80vh;
  --overlay-color-primary: rgba(106, 16, 23, 0.9);
  --overlay-color-secondary: rgba(0, 0, 0, 0.85);
  --content-bg: rgba(26, 26, 26, 0.8);
  --title-size: 3.5rem;
  --text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
```

### Responsive Breakpoints
- Desktop (1200px+): Full split-screen layout
- Tablet (768px - 1199px): Modified split with reduced heights
- Mobile (< 768px): Stacked layout with optimized spacing

### Performance Considerations
- Lazy loading for images
- Optimized animations for reduced motion
- Progressive enhancement for modern browsers
- Efficient CSS transitions

## Implementation Phases

1. **Foundation**
   - HTML structure updates
   - Base CSS variables
   - Core layout implementation

2. **Visual Enhancement**
   - Typography improvements
   - Gradient overlays
   - Image optimization

3. **Interactivity**
   - Hover states
   - Animations
   - Transitions

4. **Responsive Design**
   - Breakpoint implementations
   - Mobile optimizations
   - Testing across devices

5. **Performance**
   - Loading optimizations
   - Animation efficiency
   - Browser testing

## Success Metrics
- Immediate visual impact on page load
- Smooth transitions and animations
- Consistent performance across devices
- Maintained gothic aesthetic
- Clear hierarchy emphasizing event details

## Next Steps
1. Review and approve design direction
2. Implement HTML structure changes
3. Apply new CSS styling
4. Test responsive behavior
5. Optimize performance
6. Launch enhanced featured event section