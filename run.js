import { spawn } from 'child_process';
import fs from 'fs';

console.log('\n==============================================================');
console.log('  🌟 SmarTCARE Platform (SIH 2026 - Problem 26003)');
console.log('  👉 Frontend Application : http://localhost:3000');
console.log('  👉 Express REST API     : http://localhost:5000');
console.log('==============================================================\n');

// Check if node_modules exists
if (!fs.existsSync('./node_modules')) {
  console.error('❌ node_modules not found. Please run: npm install');
  process.exit(1);
}

// 1. Start Express Backend API Server
const isWin = process.platform === 'win32';
const server = spawn(isWin ? 'node.exe' : 'node', ['server/index.js'], { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, FORCE_COLOR: '1' }
});

server.on('error', (err) => {
  console.error('[Server] Failed to start:', err.message);
});

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Server] Exited with code ${code}`);
  }
});

// 2. Start Vite Frontend Dev Server after a short delay so backend is ready
let vite = null;
setTimeout(() => {
  vite = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev:vite'], { 
    stdio: 'inherit', 
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  vite.on('error', (err) => {
    console.error('[Vite] Failed to start:', err.message);
  });

}, 1500);

const cleanup = () => {
  console.log('\n🛑 Shutting down SmarTCARE...');
  try {
    if (server && !server.killed) server.kill('SIGTERM');
    if (vite && !vite.killed) vite.kill('SIGTERM');
  } catch (e) {
    console.error('Cleanup error:', e.message);
  }
  setTimeout(() => process.exit(0), 500);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

