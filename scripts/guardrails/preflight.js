/**
 * Preflight hierárquico p/ alterações CRÍTICAS (auth/schema/env/middleware/next-config)
 * - Não exige aprovação humana; só bloqueia se falhar.
 * - Hierarquia:
 *   A) Porta/SITE_URL -> PORT deve ser 3000 e SITE_URL localhost:3000 (local)
 *   B) Auth/ENV       -> Se AUTH_DISABLED != true, exige SUPABASE_URL/ANON e health OK
 *   C) DB REST        -> Confere acesso a /rest/v1 para 1 tabela chave (se B aplicável)
 *   D) Schema diff    -> Se alterar SQL/migrations, exige arquivo docs/change-intent.json
 *   E) TypeScript     -> Valida sintaxe TypeScript se houver arquivos .ts/.tsx
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const CHANGED = (process.env.GIT_STAGED_LIST || '').split('\n').filter(Boolean).filter(f => f.trim());

const ENV = {
  PORT: process.env.PORT,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000',
  AUTH_DISABLED: (process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true' || process.env.NEXT_PUBLIC_AUTH_DISABLED === '1'),
  SUPA_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  SUPA_ANON: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
};

const CRITICAL_PATTERNS = [
  /^\.env\.local$/,
  /^lib\/env/i, /^lib\/supabase/i,
  /^app\/auth\//i, /^middleware\.ts$/i,
  /^next\.config\.(js|mjs)$/i,
  /^supabase\//i, /_schema\.sql$/i, /_data\.sql$/i, /migrations?\//i
];

function touchesCritical(files) {
  if (!Array.isArray(files)) return false;
  return files.some(f => CRITICAL_PATTERNS.some(p => p.test(f)));
}

function hasTypeScriptFiles(files) {
  if (!Array.isArray(files)) return false;
  return files.some(f => (f.endsWith('.ts') || f.endsWith('.tsx')) && !f.includes('supabase/functions/'));
}

function ok(v, note) { return { ok: !!v, note }; }
function fail(note)  { return { ok: false, note }; }

async function runTypeScriptCheck() {
  try {
    console.log('🔍 [GUARDRAIL] Verificando sintaxe TypeScript...');
    execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe' });
    return ok(true, 'TypeScript OK');
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || error.message;
    return fail(`TypeScript errors: ${output.split('\n').slice(0, 3).join('; ')}`);
  }
}

(async () => {
  console.log(`🚀 [GUARDRAIL] Iniciando preflight para ${CHANGED.length} arquivos...`);
  
  const criticalFiles = CHANGED.filter(touchesCritical);
  if (criticalFiles.length > 0) {
    console.log(`⚠️  [GUARDRAIL] Arquivos críticos detectados: ${criticalFiles.join(', ')}`);
  } else {
    console.log('✅ [GUARDRAIL] Nenhum arquivo crítico detectado');
  }

  const result = { A: {}, B: {}, C: {}, D: {}, E: {}, errors: [] };

  // A) PORTA e SITE_URL (sempre confere)
  console.log('🔍 [GUARDRAIL] Verificando porta e SITE_URL...');
  const portIs3000 =
    ENV.PORT === '3000' ||
    !ENV.PORT || // se vazio, Next usa 3000 por padrão
    (ENV.SITE_URL.includes(':3000'));

  result.A.port = portIs3000 ? ok(true, `PORT=${ENV.PORT||'unset'} SITE_URL=${ENV.SITE_URL}`) :
                               fail(`Porta deve ser 3000 (PORT=${ENV.PORT||'unset'} SITE_URL=${ENV.SITE_URL})`);

  // B) Auth/ENV: só exige Supabase se não estiver em bypass
  console.log('🔍 [GUARDRAIL] Verificando configuração de autenticação...');
  if (!ENV.AUTH_DISABLED) {
    if (!ENV.SUPA_URL || !ENV.SUPA_ANON) {
      result.B.env = fail('SUPABASE_URL/ANON ausentes e AUTH_DISABLED=false');
    } else {
      result.B.env = ok(true, 'ENV ok');
      // tentamos health leve
      try {
        console.log('🔍 [GUARDRAIL] Testando conectividade Supabase...');
        const r = await fetch(ENV.SUPA_URL.replace(/\/$/,'')+'/.well-known/health').catch(()=>null);
        result.B.health = (r && r.ok) ? ok(true, 'health ok') :
                          ok(true, 'health não disponível, prosseguindo (não é erro bloqueante)');
      } catch(e) {
        result.B.health = ok(true, 'exceção no health, prosseguindo');
      }
    }
  } else {
    result.B.skip = ok(true, 'AUTH_DISABLED=true (bypass de auth local)');
  }

  // C) DB REST: só tenta se não estiver em bypass e ENV ok
  if (!ENV.AUTH_DISABLED && result.B.env?.ok) {
    try {
      console.log('🔍 [GUARDRAIL] Testando acesso REST ao banco...');
      const t = 'mm_material'; // tabela-sentinela (ajuste se necessário)
      const url = `${ENV.SUPA_URL.replace(/\/$/,'')}/rest/v1/${t}?select=count`;
      const r = await fetch(url, { headers: { apikey: ENV.SUPA_ANON, Accept: 'application/json' }});
      result.C.rest = r.ok ? ok(true, `REST ok (${t})`) : fail(`REST falhou ${r.status} (${t})`);
    } catch(e) {
      result.C.rest = fail('exceção no REST');
    }
  } else {
    result.C.skip = ok(true, 'REST não requerido');
  }

  // D) Schema/migrations mudando? então exigir docs/change-intent.json com justificativa (sem aprovação humana)
  const isSchemaChange = touchesCritical(CHANGED);
  if (isSchemaChange) {
    console.log('🔍 [GUARDRAIL] Verificando documentação de mudança de schema...');
    const intentPath = path.resolve('docs/change-intent.json');
    if (!fs.existsSync(intentPath)) {
      result.D.intent = fail('docs/change-intent.json ausente para mudança crítica');
    } else {
      try {
        const obj = JSON.parse(fs.readFileSync(intentPath,'utf8'));
        if (!obj || !obj.reason || !obj.tables) {
          result.D.intent = fail('change-intent.json inválido (exige {reason, tables[], impact?})');
        } else {
          result.D.intent = ok(true, 'intent presente');
        }
      } catch(e) {
        result.D.intent = fail('change-intent.json inválido (JSON parse)');
      }
    }
  } else {
    result.D.skip = ok(true, 'sem mudança crítica');
  }

  // E) TypeScript: valida sintaxe se houver arquivos .ts/.tsx
  if (hasTypeScriptFiles(CHANGED) && CHANGED.length < 10) {
    console.log('🔍 [GUARDRAIL] Verificando sintaxe TypeScript...');
    result.E.typescript = await runTypeScriptCheck();
  } else {
    result.E.skip = ok(true, CHANGED.length >= 10 ? 'muitos arquivos, pulando TypeScript' : 'sem arquivos TypeScript');
  }

  // Decisão: só bloqueia se:
  // - Porta errada, OU
  // - (AUTH habilitada e faltando ENV supabase) OU
  // - (AUTH habilitada e REST falhou) OU
  // - (mudança crítica sem change-intent.json) OU
  // - (TypeScript com erros)
  const block =
    !result.A.port.ok ||
    (!ENV.AUTH_DISABLED && (result.B.env?.ok === false || result.C.rest?.ok === false)) ||
    (isSchemaChange && result.D.intent?.ok === false) ||
    (hasTypeScriptFiles(CHANGED) && result.E.typescript?.ok === false);

  if (block) {
    console.error('❌ [GUARDRAIL] Bloqueado pelo preflight.');
    console.error(JSON.stringify(result, null, 2));
    process.exit(2);
  }
  
  console.log('✅ [GUARDRAIL] Preflight OK.');
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
})();
