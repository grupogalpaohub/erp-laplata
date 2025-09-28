#!/usr/bin/env tsx
// Script para corrigir os arquivos restantes com getSupabaseServerClient

import { readFileSync, writeFileSync } from 'fs'

const files = [
  'app/(protected)/wh/_actions.ts',
  'app/(protected)/sd/orders/data.ts',
  'app/(protected)/sd/orders/actions.ts',
  'app/(protected)/mm/materials/actions.ts',
  'app/(protected)/mm/catalog/data.ts',
  'app/(protected)/crm/_actions.ts',
  'app/(protected)/crm/customers/data.ts',
  'app/(protected)/crm/customers/actions.ts'
]

function fixFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    if (!content.includes('getSupabaseServerClient')) {
      console.log(`⏭️  Skipping ${filePath} - no getSupabaseServerClient found`)
      return false
    }
    
    let newContent = content
    
    // Substituir import
    newContent = newContent.replace(
      /import\s*{\s*getSupabaseServerClient\s*}\s*from\s*["']@\/lib\/supabase\/server["']/g,
      "import { supabaseServer } from '@/utils/supabase/server'"
    )
    
    // Substituir uso
    newContent = newContent.replace(
      /getSupabaseServerClient\(\)/g,
      'supabaseServer()'
    )
    
    if (newContent !== content) {
      writeFileSync(filePath, newContent, 'utf-8')
      console.log(`✅ Fixed: ${filePath}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error)
    return false
  }
}

function main() {
  console.log('🔧 Fixing remaining Supabase clients...')
  
  let fixedCount = 0
  
  for (const file of files) {
    if (fixFile(file)) {
      fixedCount++
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files`)
}

main()
