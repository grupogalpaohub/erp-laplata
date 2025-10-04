const fs = require('fs');
const path = require('path');

// Função para corrigir uma página
function fixPage(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir requireSession() por verificação condicional
    if (content.includes('await requireSession()')) {
      content = content.replace(
        /await requireSession\(\)/g,
        `// Em desenvolvimento, não verificar sessão (Google OAuth não funciona localmente)
    if (process.env.NODE_ENV === 'production') {
      await requireSession()
    }`
      );
    }
    
    // Substituir requireTenantId() por verificação condicional
    if (content.includes('await requireTenantId()')) {
      content = content.replace(
        /const tenantId = await requireTenantId\(\)/g,
        `// Em desenvolvimento, usar tenant padrão (Google OAuth não funciona localmente)
    const tenantId = process.env.NODE_ENV === 'development' ? 'LaplataLunaria' : await requireTenantId()`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Função para percorrer diretórios recursivamente
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Corrigir todas as páginas protegidas
const protectedDir = path.join(__dirname, 'app', '(protected)');
const files = walkDir(protectedDir);

console.log(`🔧 Fixing ${files.length} files...`);

let fixedCount = 0;
files.forEach(file => {
  if (fixPage(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files successfully!`);
