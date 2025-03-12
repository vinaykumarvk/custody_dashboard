# React Custody Tracker Application

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

## Quick Start
The easiest way to start the application is to use the setup command:
```bash
npm run setup
```

This will:
1. Kill any existing process on port 3000
2. Install all dependencies
3. Start the development server

The application will be available at http://localhost:3000

## Manual Installation and Running
If you prefer to run commands manually:

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

This will:
- Automatically check and kill any process on port 3000
- Build the React application
- Start the development server
- Open the application in your default browser
- Enable hot module replacement for quick development

## Available Scripts
- `npm run setup` - One-command setup and start
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm start` - Start production server

## Project Structure
- `/src` - React application source code
- `/public` - Static assets and built files
- `/server.js` - Express server for production
- `/start-dev.js` - Development server configuration

## Automatic Features
The application includes several automatic features:
- Automatic port management (kills existing processes on port 3000)
- Automatic dependency installation before starting
- Hot Module Replacement (HMR) for development
- Error overlay in the browser
- Source maps for debugging

## Troubleshooting
If you still encounter issues:
1. Clear npm cache:
```bash
npm cache clean --force
```

2. Delete build artifacts:
```bash
rm -rf node_modules package-lock.json public/bundle.js
```

3. Reinstall everything:
```bash
npm install
```

## Development Notes
- The application uses webpack-dev-server for development
- Source maps are enabled for better debugging
- The development server runs on http://localhost:3000 