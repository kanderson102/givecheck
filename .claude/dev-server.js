// Wrapper to ensure /usr/local/bin is on PATH for child processes
process.env.PATH = `/usr/local/bin:${process.env.PATH || ''}`;
const { execFileSync } = require('child_process');
const path = require('path');
const projectRoot = path.join(__dirname, '..');
execFileSync(
  '/usr/local/bin/node',
  [path.join(projectRoot, 'node_modules', '.bin', 'next'), 'dev'],
  { stdio: 'inherit', cwd: projectRoot, env: process.env }
);
