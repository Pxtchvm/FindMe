# FindMe App - Client

This directory contains the React frontend for the FindMe Lost and Found Management System.

## Directory Structure

```
client/
├── public/            # Static files
│   ├── favicon.ico    # App favicon
│   ├── index.html     # HTML template
│   ├── logo192.png    # App logo (small)
│   ├── logo512.png    # App logo (large)
│   ├── manifest.json  # Web app manifest
│   └── robots.txt     # Robots configuration
└── src/               # Source code
    ├── components/    # Reusable UI components
    │   ├── items/     # Item-related components
    │   ├── layout/    # Layout components (navbar, etc.)
    │   └── notifications/ # Notification components
    ├── context/       # React Context for state management
    ├── pages/         # Page components
    ├── services/      # API services
    ├── App.js         # Main App component
    ├── index.js       # Entry point
    └── reportWebVitals.js # Performance reporting
```

## Important Notes

### Icons and Images

You need to add the following files to the `public` directory:

- `favicon.ico` - Website favicon (16x16, 32x32)
- `logo192.png` - App logo (192x192)
- `logo512.png` - App logo (512x512)

You can generate these files using online tools like:
- [Favicon.io](https://favicon.io/) 
- [Canva](https://www.canva.com/)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

Or use simple placeholder icons during development.

## Available Scripts

In this directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.