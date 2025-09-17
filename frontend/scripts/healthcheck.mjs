#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 ERP Laplata - Healthcheck de Build e Rotas\n');

// 1. Verificar se next build funciona
console.log('1️⃣ Executando next build...');
try {
  execSync('npm run build', { stdio: 'pipe', cwd: process.cwd() });
  console.log('✅ next build executado com sucesso');
} catch (error) {
  console.error('❌ next build falhou:', error.message);
  process.exit(1);
}

// 2. Executar pages:build
console.log('\n2️⃣ Executando pages:build...');
try {
  execSync('npm run pages:build', { stdio: 'pipe', cwd: process.cwd() });
  console.log('✅ pages:build executado com sucesso');
} catch (error) {
  console.error('❌ pages:build falhou:', error.message);
  process.exit(1);
}

// 3. Verificar se .vercel/output foi criado
console.log('\n3️⃣ Verificando estrutura de output...');
const staticDir = join(process.cwd(), '.vercel/output/static');
const functionsDir = join(process.cwd(), '.vercel/output/functions');

if (!existsSync(staticDir)) {
  console.error('❌ .vercel/output/static não encontrado');
  process.exit(1);
}
console.log('✅ .vercel/output/static encontrado');

if (!existsSync(functionsDir)) {
  console.error('❌ .vercel/output/functions não encontrado');
  process.exit(1);
}
console.log('✅ .vercel/output/functions encontrado');

// 4. Verificar se as rotas principais existem
console.log('\n4️⃣ Verificando rotas principais...');
const routes = [
  'index.html',
  'dashboard/index.html',
  'wh/index.html',
  'wh/inventory/index.html',
  'wh/movements/index.html',
  'wh/reports/index.html',
  'mm/index.html',
  'sd/index.html',
  'crm/index.html',
  'fi/index.html',
  'co/index.html'
];

let missingRoutes = [];
for (const route of routes) {
  const routePath = join(staticDir, route);
  if (!existsSync(routePath)) {
    missingRoutes.push(route);
  }
}

if (missingRoutes.length > 0) {
  console.error('❌ Rotas faltando:', missingRoutes.join(', '));
  process.exit(1);
}
console.log('✅ Todas as rotas principais encontradas');

// 5. Verificar se há CSS compilado
console.log('\n5️⃣ Verificando assets CSS...');
const cssDir = join(staticDir, '_next/static/css');
if (!existsSync(cssDir)) {
  console.error('❌ CSS não encontrado em _next/static/css');
  process.exit(1);
}
console.log('✅ CSS compilado encontrado');

console.log('\n🎉 Healthcheck concluído com sucesso!');
console.log('✅ Build funcionando');
console.log('✅ Rotas dinâmicas configuradas');
console.log('✅ Assets compilados');
console.log('✅ Pronto para deploy no Cloudflare Pages');