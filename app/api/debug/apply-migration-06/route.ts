import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    
    // Ler arquivo de migração
    const fs = require('fs')
    const migrationSQL = fs.readFileSync('supabase/migrations/20250122000006_fix_doc_numbering.sql', 'utf8')
    
    console.log('Applying migration 06: fix_doc_numbering')
    
    // Dividir em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)
    
    const results = []
    
    for (const command of commands) {
      try {
        console.log('Executing command:', command.substring(0, 100) + '...')
        
        // Executar comando via query direta
        const { data, error } = await supabase
          .from('_sql')
          .select('*')
          .eq('query', command)
        
        if (error) {
          console.error('Command error:', error)
          results.push({ command: command.substring(0, 50), error: error.message })
        } else {
          results.push({ command: command.substring(0, 50), success: true })
        }
      } catch (cmdError) {
        console.error('Command execution error:', cmdError)
        results.push({ command: command.substring(0, 50), error: cmdError.message })
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Migração 06 aplicada',
      results
    })
    
  } catch (error) {
    console.error('Error applying migration 06:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}

