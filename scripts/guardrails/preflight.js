/* eslint-disable no-console */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function listChanged() {
  const envList = process.env.GIT_STAGED_LIST;
  if (envList && envList.trim()) return [...new Set(envList.split(/\s+/).filter(Boolean))];
  const out = execSync('git diff --name-only HEAD', { stdio: ['ignore','pipe','ignore'] }).toString();
  return out.split('\n').filter(Boolean);
}
function readFileSafe(f){ try { return fs.readFileSync(f,'utf8'); } catch { return ''; } }
function fail(msg){ console.error('\n❌ '+msg+'\n'); process.exit(2); }
const changed = listChanged();
if (!changed.length) process.exit(0);

/** 1) Supabase/schema proibidos (Cursor não toca) */
const forbidSupabase = [
  /^supabase\//, /^migrations?\//, /^database\//, /^infra\//,
  /^.*supabase.*\.sql$/i, /^supabase_schema\.sql$/i, /^supabase_full\.sql$/i, /^supabase_full\.dump$/i
];
const supTouched = changed.filter(f => forbidSupabase.some(rx=>rx.test(f)));
if (supTouched.length) fail(`Mudanças em Supabase/schema não são permitidas:\n- ${supTouched.join('\n- ')}`);

/** 2) Env/Infra proibidos */
const envTouched = changed.filter(f => /^\.env($|\.|\/)/.test(f) || /^\.vercel\//.test(f) || /^vercel\.json$/.test(f));
if (envTouched.length) fail(`Mudanças em env/vercel não são permitidas:\n- ${envTouched.join('\n- ')}`);

/** 3) DDL proibido em código (exceto patches propostos em patches/sql_outbox/*.sql) */
const ddlRx = /\b(CREATE|ALTER|DROP)\s+(TABLE|FUNCTION|VIEW|INDEX|POLICY|TRIGGER)\b|\b(ENABLE|DISABLE)\s+ROW\s+LEVEL\b/gi;
const sqlOutbox = /^patches\/sql_outbox\/.*\.sql$/i;
const ddlBad = [];
for (const f of changed) {
  const isAllowedSql = sqlOutbox.test(f);
  const ext = path.extname(f).toLowerCase();
  if (isAllowedSql) continue;
  if (['.ts','.tsx','.js','.jsx','.sql'].includes(ext)) {
    const txt = readFileSafe(f);
    if (ddlRx.test(txt)) ddlBad.push(f);
  }
}
if (ddlBad.length) fail(`DDL detectado em arquivos não permitidos (Cursor não pode mexer no banco):\n- ${ddlBad.join('\n- ')}`);

/** 4) Proibição de service-role em app/front */
const serviceRoleRx = /(SUPABASE_SERVICE_ROLE|service_role)/i;
const serviceRoleBad = changed.filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && serviceRoleRx.test(readFileSafe(f)));
if (serviceRoleBad.length) fail(`Referências a service-role detectadas (proibido expor/usar no app):\n- ${serviceRoleBad.join('\n- ')}`);

/** 5) Moeda: proíbe *10000 e /10000 */
const money10000Rx = /(\*\s*10000)|(\/\s*10000)/;
const moneyWrong = changed.filter(f => /\.(ts|tsx|js|jsx)$/.test(f) && money10000Rx.test(readFileSafe(f)));
if (moneyWrong.length) fail(`Conversão monetária proibida detectada (*10000 ou /10000):\n- ${moneyWrong.join('\n- ')}`);

