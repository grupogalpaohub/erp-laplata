#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'
import path from 'path'

const PROTECTED_PAGES = 'app/(protected)/**/*.tsx'

async function fixSupabaseReadOnly() {
  console.log('🔧 Corrigindo supabaseServer() para supabaseServerReadOnly() em páginas protegidas...')
  
  const files = await glob(PROTECTED_PAGES)
  let fixed = 0
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8')
      
      // Verificar se usa supabaseServer() mas não é uma API route
      if (content.includes('supabaseServer()') && !file.includes('/api/')) {
        let newContent = content
        
        // Substituir import
        if (content.includes("import { supabaseServer } from '@/lib/supabase/server'")) {
          newContent = newContent.replace(
            "import { supabaseServer } from '@/lib/supabase/server'",
            "import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'"
          )
        }
        
        // Substituir uso
        if (content.includes('const supabase = supabaseServer()')) {
          newContent = newContent.replace(
            'const supabase = supabaseServer()',
            'const supabase = supabaseServerReadOnly()'
          )
        }
        
        // Substituir outras variações
        if (content.includes('= supabaseServer()')) {
          newContent = newContent.replace(
            /= supabaseServer\(\)/g,
            '= supabaseServerReadOnly()'
          )
        }
        
        if (newContent !== content) {
          writeFileSync(file, newContent, 'utf8')
          console.log(`✅ Corrigido: ${file}`)
          fixed++
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar ${file}:`, error)
    }
  }
  
  console.log(`\n🎉 Correção concluída! ${fixed} arquivos corrigidos.`)
}

fixSupabaseReadOnly().catch(console.error)
