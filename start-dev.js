const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

// Function to check if a port is in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
};

// Function to kill process on port
const killProcessOnPort = async (port) => {
  try {
    const cmd = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port} -t`;
    
    const output = execSync(cmd, { encoding: 'utf-8' });
    if (output) {
      const pid = process.platform === 'win32'
        ? output.split('\r\n')[0].split(/\s+/)[5]
        : output.trim();
      
      if (pid) {
        process.platform === 'win32'
          ? execSync(`taskkill /F /PID ${pid}`)
          : execSync(`kill -9 ${pid}`);
        console.log(`Killed process ${pid} on port ${port}`);
      }
    }
  } catch (err) {
    // If there's an error, it likely means no process was found
    console.log(`No process found on port ${port}`);
  }
};

// Function to wait for a specific time
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Build the React application first to ensure bundle.js exists
async function buildApp() {
  console.log('Building React application...');
  try {
    // Ensure the public directory exists
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Run webpack to build the bundle
    execSync('npx webpack --mode development', { stdio: 'inherit' });
    console.log('Build completed successfully');
    return true;
  } catch (error) {
    console.error('Build failed:', error);
    return false;
  }
}

// Start only the frontend server since we're using mock data
async function startServers() {
  try {
    const PORT = 3000;

    // Check if port is in use
    const portInUse = await isPortInUse(PORT);
    if (portInUse) {
      console.log(`Port ${PORT} is in use. Attempting to free it...`);
      await killProcessOnPort(PORT);
      // Wait a bit for the port to be fully released
      await wait(1000);
    }

    // Build the application first
    const buildSuccess = await buildApp();
    if (!buildSuccess) {
      console.error('Failed to build application, exiting');
      process.exit(1);
    }
    
    console.log('Starting frontend server with mock data...');
    console.log('Current directory:', process.cwd());
    
    // Start the React frontend with verbose logging
    const webpackServer = spawn('npx', [
      'webpack',
      'serve',
      '--mode', 'development',
      '--host', 'localhost',
      '--port', PORT.toString(),
      '--hot',
      '--progress'
    ], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development', FORCE_COLOR: '1' }
    });
    
    webpackServer.on('error', (error) => {
      console.error('Webpack server error:', error);
    });

    webpackServer.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Webpack server exited with code ${code}`);
      }
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down server...');
      webpackServer.kill();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      console.log('Shutting down server...');
      webpackServer.kill();
      process.exit(0);
    });
    
    console.log('Development server started:');
    console.log(`- Frontend running on port ${PORT} (using mock data)`);
    console.log(`- Access the app at http://localhost:${PORT}`);
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
}

// Start the servers
startServers().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});