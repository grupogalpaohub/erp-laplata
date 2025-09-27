// scripts/security-guardrail.ts
import fg from "fast-glob";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const read = (p: string) => fs.readFileSync(p, "utf8");
const ignore = ["**/node_modules/**","**/.next/**","**/.git/**"];

const allowDDL = ["supabase/migrations/**"]; // DDL só aqui

type V = { file:string; rule:string; hint:string };
const hit = (arr:V[], file:string, rule:string, hint:string) => arr.push({file,rule,hint});

const isMatch = (file: string, patterns: string[]) => {
  return patterns.some(p => file.includes(p.replace("**", "")));
};

(async () => {
  const files = await fg(["**/*.{ts,tsx,js,jsx,sql}"], { dot:true, ignore });
  const v:V[] = [];

  for (const f of files) {
    const file = f.replace(/\\/g,"/");
    const src = read(file);
    const isCode = /\.(ts|tsx|js|jsx)$/.test(file);
    const isSql  = /\.sql$/.test(file);
    const inApi  = file.startsWith("app/api/");
    const inMig  = isMatch(file, allowDDL);

    // 1) SERVICE_ROLE_KEY em código (permitido SOMENTE em supabase/functions/**)
    const ALLOW_SERVICE_ROLE_IN = ["supabase/functions/**"];
    const allowedForServiceRole = ALLOW_SERVICE_ROLE_IN.some((pat) =>
      file.includes(pat.replace("**", ""))
    );
    // Ignorar o próprio script de guardrail
    if (isCode && /(SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY)/i.test(src) && !allowedForServiceRole && !file.includes("security-guardrail.ts")) {
      hit(v, file, "SERVICE_ROLE_KEY em código",
        "Permitido só em supabase/functions/** (server-only). Em qualquer outro lugar é proibido.");
    }
    // 2) Conversão monetária errada (ignorar o próprio script)
    if (isCode && (/\/\s*10000\b|(?:\*\s*0\.?0*01)/.test(src)) && !file.includes("security-guardrail.ts")) {
      hit(v,file,"/10000 em conversão de moeda","Valores são em centavos → dividir por 100 no front, use util único.");
    }
    // 3) DDL em código/SQL fora de migrations
    const ddl = /\b(create|alter|drop)\s+(table|function|schema|type|trigger|policy|view)\b/i;
    if (!inMig && ((isCode && ddl.test(src)) || (isSql && ddl.test(src)))) {
      hit(v,file,"DDL fora de migrations","Movimente DDL para supabase/migrations/*.sql.");
    }
    // 4) app/api/** deve usar @supabase/ssr + cookies()
    if (inApi && isCode) {
      const usesBrowser = /from\s+['"]@supabase\/supabase-js['"]/.test(src) && /createClient\s*\(/.test(src);
      const hasSSR = /from\s+['"]@supabase\/ssr['"]/.test(src) && /createServerClient\s*\(/.test(src);
      const hasCookies = /from\s+['"]next\/headers['"]/.test(src) && /cookies\s*\(/.test(src);
      if (usesBrowser || !(hasSSR && hasCookies)) {
        hit(v,file,"API sem requisito (SSR + cookies())","Troque para createServerClient de '@supabase/ssr' com cookies().");
      }
    }
    // 5) tenant hardcoded
    if (!inMig && isCode && /['"`]tenant_id['"`]\s*[:=]\s*['"`][\w-]+['"`]/.test(src)) {
      hit(v,file,"tenant_id hardcoded","Derive tenant via RLS/JWT no server; nunca literal.");
    }
    // 6) função de fallback proibida
    if ((isCode || isSql) && /get_current_tenant_id\s*\(/i.test(src)) {
      hit(v,file,"Função de tenant com fallback","Use public.current_tenant() (auth.uid() ↔ user_profile).");
    }
    // 7) JWTs em texto
    if (isCode && /eyJ[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}\.[a-zA-Z0-9_\-]{10,}/.test(src)) {
      hit(v,file,"Token JWT encontrado","Remova tokens do repositório.");
    }
  }

  if (v.length) {
    console.error("⛔ SECURITY GUARDRAIL — violações:");
    for (const x of v) console.error(`• [${x.rule}] ${x.file}\n  ↳ ${x.hint}`);
    process.exit(1);
  }
  console.log("✅ Guardrails OK — nenhum problema encontrado.");
})();
