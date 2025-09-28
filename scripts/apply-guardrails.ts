// scripts/apply-guardrails.ts
// Script para aplicar guardrails em lote
// Executar: npx tsx scripts/apply-guardrails.ts

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const FIXES = [
  {
    name: 'Supabase SSR',
    pattern: /import\s+{\s*createClient\s*}\s+from\s+['"]@supabase\/supabase-js['"]/g,
    replacement: "import { supabaseServer, getTenantFromSession } from '@/lib/supabase/server'"
  },
  {
    name: 'Supabase Client Usage',
    pattern: /const\s+supabase\s*=\s*createClient\([^)]+\)/g,
    replacement: 'const supabase = supabaseServer()'
  },
  {
    name: 'Envelope Response - Success',
    pattern: /NextResponse\.json\(\s*{\s*ok:\s*true,\s*([^}]+)\s*}\s*\)/g,
    replacement: 'return success($1)'
  },
  {
    name: 'Envelope Response - Error',
    pattern: /NextResponse\.json\(\s*{\s*ok:\s*false,\s*error:\s*([^}]+)\s*}\s*,\s*{\s*status:\s*(\d+)\s*}\s*\)/g,
    replacement: 'return fail(\'ERROR_CODE\', $1, $2)'
  },
  {
    name: 'Pagination Helper',
    pattern: /const\s+page\s*=\s*Number\([^)]+\);\s*const\s+pageSize\s*=\s*Math\.min\([^)]+\);\s*const\s+from\s*=\s*\([^)]+\);\s*const\s+to\s*=\s*from\s*\+\s*pageSize\s*-\s*1;/g,
    replacement: 'const { page, pageSize, from, to } = parsePagination(url.searchParams);'
  }
];

const ALLOWED_EXTENSIONS = ['.ts', '.tsx'];
const IGNORE_DIRS = ['node_modules', '.git', '.next', 'dist', 'build'];

function getAllFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.includes(item)) {
          files.push(...getAllFiles(fullPath));
        }
      } else if (ALLOWED_EXTENSIONS.includes(extname(item))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // Ignorar erros de permissão
  }
  
  return files;
}

function applyFixes(filePath: string): { modified: boolean; changes: string[] } {
  const changes: string[] = [];
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  for (const fix of FIXES) {
    const originalContent = content;
    content = content.replace(fix.pattern, fix.replacement);
    
    if (content !== originalContent) {
      modified = true;
      changes.push(fix.name);
    }
  }
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
  }
  
  return { modified, changes };
}

function main() {
  console.log('🔧 Aplicando guardrails em lote...\n');
  
  const projectRoot = process.cwd();
  const files = getAllFiles(projectRoot);
  const apiFiles = files.filter(f => f.includes('/app/api/'));
  
  let totalModified = 0;
  const results: Array<{ file: string; changes: string[] }> = [];
  
  for (const file of apiFiles) {
    const result = applyFixes(file);
    if (result.modified) {
      totalModified++;
      results.push({ file, changes: result.changes });
      console.log(`✅ ${file}: ${result.changes.join(', ')}`);
    }
  }
  
  console.log(`\n📊 Resumo:`);
  console.log(`  Arquivos processados: ${apiFiles.length}`);
  console.log(`  Arquivos modificados: ${totalModified}`);
  console.log(`  Total de mudanças: ${results.reduce((acc, r) => acc + r.changes.length, 0)}`);
  
  if (totalModified > 0) {
    console.log('\n⚠️  ATENÇÃO: Revise as mudanças antes de fazer commit!');
  }
}

if (require.main === module) {
  main();
}

export { applyFixes, FIXES };
