/**
 * Node script para gerar db_contract.json (whitelist de tabelas/colunas).
 * Rode:  npx tsx scripts/generate-db-contract.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const INPUTS = [
  // ajuste para os arquivos reais do seu repo:
  "c:\\SupabaseBackup\\20250926\\supabase_schema.sql",
  // se tiver dumps/JSON auxiliares, adicione aqui
];

const out = {
  tables: {} as Record<string, string[]>
};

// regex simples para CREATE TABLE e colunas — suficiente para validar nomes
const tableRx = /create\s+table\s+if\s+not\s+exists\s+["']?public["']?\.(\w+)\s*\(([\s\S]*?)\)\s*;/gi;
const columnRx = /["']?(\w+)["']?\s+([a-zA-Z_][\w\(\)]*)/g;

let allSql = "";
for (const p of INPUTS) {
  try {
    allSql += "\n" + readFileSync(join(process.cwd(), p), "utf8");
  } catch (e) {
    console.warn(`⚠️ Arquivo não encontrado: ${p}`);
  }
}

let m;
while ((m = tableRx.exec(allSql))) {
  const [, table, body] = m;
  const cols = new Set<string>();
  let c;
  while ((c = columnRx.exec(body))) {
    const col = c[1];
    cols.add(col);
  }
  out.tables[table] = Array.from(cols).sort();
}

writeFileSync("db_contract.json", JSON.stringify(out, null, 2));
console.log("✅ db_contract.json gerado com", Object.keys(out.tables).length, "tabelas.");
