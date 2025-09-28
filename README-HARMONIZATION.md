# ERP Laplata - Harmonização Total

## ✅ Status: HARMONIZADO COM INVENTÁRIO 360° REAL

Este projeto está **100% alinhado** com o schema real do Supabase/Postgres.

### 🎯 Fonte de Verdade
- **Schema**: `public` no Supabase/Postgres
- **Inventário 360°**: Dados reais extraídos do banco
- **Nomenclatura**: Campos reais do banco (não inventados)

### 📊 Estrutura Real das Tabelas

#### SD Sales Order Item
- **PK**: `(tenant_id, so_id, material_id, row_no)` - conforme banco real
- **Campos ativos**: `mm_material` (FK para mm_material)
- **Campos legados**: `material_id`, `sku` (mantidos para compatibilidade)
- **FK ativa**: `fk_sosi_mm_material` → `(tenant_id, mm_material)`

#### MM Purchase Order
- **PK**: `mm_order` (não po_id)
- **Campos**: `tenant_id`, `vendor_id`, `order_date`, `po_date`, `expected_delivery`, `currency`, `total_cents`, `total_amount`, `notes`, `status`

#### WH Inventory Balance
- **PK**: `(tenant_id, plant_id, mm_material)`
- **Campos**: `on_hand_qty`, `reserved_qty`, `status`, `last_count_date`
- **READ-ONLY**: `quantity_available` (coluna gerada)

### 🔧 APIs Atualizadas
- ✅ `/api/sd/sales-orders` - Status enum real
- ✅ `/api/sd/sales-order-items` - mm_material + material_id
- ✅ `/api/mm/purchase-orders` - mm_order (não po_id)
- ✅ `/api/mm/purchase-order-items` - Campos reais
- ✅ `/api/wh/balance` - Sem quantity_available no payload
- ✅ `/api/fi/transactions` - Enum type real

### 🚫 Rotas Removidas
- ❌ `/api/mm/purchases/[po_id]` - Legado removido
- ❌ `/api/mm/purchases/[po_id]/items` - Legado removido

### 📝 Document Numbering
- ✅ Função real: `public.next_doc_number(tenant, type)`
- ✅ Tipos: "PO", "SO", "FI", "WH"
- ✅ Sem geração de doc_no no app

### 🔒 Guardrails Aplicados
- ✅ Supabase SSR + cookies() em todas as APIs
- ✅ tenant_id derivado da sessão (nunca do payload)
- ✅ Envelope de resposta padronizado
- ✅ Validação com enums reais do banco
- ✅ FKs validadas antes da inserção
- ✅ RLS aplicado em todas as queries

### 🧪 Testes
- ✅ Estrutura de dados alinhada com banco real
- ✅ Campos obrigatórios validados
- ✅ Enums corretos
- ✅ FKs funcionando
- ✅ Triggers respeitados (não reimplementados)

## 🎉 RESULTADO
**Sistema 100% harmonizado com o Inventário 360° real do Supabase!**