/** 6) Helpers obrigatórios: toCents/formatBRL precisam existir */
const moneyHelperPath = ['src/lib/money.ts','app/lib/money.ts','lib/money.ts'].find(p => fs.existsSync(p));
if (!moneyHelperPath) fail(`Arquivo de helpers monetários (money.ts) não encontrado em src/lib/ ou app/lib/ ou lib/.`);
const moneyTxt = readFileSafe(moneyHelperPath);
if (!/\bexport\s+function\s+toCents\s*\(/.test(moneyTxt) || !/\bexport\s+function\s+formatBRL\s*\(/.test(moneyTxt)) {
  fail(`money.ts deve exportar 'toCents' e 'formatBRL'.`);
}

/** 7) Uso correto dos helpers em arquivos que mexem com *_cents */
const moneyFiles = changed.filter(f => /\.(ts|tsx)$/.test(f));
const moneyFilesBad = [];
for (const f of moneyFiles) {
  const txt = readFileSafe(f);
  const touchesCents = /\b(price|purchase_price|unit_price|total|amount)_cents\b/.test(txt);
  if (touchesCents) {
    const usesFormat = /\bformatBRL\s*\(/.test(txt);
    const usesToCents = /\btoCents\s*\(/.test(txt);
    if (!usesFormat || !usesToCents) moneyFilesBad.push(f);
  }
}
if (moneyFilesBad.length) fail(`Arquivos que lidam com *_cents devem usar helpers formatBRL/toCents:\n- ${moneyFilesBad.join('\n- ')}`);

/** 8) SD/MM exibindo dinheiro devem importar lib/money */
const criticalDirs = [/^app\/mm\//, /^app\/sd\//];
const criticalFiles = changed.filter(f => criticalDirs.some(rx => rx.test(f)) && /\.(ts|tsx)$/.test(f));
const missingImport = [];
for (const f of criticalFiles) {
  const t = readFileSafe(f);
  const showsMoney = /\b(price|amount|total|_cents)\b/.test(t);
  const hasImport = /from\s+['"](?:@\/)?(src\/)?lib\/money['"]/.test(t);
  if (showsMoney && !hasImport) missingImport.push(f);
}
if (missingImport.length) fail(`Arquivos SD/MM que exibem valores devem importar lib/money:\n- ${missingImport.join('\n- ')}`);

/** 9) Sem tenant: proíbe tenant_id em payloads e hardcode "LaplataLunaria" no app */
const tenantBad = changed.filter(f => /\.(ts|tsx|js|jsx)$/.test(f)).filter(f => {
  const t = readFileSafe(f);
  const isTestOrPatch = /^tests?\//.test(f) || sqlOutbox.test(f);
  if (isTestOrPatch) return false;
  const hasTenantIdInPayload = /\btenant_id\b\s*[:=]/.test(t) || /\.eq\(['"]tenant_id['"],/.test(t);
  const hardcodedTenant = /['"]LaplataLunaria['"]/.test(t);
  return hasTenantIdInPayload || hardcodedTenant;
});
if (tenantBad.length) fail(`Proibido aceitar/enviar tenant_id ou hardcode de tenant no app:\n- ${tenantBad.join('\n- ')}`);

/** 10) Anti-hardcode de dados: listas/constantes de materiais/clientes/preços */
const dataHardcodeBad = [];
for (const f of changed.filter(f => /\.(ts|tsx|js|jsx)$/.test(f))) {
  const t = readFileSafe(f);
  const isTestOrPatch = /^tests?\//.test(f) || sqlOutbox.test(f);
  if (isTestOrPatch) continue;
  const manyMaterialCodes = (t.match(/['"][A-Z]_\d{3,}['"]/g) || []).length >= 3;
  const inlinePriceLike = /\b(price|purchase_price|unit_price|amount|total)\b[^;]*=\s*\[/.test(t);
  const inlineCustomers = /\b(customers?|clients?)\b[^;]*=\s*\[/.test(t);
  const inlineMaterials = /\bmaterials?\b[^;]*=\s*\[/.test(t);
  if (manyMaterialCodes || inlinePriceLike || inlineCustomers || inlineMaterials) {
    dataHardcodeBad.push(f);
  }
}
if (dataHardcodeBad.length) fail(`Dados hardcoded detectados (materiais/clientes/preços) — devem vir do DB:\n- ${dataHardcodeBad.join('\n- ')}`);

/** 11) Anti-loop: impede commits redundantes/no-op */
try {
  const diff = execSync('git diff --cached --unified=0', { stdio: ['ignore','pipe','ignore'] }).toString();
  const significant = diff
    .split('\n')
    .filter(l => /^[+-]/.test(l))
    .filter(l => !/^\s*\/\/|^\s*\/\*|^\s*\*/.test(l)) // comentários TS/JS
    .filter(l => !/^\s*--/.test(l)) // comentários SQL
    .filter(l => !/^\s*$/.test(l)); // vazio
  if (!significant.length) fail(`Commit bloqueado: alterações são no-op (somente comentários/espaços) — previne loop do Cursor.`);
} catch {}

console.log('✅ Preflight aprovado.');
process.exit(0);