#!/usr/bin/env node
/* Repair script: normaliza tsconfig, corrige imports e garante libs essenciais.
 * Execução:  node tools/repair-project.cjs   (na raiz do repo)
 */
const fs = require('fs');
const path = require('path');

const FRONTEND = path.join(process.cwd(), 'frontend');
const SRC = path.join(FRONTEND, 'src');
const TSCONFIG = path.join(FRONTEND, 'tsconfig.json');

function fail(msg) { console.error('ERRO:', msg); process.exit(1); }
function ok(msg) { console.log('✔', msg); }
function info(msg) { console.log('→', msg); }

if (!fs.existsSync(FRONTEND)) fail("Pasta 'frontend/' não encontrada na raiz do repositório.");
if (!fs.existsSync(SRC)) fail("Pasta 'frontend/src/' não encontrada. Ajuste seu projeto para ficar em frontend/src/*.");

/* 1) tsconfig.json */
info('1) Atualizando tsconfig.json (baseUrl=src e aliases)…');
if (!fs.existsSync(TSCONFIG)) fail("tsconfig.json não encontrado em 'frontend/'.");
const tsRaw = fs.readFileSync(TSCONFIG, 'utf8');
let ts;
try { ts = JSON.parse(tsRaw); } catch (e) { fail('tsconfig.json inválido: ' + e.message); }
ts.compilerOptions = ts.compilerOptions || {};
ts.compilerOptions.baseUrl = 'src';
ts.compilerOptions.paths = ts.compilerOptions.paths || {};
ts.compilerOptions.paths['@/*'] = ['*'];
ts.compilerOptions.paths['@lib/*'] = ['lib/*'];
ts.compilerOptions.paths['@components/*'] = ['components/*'];
fs.writeFileSync(TSCONFIG, JSON.stringify(ts, null, 2) + '\n');
ok('tsconfig.json atualizado.');

/* 2) varrer arquivos e consertar imports */
info('2) Corrigindo imports quebrados…');

function walk(dir, out=[]) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) out.push(full);
  }
  return out;
}

const files = walk(SRC);

const replacements = [
  // @/src -> @/
  [/@\/src\/lib\//g, '@/lib/'],
  [/@\/src\/components\//g, '@/components/'],

  // relativos para @/lib
  [/(\.\.\/){3}lib\//g, '@/lib/'],
  [/(\.\.\/){2}lib\//g, '@/lib/'],
  [/\.\.\/lib\//g, '@/lib/'],

  // relativos para @/components
  [/(\.\.\/){3}components\//g, '@/components/'],
  [/(\.\.\/){2}components\//g, '@/components/'],
  [/\.\.\/components\//g, '@/components/'],

  // casos comuns de caminho errado
  [/@\/lib\/supabase\/server\.ts/g, '@/lib/supabase/server'],
  [/@\/lib\/supabase\/client\.ts/g, '@/lib/supabase/client'],
];

let edited = 0;
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  let orig = src;
  for (const [regex, to] of replacements) src = src.replace(regex, to);
  if (src !== orig) {
    fs.writeFileSync(f, src);
    edited++;
  }
}
ok(`Imports normalizados em ${edited} arquivo(s).`);

/* 3) garantir libs essenciais */
info('3) Garantindo libs supabase/auth/data…');
const libSupabaseDir = path.join(SRC, 'lib', 'supabase');
fs.mkdirSync(libSupabaseDir, { recursive: true });

// server.ts
const serverTs = path.join(libSupabaseDir, 'server.ts');
if (!fs.existsSync(serverTs)) {
  fs.writeFileSync(serverTs, `
import 'server-only';
import { cookies, headers } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function supabaseServer() {
  const cookieStore = cookies();
  const hdrs = headers();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set(name: string, value: string, options: CookieOptions) { try { cookieStore.set({ name, value, ...options }); } catch {} },
        remove(name: string, options: CookieOptions) { try { cookieStore.set({ name, value: '', ...options }); } catch {} },
      },
      headers: {
        'X-Forwarded-For': hdrs.get('x-forwarded-for') ?? '',
        'User-Agent': hdrs.get('user-agent') ?? '',
      },
    }
  );
}
`.trim() + '\n');
  ok('Criado: src/lib/supabase/server.ts');
}

// client.ts
const clientTs = path.join(libSupabaseDir, 'client.ts');
if (!fs.existsSync(clientTs)) {
  fs.writeFileSync(clientTs, `
'use client';
import { createBrowserClient } from '@supabase/ssr';
export function supabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`.trim() + '\n');
  ok('Criado: src/lib/supabase/client.ts');
}

// auth.ts
const authTs = path.join(SRC, 'lib', 'auth.ts');
if (!fs.existsSync(authTs)) {
  fs.writeFileSync(authTs, `
import { supabaseServer } from '@/lib/supabase/server';
export async function requireSession() {
  const sb = supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  return { isAuthenticated: !!user, user: user ?? null };
}
`.trim() + '\n');
  ok('Criado: src/lib/auth.ts');
}

// data.ts
const dataTs = path.join(SRC, 'lib', 'data.ts');
if (!fs.existsSync(dataTs)) {
  fs.writeFileSync(dataTs, `
import { supabaseServer } from '@/lib/supabase/server';
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || 'LaplataLunaria';

export async function getMaterialTypes() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('mm_category_def')
    .select('category')
    .eq('tenant_id', TENANT)
    .eq('is_active', true)
    .order('category', { ascending: true });
  if (error) throw error; return (data??[]).map(r=>r.category);
}

export async function getMaterialClassifications() {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('mm_classification_def')
    .select('classification')
    .eq('tenant_id', TENANT)
    .eq('is_active', true)
    .order('classification', { ascending: true });
  if (error) throw error; return (data??[]).map(r=>r.classification);
}

export async function getMaterials(limit=1000) {
  const sb = supabaseServer();
  const { data, error } = await sb
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status')
    .eq('tenant_id', TENANT)
    .order('mm_material', { ascending: true })
    .limit(limit);
  if (error) throw error; return data??[];
}
`.trim() + '\n');
  ok('Criado: src/lib/data.ts');
}

/* 4) relatório de restos '@/src/' */
info("4) Verificando se restou '@/src/' nos imports…");
const offenders = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  if (src.includes('@/src/')) offenders.push(path.relative(process.cwd(), f));
}
if (offenders.length) {
  console.log('\nATENÇÃO: ainda existem imports com "@/src/". Corrija manualmente estes arquivos:');
  offenders.forEach(f => console.log(' -', f));
  process.exitCode = 2; // sinaliza atenção, mas não quebra
} else {
  ok('Nenhum import "@/src/" restante.');
}

ok('Concluído. Agora faça commit e tente novo deploy no Vercel.');

