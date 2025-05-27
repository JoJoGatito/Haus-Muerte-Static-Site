# Google Form Setup and Integration Guide

## 1. Creating the Google Form

1. Go to [forms.google.com](https://forms.google.com)
2. Click "+" to create a new blank form
3. Click "Untitled form" to rename it to "Haus Muerte Workshop Registration"

## 2. Form Fields and Settings

### Required Fields
1. Full Name (Short answer)
   - Mark as required
   - Add validation for text only

2. Email Address (Short answer)
   - Mark as required
   - Add validation for email format

3. Phone Number (Short answer)
   - Mark as required
   - Add validation for phone number format

4. Workshop Date Selection (Multiple choice)
   - Mark as required
   - Add available workshop dates
   - Enable "Limit to one response"

5. Experience Level (Multiple choice)
   - Mark as required
   - Options:
     - Beginner
     - Intermediate
     - Advanced

6. Special Requirements/Accommodations (Paragraph)
   - Optional field
   - Add helper text: "Please let us know if you have any special requirements or accommodations"

### Form Settings
1. Click the Settings gear icon ⚙️
2. Under "General":
   - Collect email addresses: ON
   - Limit to 1 response: ON
   - Show progress bar: ON
3. Under "Presentation":
   - Show link to submit another response: OFF
   - Shuffle question order: OFF
4. Under "Responses":
   - Choose "Accepting responses"
   - Set response destination (Google Sheets recommended)

## 3. Getting the Embed URL

1. Click the "Send" button
2. Select the "Embed" tab
3. Customize the form dimensions:
   - Width: 640
   - Height: 800
4. Copy the provided iframe HTML code

## 4. Integration into Workshop Page

1. Open [`workshop/index.html`](workshop/index.html)
2. Locate the section where the form should be placed
3. Paste the copied iframe HTML code
4. Add responsive styling in [`assets/css/workshop.css`](assets/css/workshop.css):
   ```css
   .google-form-container {
     position: relative;
     width: 100%;
     max-width: 640px;
     margin: 0 auto;
     padding: 20px;
   }
   
   .google-form-container iframe {
     width: 100%;
     border: none;
     min-height: 800px;
   }
   ```

## 5. Testing the Integration

1. Local Testing:
   - Open the workshop page in a browser
   - Verify the form is centered and responsive
   - Test on different screen sizes using browser dev tools
   - Submit a test response

2. Form Response Testing:
   - Check if responses are being recorded in Google Sheets
   - Verify email notifications are working
   - Test required field validation
   - Ensure error messages display properly

3. Cross-browser Testing:
   - Test in Chrome, Firefox, Safari
   - Verify form styling is consistent
   - Check mobile responsiveness

## Troubleshooting

- If the form doesn't appear, check the iframe src URL
- If styling issues occur, verify CSS classes are properly applied
- For response issues, check Google Form settings
- For mobile display problems, adjust iframe height as needed

## Maintenance

- Regularly check form responses
- Update workshop dates as needed
- Monitor form submission success rate
- Keep backup of form responses in Google Sheets