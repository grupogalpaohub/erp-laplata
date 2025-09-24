/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

function fail(msg){ console.error('\n❌ ' + msg + '\n'); process.exit(2); }
function read(f){ try { return fs.readFileSync(f,'utf8'); } catch { return ''; } }
function list(patterns){
  const set = new Set();
  for (const p of patterns){
    for (const f of glob.sync(p, { nodir:true, dot:true })) set.add(f);
  }
  return [...set];
}

const cfgPath = 'scripts/guardrails/regressions.yml';
if (!fs.existsSync(cfgPath)) fail(`Arquivo ${cfgPath} não encontrado.`);
const cfg = yaml.load(fs.readFileSync(cfgPath,'utf8'));
if (!cfg || !Array.isArray(cfg.rules)) fail('regressions.yml inválido (esperado rules: []).');

const changedListEnv = process.env.GIT_STAGED_LIST || '';
const changed = [...new Set(changedListEnv.split(/\s+/).filter(Boolean))];

for (const rule of cfg.rules){
  const allTargets = list(rule.paths || []);
  const excludeTargets = rule.excludePaths ? list(rule.excludePaths) : [];
  const filteredTargets = allTargets.filter(f => !excludeTargets.some(ex => f.includes(ex)));
  const targets = rule.immutable ? filteredTargets.filter(f => changed.includes(f)) : filteredTargets;
  if (!targets.length) continue;

  for (const file of targets){
    const txt = read(file);
    // Bloqueio total se immutable e arquivo mudou
    if (rule.immutable && changed.includes(file)){
      fail(`Arquivo/área congelada alterada (${rule.name}): ${file}`);
    }
    // onlyIfContains: só aplica a regra se contiver certas strings
    if (rule.onlyIfContains && !rule.onlyIfContains.some(s => txt.includes(s))) continue;
    // ifRegex: só aplica se houver tais regex (heurística de mutação)
    if (rule.ifRegex){
      const any = rule.ifRegex.some(r => new RegExp(r,'m').test(txt));
      if (!any) continue;
    }
    // mustContain
    if (rule.mustContain){
      for (const s of rule.mustContain){
        if (!txt.includes(s)){
          fail(`Regressão (${rule.name}): arquivo precisa conter '${s}' → ${file}`);
        }
      }
    }
    // mustNotContain
    if (rule.mustNotContain){
      for (const s of rule.mustNotContain){
        if (txt.includes(s)){
          fail(`Regressão (${rule.name}): '${s}' não pode existir em ${file}`);
        }
      }
    }
    // mustNotRegex
    if (rule.mustNotRegex){
      for (const pattern of rule.mustNotRegex){
        if (new RegExp(pattern,'m').test(txt)){
          fail(`Regressão (${rule.name}): padrão proibido ${pattern} em ${file}`);
        }
      }
    }
  }
}

console.log('✅ regression-check: aprovado.');
