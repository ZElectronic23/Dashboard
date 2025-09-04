# Z.Electronic Dashboard

A responsive Arabic/English dashboard website with login functionality.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Bilingual Support**: Arabic (RTL) and English (LTR) languages
- **User Authentication**: Login system with Google Apps Script backend
- **Modern UI**: Clean, professional design with smooth animations
- **Real-time Clock**: Shows current time and date in Cairo timezone
- **User Profile**: Displays user information and profile picture
- **Permission-based Cards**: Shows dashboard cards based on user permissions

## File Structure

```
dashboard-website/
├── index.html          # Login page
├── dashboard.html      # Main dashboard page
├── styles.css          # Shared CSS styles
├── script.js           # Shared JavaScript functionality
├── README.md           # Project documentation
└── LOGO ICO.png        # Website favicon (to be added)
```

## Pages

### Login Page (index.html)
- User authentication form
- Language switcher
- Real-time clock widget
- Responsive design for all devices
- Error handling and loading states

### Dashboard Page (dashboard.html)
- User profile section
- Permission-based navigation cards
- Dropdown menu with additional options
- Responsive layout
- User session management

## Technical Details

### CSS Features
- CSS Grid and Flexbox for responsive layouts
- CSS Custom Properties (variables) for consistent theming
- Media queries for mobile, tablet, and desktop breakpoints
- Smooth animations and transitions
- RTL/LTR support

### JavaScript Features
- Modular code structure with classes
- Local storage for user data and preferences
- Fetch API for backend communication
- Real-time clock updates
- Language switching functionality
- Dropdown menu animations

### Responsive Breakpoints
- Mobile: ≤ 480px
- Tablet: 481px - 768px
- Desktop: ≥ 769px
- Large Desktop: ≥ 1200px

## Backend Integration

The website integrates with Google Apps Script for user authentication:
- API URL: Configured in `script.js`
- Authentication endpoint: `?action=login`
- User data stored in Google Sheets

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports ES6+ features

## Customization

### Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
  --gold: #dba935;
  --light: #f0f0f0;
  --dark: #222;
  --silver: #c0c0c0;
}
```

### Translations
Add or modify translations in `script.js`:
```javascript
const TRANSLATIONS = {
  ar: { /* Arabic translations */ },
  en: { /* English translations */ }
};
```

### API Configuration
Update the API URL in `script.js`:
```javascript
const CONFIG = {
  API_URL: "your-google-apps-script-url"
};
```

## Deployment

1. Upload all files to your web server
2. Ensure `LOGO ICO.png` is available in the root directory
3. Update the API URL in `script.js` to match your Google Apps Script deployment
4. Test the website on different devices and browsers

## Future Enhancements

- Add more dashboard functionality
- Implement card-specific pages
- Add user settings page
- Enhance mobile navigation
- Add offline support
- Implement push notifications

