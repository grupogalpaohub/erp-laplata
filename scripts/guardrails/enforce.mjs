// scripts/guardrails/enforce.mjs
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const MODE = process.argv.find(a=>a.startsWith("--mode="))?.split("=")[1] ?? "dev";
const ROOT = process.cwd();
const log = console.log, err = console.error;
let violations = [];

const read = p => { try { return fs.readFileSync(p, "utf8"); } catch { return ""; } };
const listFiles = (dir) => {
  const out=[]; const st=[dir];
  while (st.length){const d=st.pop();for(const e of fs.readdirSync(d,{withFileTypes:true})){
    if (e.name==="node_modules"||e.name===".git"||e.name===".next") continue;
    const p=path.join(d,e.name);
    if (e.isDirectory()) st.push(p); else out.push(p);
  }}
  return out;
};
const staged = () => {
  try {
    const s = execSync("git diff --cached --name-only", {stdio:["ignore","pipe","ignore"]}).toString().trim();
    return s ? s.split(/\r?\n/) : [];
  } catch { return []; }
};
function add(file, msg, found){ violations.push({file, msg, found}); }

log(`🔒 guardrails/enforce :: mode=${MODE}`);

const filesAll = listFiles(ROOT);
const filesApp  = filesAll.filter(f => f.startsWith("app/"));
const filesCode = filesAll.filter(f => /\.(ts|tsx|js|mjs|cjs)$/.test(f));
const filesPage = filesAll.filter(f => /\/page\.tsx?$/.test(f));

/** 0) proteção dos próprios guardrails */
if (MODE==="commit"||MODE==="push"||MODE==="ci"){
  const changed = staged();
  const touchedGuard = changed.filter(f => f.startsWith("scripts/guardrails/") || f.startsWith(".githooks/"));
  if (touchedGuard.length){
    const msg = execSync("git log -1 --pretty=%B", {stdio:["ignore","pipe","ignore"]}).toString();
    if (!/\[ALLOW-GUARDRAIL-EDIT\]/.test(msg)) {
      add("(guardrails)", "Mudança em guardrails/hook detectada — exija revisão humana. Adicione [ALLOW-GUARDRAIL-EDIT] na mensagem do commit para continuar.", "no override token");
    }
  }
}

/** 1) schema/env/vercel intocáveis */
const changed = staged();
if (MODE!=="dev" && changed.length){
  const block = changed.filter(f =>
    /^supabase\//.test(f) || /^migrations?\//.test(f) || /^database\//.test(f) ||
    /\.sql$/i.test(f) ||
    /^\.env($|\.|\/)/.test(f) || /^\.vercel\//.test(f) || /^vercel\.json$/.test(f)
  );
  if (block.length) add(block.join(", "), "Supabase schema/ENV/Vercel são intocáveis pelo agente. Use patches/sql_outbox para SQL.", "blocked-area");
}

/** 2) service_role: proibido no frontend e fora de server-only */
for (const f of filesCode){
  const txt = read(f);
  if (/SUPABASE_SERVICE_ROLE_KEY/i.test(txt)){
    // permitimos SOMENTE em app/api/** e scripts/**
    const serverOnly = /^app\/api\//.test(f) || /^scripts\//.test(f);
    if (!serverOnly) add(f, "SERVICE_ROLE_KEY só pode existir em API server-only (app/api/**) ou scripts/**.", "SUPABASE_SERVICE_ROLE_KEY");
  }
}

