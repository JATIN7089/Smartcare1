import { spawn } from 'child_process';

console.log('\n==============================================================');
console.log('  🌟 SmarTCARE Platform (SIH 2026 - Problem 26003)');
console.log('  👉 Frontend Application : http://localhost:3000');
console.log('  👉 Express REST API     : http://localhost:5000');
console.log('==============================================================\n');

const isWin = process.platform === 'win32';
const nodeBin = process.execPath;
const npmCmd = isWin ? 'npm.cmd' : 'npm';

// 1. Start Express Backend API Server
const server = spawn(nodeBin, ['server/index.js'], { 
  stdio: 'inherit', 
  shell: isWin 
});

// 2. Start Vite Frontend Dev Server
const vite = spawn(npmCmd, ['run', 'dev:vite'], { 
  stdio: 'inherit', 
  shell: isWin 
});

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
