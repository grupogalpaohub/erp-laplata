import { readFileSync, writeFileSync } from 'fs'
import { glob } from 'glob'

async function fixImports() {
  const files = await glob('**/*.{ts,tsx}', { 
    ignore: ['node_modules/**', '.next/**', 'dist/**'] 
  })

  let fixed = 0

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8')
      
      if (content.includes('@/lib/supabase/server')) {
        const newContent = content.replace(
          /@\/utils\/supabase\/server/g, 
          '@/lib/supabase/server'
        )
        
        if (newContent !== content) {
          writeFileSync(file, newContent)
          console.log(`✅ Fixed: ${file}`)
          fixed++
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error)
    }
  }

  console.log(`\n🎉 Fixed ${fixed} files`)
}

fixImports()
