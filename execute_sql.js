const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://gpjcfwjssfvqhppxdudp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwamNmd2pzc2Z2cWhwcHhkdWRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImiYXQiOjE3NTc5NDQyOTUsImV4cCI6MjA3MzUyMDI5NX0.QX3vlHLduidBh1HFFklS4P9xkL5xhe9oOnhZ2fcb-_s';

const supabase = createClient(supabaseUrl, supabaseKey);

// Ler o script SQL
const fs = require('fs');
const sqlScript = fs.readFileSync('supabase_automation_script.sql', 'utf8');

async function executeSQL() {
  try {
    console.log('🚀 Executando script de automação...');
    
    // Executar o script SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: sqlScript
    });

    if (error) {
      console.error('❌ Erro ao executar SQL:', error);
      return;
    }

    console.log('✅ Script executado com sucesso!');
    console.log('📊 Resultado:', data);

    // Executar script de teste
    console.log('\n🧪 Executando testes...');
    const testScript = fs.readFileSync('test_automation.sql', 'utf8');
    
    const { data: testData, error: testError } = await supabase.rpc('exec_sql', {
      sql: testScript
    });

    if (testError) {
      console.error('❌ Erro no teste:', testError);
    } else {
      console.log('✅ Testes executados com sucesso!');
      console.log('📊 Resultado dos testes:', testData);
    }

  } catch (err) {
    console.error('❌ Erro geral:', err);
  }
}

executeSQL();