/** 3) tenant: nunca hardcode nem enviar/aceitar tenant_id */
for (const f of filesCode){
  const t = read(f);
  if (/\bgetTenantId\s*\(/.test(t) || /['"`]LaplataLunaria['"`]/.test(t) || /\.eq\(['"]tenant_id['"]\s*,/.test(t) || /\btenant_id\b\s*[:=]/.test(t)){
    add(f, "Tenant controlado por RLS/JWT. Proibido hardcode/filtrar/enviar tenant_id.", "tenant-violation");
  }
}

/** 4) moeda: sem *10000 / /10000 / toFixed(2) em centavos. exigir money.ts */
const moneyFile = ["lib/money.ts","src/lib/money.ts","app/lib/money.ts"].find(p=>fs.existsSync(p));
if (!moneyFile) add("(money.ts)", "Arquivo de helpers monetários não encontrado (lib/money.ts).", "missing");
else {
  const mt = read(moneyFile);
  if (!/export\s+function\s+toCents\s*\(/.test(mt) || !/export\s+function\s+formatBRL\s*\(/.test(mt)){
    add(moneyFile, "money.ts deve exportar toCents() e formatBRL().", "missing-helpers");
  }
}
for (const f of filesCode){
  const t = read(f);
  if (/\*?\s*10000\b/.test(t) || /\/\s*10000\b/.test(t)) add(f, "Conversão monetária proibida (*10000 / /10000). Use toCents()/formatBRL().", "bad-currency-math");
  const touchesCents = /\b(price|purchase_price|unit_price|amount|total)_cents\b/.test(t);
  if (touchesCents && !/\b(toCents|formatBRL)\s*\(/.test(t)) {
    add(f, "Arquivo mexe com *_cents e não usa toCents()/formatBRL().", "missing-money-helpers");
  }
}

/** 5) client component não pode chamar /api (use SSR ou Server Actions) */
for (const f of filesApp){
  if (!/\.(ts|tsx)$/.test(f)) continue;
  const t = read(f);
  const isClient = /^\s*['"]use client['"]\s*;?/m.test(t);
  if (isClient && /fetch\s*\(\s*['"`]\/api\//.test(t)) {
    add(f, "Client Component consumindo /api. Padronize SSR/Server Action.", "client-fetch-api");
  }
}

/** 6) páginas precisam SSR explícito */
for (const f of filesPage){
  const t = read(f);
  if (!/export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]\s*;/.test(t)) {
    add(f, "Páginas do App Router devem exportar `dynamic = 'force-dynamic'` (SSR + RLS).", "missing-dynamic");
  }
}

/** 7) congelar baseline visual (Home/MM/SD + tokens) */
const immutable = [
  "app/layout.tsx","app/globals.css","tailwind.config.js","postcss.config.js",
  "components/ui/","components/common/","lib/theme.","lib/ui/","app/(home)/","app/(mm)/","app/(sd)/"
];
if (MODE==="commit"||MODE==="push"||MODE==="ci"){
  const ch = staged();
  const touched = ch.filter(f => immutable.some(b => f.startsWith(b) || f.includes(b)));
  if (touched.length){
    add(touched.join(", "), "Baseline visual congelado. Mudanças só com revisão humana.", "ui-immutable");
  }
}

/** 8) sem dados mock/hardcode de domínio */
for (const f of filesCode){
  const t = read(f);
  if (/materials?\s*=\s*\[/.test(t) || /customers?\s*=\s*\[/.test(t) || /\b(price|amount|total|unit_price)_cents\b\s*=\s*\[/.test(t)) {
    add(f, "Dados de domínio hardcoded detectados (materiais/clientes/preços). Devem vir do DB.", "domain-hardcode");
  }
}

/** 9) proibir tentar desabilitar RLS */
for (const f of filesCode){
  const t = read(f);
  if (/\bDISABLE\s+ROW\s+LEVEL\b/i.test(t) || /\benable\s+anonymous\b/i.test(t)) {
    add(f, "Tentativa de burlar RLS/segurança detectada.", "rls-bypass");
  }
}

/** 10) commit de .env.local proibido */
if (MODE==="commit"||MODE==="push"||MODE==="ci"){
  const ch = staged();
  if (ch.some(f => /^\.env($|\.|\/)/.test(f))) {
    add(".env*", "É proibido commitar/alterar .env*", "env-commit");
  }
}

/** 11) anti-loop: proíbe commit no-op (só comentários/espaços) */
if (MODE==="commit"||MODE==="push"){
  try {
    const diff = execSync("git diff --cached --unified=0", {stdio:["ignore","pipe","ignore"]}).toString();
    const significant = diff.split("\n")
      .filter(l => /^[+-]/.test(l))
      .filter(l => !/^\s*\/\/|^\s*\/\*|^\s*\*|^\s*--/.test(l))
      .filter(l => !/^\s*$/.test(l));
    if (!significant.length) add("(diff)", "Commit bloqueado: alterações sem efeito (anti-loop).", "noop-commit");
  } catch {}
}

if (violations.length){
  err("\n❌ Guardrails — violações encontradas:");
  for (const v of violations) err(`- ${v.file}\n  ↳ ${v.msg}\n  ↳ ${v.found}\n`);
  process.exit(2);
}
log("✅ Guardrails OK.");
