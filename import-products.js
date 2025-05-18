// This script is a simple wrapper to run the TypeScript import script
import { spawn } from 'node:child_process';

// Run the TypeScript file using tsx
const child = spawn('npx', ['tsx', 'server/import-products.ts']);

child.stdout.on('data', (data) => {
  console.log(`${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`${data}`);
});

child.on('close', (code) => {
  console.log(`Import process exited with code ${code}`);
});