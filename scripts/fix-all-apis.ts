// scripts/fix-all-apis.ts
import fg from "fast-glob";
import fs from "fs";

(async () => {
  const files = await fg(["app/api/**/*.{ts,tsx,js,jsx}"], { dot: true });
  
  for (const f of files) {
    let s = fs.readFileSync(f, "utf8");
    const before = s;

    // Substituir imports antigos
    s = s.replace(
      /import\s+{\s*createServerClient\s*}\s+from\s+['"]@supabase\/ssr['"];?\n?/g,
      ""
    );
    s = s.replace(
      /import\s+{\s*cookies\s*}\s+from\s+['"]next\/headers['"];?\n?/g,
      ""
    );

    // Adicionar import do supabaseServer
    if (!/from\s+['"]@\/lib\/supabase\/server['"]/.test(s)) {
      s = `import { supabaseServer } from '@/utils/supabase/server'\n` + s;
    }

    // Substituir criação manual do cliente
    s = s.replace(
      /const\s+cookieStore\s*=\s*cookies\(\)\s*\n\s*const\s+sb\s*=\s*createServerClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\s*\{\s*cookies:\s*\{\s*get\(name:\s*string\)\s*\{\s*return\s+cookieStore\.get\(name\)\?\.value\s*\}\s*,\s*set\(\)\s*\{\}\s*,\s*remove\(\)\s*\{\}\s*\}\s*\}\s*\)/g,
      "const sb = supabaseServer()"
    );

    // Substituir versões mais simples
    s = s.replace(
      /const\s+cookieStore\s*=\s*cookies\(\)\s*\n\s*const\s+sb\s*=\s*createServerClient\(\s*process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,\s*\{\s*cookies:\s*\{\s*get:\s*\(n\)\s*=>\s*cookieStore\.get\(n\)\?\.value\s*\}\s*\}\s*\)/g,
      "const sb = supabaseServer()"
    );

    if (s !== before) {
      fs.writeFileSync(f, s, "utf8");
      console.log("fixed:", f);
    }
  }
  
  console.log("✅ fix-all-apis: concluído");
})();
