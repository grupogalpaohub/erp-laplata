/* eslint-disable no-console */
const { execSync } = require('child_process');
function fail(msg){ console.error('\n❌ ' + msg + '\n'); process.exit(2); }
try {
  const diff = execSync('git diff --cached --unified=0', { stdio: ['ignore','pipe','ignore'] }).toString();
  const significant = diff
    .split('\n')
    .filter(l => /^[+-]/.test(l))
    .filter(l => !/^\s*\/\/|^\s*\/\*|^\s*\*/.test(l)) // comentários TS/JS
    .filter(l => !/^\s*--/.test(l)) // comentários SQL
    .filter(l => !/^\s*$/.test(l)); // vazio
  if (!significant.length) fail('Commit bloqueado: alterações são no-op (previne loop do Cursor).');
  console.log('✅ anti-loop: ok.');
} catch {
  // Em caso de falha no git diff, não bloquear
  console.log('ℹ️ anti-loop: skip.');
}
