import { existsSync } from 'node:fs';

function ok(label, cond) {
  console.log(`${cond ? '✅' : '❌'} ${label}`);
  if (!cond) process.exitCode = 1;
}

ok('.vercel/output existe', existsSync('.vercel/output'));
ok('static presente', existsSync('.vercel/output/static'));
ok('functions presente', existsSync('.vercel/output/functions'));