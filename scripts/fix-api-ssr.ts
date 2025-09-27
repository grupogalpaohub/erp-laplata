// scripts/fix-api-ssr.ts
import fg from "fast-glob";
import fs from "fs";

(async () => {
  const files = await fg(["app/api/**/*.{ts,tsx,js,jsx}"], { dot:true });
  for (const f of files) {
    let s = fs.readFileSync(f, "utf8");
    const before = s;

    // remove imports errados
    s = s.replace(/import\s+{?\s*createClient\s*}?\s+from\s+['"]@supabase\/supabase-js['"];?\n?/g, "");
    // garante imports corretos
    if (!/from\s+['"]@supabase\/ssr['"]/.test(s)) {
      s = `import { createServerClient } from '@supabase/ssr';\n` + s;
    }
    if (!/from\s+['"]next\/headers['"]/.test(s)) {
      s = `import { cookies } from 'next/headers';\n` + s;
    }
    // injeta cookieStore + client se não existir
    if (!/cookies\s*\(\)/.test(s)) {
      s = s.replace(/export\s+async\s+function\s+(GET|POST|PUT|DELETE)/, `const cookieStore = cookies();\n\n$&`);
    }
    if (!/createServerClient\s*\(/.test(s)) {
      s = s.replace(/export\s+async\s+function\s+(GET|POST|PUT|DELETE)\s*\(/,
`const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { cookies: { get: (n) => cookieStore.get(n)?.value } }
);

export async function $1(`);
    }

    if (s !== before) {
      fs.writeFileSync(f, s, "utf8");
      console.log("fixed:", f);
    }
  }
  console.log("✅ fix-api-ssr: concluído");
})();
