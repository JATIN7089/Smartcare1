import { spawn } from 'child_process';

console.log('\n==============================================================');
console.log('  🌟 SmarTCARE Platform (SIH 2026 - Problem 26003)');
console.log('  👉 Frontend Application : http://localhost:3000');
console.log('  👉 Express REST API     : http://localhost:5000');
console.log('==============================================================\n');

// 1. Start Express Backend API Server
const isWin = process.platform === 'win32';
const server = spawn(isWin ? 'node.exe' : 'node', ['server/index.js'], { 
  stdio: 'inherit', 
  shell: true 
});

// 2. Start Vite Frontend Dev Server after a short delay so backend is ready
let vite = null;
setTimeout(() => {
  vite = spawn(isWin ? 'npm.cmd' : 'npm', ['run', 'dev:vite'], { 
    stdio: 'inherit', 
    shell: true 
  });
}, 1000);

const cleanup = () => {
  try {
    if (server) server.kill();
    if (vite) vite.kill();
  } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
