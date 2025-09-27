/**
 * Verificador de guardrails para CI/pre-commit.
 * Rode:  npx tsx scripts/guardrails-check.ts
 */
import fg from "fast-glob";
import fs from "fs";

const patterns = JSON.parse(fs.readFileSync(".guardrails/patterns.json", "utf8"));
const dbContract = fs.existsSync("db_contract.json")
  ? JSON.parse(fs.readFileSync("db_contract.json", "utf8"))
  : { tables: {} };

let failed = false;

function die(msg: string) {
  console.error("🚫", msg);
  failed = true;
}

// 1) proibidos
for (const rule of patterns.forbidden) {
  const files = fg.sync(rule.paths, { dot: true });
  const rx = new RegExp(rule.pattern, "m");
  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    if (rx.test(content)) {
      die(`${rule.why} → ${f}`);
    }
  }
}

// 2) enforce SSR em API
for (const rule of patterns.enforceSsrInApi) {
  const files = fg.sync(rule.paths, { dot: true });
  const rx = new RegExp(rule.require, "m");
  for (const f of files) {
    const content = fs.readFileSync(f, "utf8");
    if (!rx.test(content)) {
      die(`API sem requisito (${rule.why}) → ${f}`);
    }
  }
}

// 3) contrato de schema (heurística simples: verificar uso de colunas não listadas)
const knownTables = dbContract.tables || {};
const columnUseRx = /\b([a-zA-Z_][\w]*)\s*\.\s*([a-zA-Z_][\w]*)\b/g; // table.column
const codeFiles = fg.sync(["app/**/*.ts?(x)", "lib/**/*.ts?(x)"], { dot: true });

for (const f of codeFiles) {
  const src = fs.readFileSync(f, "utf8");
  let m;
  while ((m = columnUseRx.exec(src))) {
    const [, t, c] = m;
    if (knownTables[t]) {
      if (!knownTables[t].includes(c)) {
        die(`Coluna desconhecida no contrato DB (SoT): ${t}.${c} → ${f}`);
      }
    }
  }
}

if (failed) {
  console.error("\n❌ Guardrails falharam. Corrija os pontos acima.");
  process.exit(1);
}
console.log("✅ Guardrails OK.");
