import { spawn } from 'child_process';

console.log('\n==================================================');
console.log('  🌟 Starting SmarTCARE Platform (SIH 2026)');
console.log('  👉 Open in your browser: http://localhost:3000');
console.log('==================================================\n');

// Start Express Backend
const server = spawn('node', ['server/index.js'], { 
  stdio: 'inherit', 
  shell: true 
});

// Start Vite Frontend
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '3000'], { 
  stdio: 'inherit', 
  shell: true 
});

const cleanup = () => {
  try {
    server.kill();
    vite.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
