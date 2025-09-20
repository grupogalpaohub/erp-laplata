# Harmonização de Cadastro de Materiais

## Visão Geral

O sistema de cadastro de materiais possui três componentes principais que devem estar sempre harmonizados:

1. **Cadastro Individual** (`/mm/materials/new`)
2. **Edição em Massa** (`/mm/materials/bulk-edit`)
3. **Template de Importação** (`/mm/materials/bulk-import`)

## Configuração Centralizada

Todos os valores de configuração estão centralizados em `src/lib/material-config.ts`:

### Tipos de Material
```typescript
export const MATERIAL_TYPES = [
  { type: 'brinco', name: 'Brinco' },
  { type: 'gargantilha', name: 'Gargantilha' },
  { type: 'choker', name: 'Choker' },
  { type: 'pulseira', name: 'Pulseira' },
  { type: 'kit', name: 'Kit' }
]
```

### Classificações de Material
```typescript
export const MATERIAL_CLASSIFICATIONS = [
  { classification: 'acessorio', name: 'Acessório' },
  { classification: 'joia', name: 'Joia' },
  { classification: 'bijuteria', name: 'Bijuteria' },
  { classification: 'semi-joia', name: 'Semi-joia' }
]
```

### Unidades de Medida
```typescript
export const UNITS_OF_MEASURE = [
  { value: 'unidade', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'g', label: 'Grama' },
  { value: 'm', label: 'Metro' },
  { value: 'cm', label: 'Centímetro' },
  { value: 'l', label: 'Litro' },
  { value: 'ml', label: 'Mililitro' }
]
```

## Regras de Harmonização

### ✅ OBRIGATÓRIO: Sempre que alterar qualquer um dos três componentes:

1. **Atualizar `src/lib/material-config.ts`** - Fonte única da verdade
2. **Verificar se os três componentes estão usando a configuração centralizada**
3. **Testar todos os três fluxos** (individual, massa, template)

### Campos que DEVEM ser harmonizados:

- `mm_mat_type` - Tipo de material (dropdown)
- `mm_mat_class` - Classificação (dropdown)
- `unit_of_measure` - Unidade de medida (dropdown)
- `lead_time_days` - Lead time (obrigatório)
- `purchase_price_cents` - Preço de compra
- `sale_price_cents` - Preço de venda
- `mm_vendor_id` - Fornecedor
- `weight_grams` - Peso
- `barcode` - Código de barras

### Validações que DEVEM ser consistentes:

- Campos obrigatórios
- Formatos de dados
- Valores permitidos nos dropdowns
- Mensagens de erro

## Como Adicionar Novos Valores

### 1. Adicionar novo tipo de material:
```typescript
// Em src/lib/material-config.ts
export const MATERIAL_TYPES = [
  // ... tipos existentes
  { type: 'novo_tipo', name: 'Novo Tipo' }
]
```

### 2. Adicionar nova classificação:
```typescript
// Em src/lib/material-config.ts
export const MATERIAL_CLASSIFICATIONS = [
  // ... classificações existentes
  { classification: 'nova_classificacao', name: 'Nova Classificação' }
]
```

### 3. Adicionar nova unidade:
```typescript
// Em src/lib/material-config.ts
export const UNITS_OF_MEASURE = [
  // ... unidades existentes
  { value: 'nova_unidade', label: 'Nova Unidade' }
]
```

## Verificação de Harmonização

### Checklist antes de fazer commit:

- [ ] `src/lib/material-config.ts` atualizado
- [ ] Cadastro individual usando configuração centralizada
- [ ] Edição em massa usando dropdowns e configuração centralizada
- [ ] Template de importação atualizado com novos valores
- [ ] APIs de validação e importação atualizadas
- [ ] Build funcionando (`npm run build`)
- [ ] Testes manuais nos três fluxos

### Testes obrigatórios:

1. **Cadastro Individual**: Criar material com novos valores
2. **Edição em Massa**: Editar material com dropdowns
3. **Importação**: Baixar template e importar com novos valores

## Arquivos que DEVEM ser atualizados juntos:

- `src/lib/material-config.ts` (fonte única)
- `app/mm/materials/new/page.tsx` (cadastro individual)
- `app/mm/materials/bulk-edit/page.tsx` (edição em massa)
- `app/mm/materials/bulk-import/page.tsx` (template)
- `app/api/mm/materials/bulk-validate/route.ts` (validação)
- `app/api/mm/materials/bulk-import/route.ts` (importação)

## ⚠️ IMPORTANTE

**NUNCA** altere valores diretamente nos componentes individuais. 
**SEMPRE** use a configuração centralizada em `src/lib/material-config.ts`.

Isso garante que os três componentes permaneçam sempre harmonizados e evita inconsistências no sistema.
