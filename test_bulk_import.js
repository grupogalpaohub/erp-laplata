const fs = require('fs');
const fetch = require('node-fetch');

// Função para parsear CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const materials = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length !== headers.length) continue;
    
    const material = {};
    for (let j = 0; j < headers.length; j++) {
      material[headers[j]] = values[j];
    }
    materials.push(material);
  }
  
  return materials;
}

// Função para testar validação
async function testValidation(materials, testName) {
  console.log(`\n🔍 TESTANDO VALIDAÇÃO - ${testName}`);
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/api/mm/materials/bulk-validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materials })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro na validação:', result.error);
      return false;
    }
    
    console.log(`📊 Total de materiais: ${materials.length}`);
    console.log(`✅ Válidos: ${result.results.filter(r => r.is_valid).length}`);
    console.log(`❌ Inválidos: ${result.results.filter(r => !r.is_valid).length}`);
    
    result.results.forEach((result, index) => {
      if (result.is_valid) {
        console.log(`  ✅ Linha ${index + 1}: ${result.generated_id || 'ID existente'}`);
      } else {
        console.log(`  ❌ Linha ${index + 1}: ${result.error_message}`);
      }
    });
    
    return result.results.every(r => r.is_valid);
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    return false;
  }
}

// Função para testar importação
async function testImport(materials, testName) {
  console.log(`\n🚀 TESTANDO IMPORTAÇÃO - ${testName}`);
  console.log('=' .repeat(50));
  
  try {
    const response = await fetch('http://localhost:3000/api/mm/materials/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materials })
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ Erro na importação:', result.error);
      return false;
    }
    
    console.log(`📊 Resultado da importação:`);
    console.log(`  ✅ Importados: ${result.imported}`);
    console.log(`  ❌ Erros: ${result.errors}`);
    
    result.results.forEach((result, index) => {
      if (result.success) {
        console.log(`  ✅ ${result.mm_material}: ${result.action}`);
      } else {
        console.log(`  ❌ ${result.mm_material}: ${result.error}`);
      }
    });
    
    return result.errors === 0;
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    return false;
  }
}

// Função principal
async function runTests() {
  console.log('🎯 INICIANDO TESTES DE IMPORTAÇÃO EM MASSA');
  console.log('=' .repeat(60));
  
  const tests = [
    { file: 'teste1.csv', name: 'TESTE 1 - Criação' },
    { file: 'teste2.csv', name: 'TESTE 2 - Alteração' },
    { file: 'teste3.csv', name: 'TESTE 3 - Criação + Alteração' }
  ];
  
  let totalSuccess = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const materials = parseCSV(test.file);
      console.log(`\n📁 Processando ${test.file}: ${materials.length} materiais`);
      
      // Testar validação
      const validationSuccess = await testValidation(materials, test.name);
      
      if (validationSuccess) {
        // Testar importação
        const importSuccess = await testImport(materials, test.name);
        
        if (importSuccess) {
          console.log(`✅ ${test.name} - SUCESSO COMPLETO`);
          totalSuccess++;
        } else {
          console.log(`❌ ${test.name} - FALHOU NA IMPORTAÇÃO`);
        }
      } else {
        console.log(`❌ ${test.name} - FALHOU NA VALIDAÇÃO`);
      }
    } catch (error) {
      console.error(`❌ ${test.name} - ERRO:`, error.message);
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 RESUMO FINAL: ${totalSuccess}/${totalTests} testes passaram`);
  
  if (totalSuccess === totalTests) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
  } else {
    console.log('⚠️  ALGUNS TESTES FALHARAM!');
  }
}

// Executar testes
runTests().catch(console.error);
