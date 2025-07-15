# Accompanying Friend Website

This directory contains the public website for the Accompanying Friend project.

## File Structure

```
public/
├── index.html              # Main website homepage
├── js/
│   └── downloads.js        # Download functionality JavaScript
├── downloads/              # Downloadable files
│   ├── api-docs.txt        # API documentation
│   ├── user-manual.pdf     # User manual
│   └── ...                 # Other downloadable files
├── verification.html       # Email verification page
└── reset-password.html     # Password reset page
```

## Download Functionality

### How Downloads Work

1. **Static File Serving**: Files in the `downloads/` folder are served directly by Express static middleware
2. **API Routes**: Additional download functionality is handled by `/api/downloads/` routes
3. **JavaScript Enhancement**: The `downloads.js` file provides enhanced user experience

### Download Methods

#### Method 1: Direct Static File Access

```html
<a href="/downloads/filename.ext" download>Download File</a>
```

#### Method 2: API Route with Enhanced Features

```html
<a href="/api/downloads/filename.ext" class="download-button">Download File</a>
```

### API Endpoints

- `GET /api/downloads/list` - Get list of available downloads
- `GET /api/downloads/:filename` - Download specific file
- `GET /api/downloads/stats/overview` - Get download statistics

### Features

- **Download Tracking**: Logs download attempts with IP and timestamp
- **File Validation**: Checks if files exist before serving
- **Proper Headers**: Sets correct Content-Type and Content-Disposition headers
- **Error Handling**: Graceful error handling for missing files
- **Progress Indicators**: Visual feedback during downloads
- **Analytics**: Download statistics and tracking

### Adding New Downloads

1. Place the file in `public/downloads/`
2. Add file metadata to `routes/downloads.js`
3. Update the website HTML if needed

### Security Considerations

- Files are served from a controlled directory
- File existence is validated before serving
- Download attempts are logged for monitoring
- Consider implementing authentication for sensitive files

## Customization

### Styling

The website uses CSS Grid and Flexbox for responsive design. Colors and styling can be modified in the `<style>` section of `index.html`.

### JavaScript

The `downloads.js` file can be extended to add:

- Download progress tracking
- Analytics integration
- Custom download behaviors
- File validation

### Server Configuration

The Express server is configured to serve static files from this directory. Additional middleware can be added in `server.js` for enhanced functionality.
