#!/usr/bin/env tsx
// Script para substituir getSupabaseServerClient por supabaseServer() em todos os arquivos

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const TARGET_DIR = 'app'
const OLD_IMPORT = "import { getSupabaseServerClient } from '@/lib/supabase/server'"
const NEW_IMPORT = "import { supabaseServer } from '@/lib/supabase/server'"
const OLD_USAGE = 'getSupabaseServerClient()'
const NEW_USAGE = 'supabaseServer()'

function processFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    if (!content.includes('getSupabaseServerClient')) {
      return false
    }
    
    let newContent = content
    
    // Substituir import
    if (newContent.includes(OLD_IMPORT)) {
      newContent = newContent.replace(OLD_IMPORT, NEW_IMPORT)
    }
    
    // Substituir uso
    if (newContent.includes(OLD_USAGE)) {
      newContent = newContent.replace(new RegExp(OLD_USAGE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_USAGE)
    }
    
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

function walkDirectory(dir: string): string[] {
  const files: string[] = []
  
  try {
    const items = readdirSync(dir)
    
    for (const item of items) {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...walkDirectory(fullPath))
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error)
  }
  
  return files
}

function main() {
  console.log('🔧 Fixing Supabase clients...')
  
  const files = walkDirectory(TARGET_DIR)
  let fixedCount = 0
  
  for (const file of files) {
    if (processFile(file)) {
      fixedCount++
    }
  }
  
  console.log(`\n🎉 Fixed ${fixedCount} files`)
}

main()
