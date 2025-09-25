/* eslint-disable no-console */
const fs = require("fs");
const yaml = require("js-yaml");
const { globSync } = require("glob");

function fail(m){ console.error("\n❌ "+m+"\n"); process.exit(2); }
function read(f){ try {return fs.readFileSync(f,"utf8")}catch{return ""} }

const cfg = yaml.load(fs.readFileSync("scripts/guardrails/regressions.yml","utf8"));
const changed = (process.env.GIT_STAGED_LIST||"").split(/\s+/).filter(Boolean);

for (const rule of cfg.rules||[]){
  const targets = globSync(rule.paths||[], {nodir:true, dot:true});
  for (const file of targets){
    const txt = read(file);
    if (rule.immutable && changed.includes(file)) fail(`Área congelada alterada (${rule.name}): ${file}`);
    if (rule.onlyIfContains && !rule.onlyIfContains.some(s => txt.includes(s))) continue;
    if (rule.ifRegex && !rule.ifRegex.some(r => new RegExp(r,"m").test(txt))) continue;
    if (rule.mustContain) for (const s of rule.mustContain) if (!txt.includes(s)) fail(`(${rule.name}) '${s}' deve existir em ${file}`);
    if (rule.mustNotContain) for (const s of rule.mustNotContain) if (txt.includes(s)) fail(`(${rule.name}) '${s}' proibido em ${file}`);
    if (rule.mustNotRegex) for (const r of rule.mustNotRegex) if (new RegExp(r,"m").test(txt)) fail(`(${rule.name}) padrão proibido ${r} em ${file}`);
  }
}
console.log("✅ regression-check OK.");