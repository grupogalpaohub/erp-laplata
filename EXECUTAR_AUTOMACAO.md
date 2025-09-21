# 🚀 EXECUTAR AUTOMAÇÃO NO SUPABASE

## 📋 **PASSO A PASSO SIMPLIFICADO**

### **1. Acessar Supabase Dashboard**
- URL: https://supabase.com/dashboard
- Projeto: `erp-laplata`
- Vá para **SQL Editor**

### **2. Executar Scripts em Ordem**

#### **PASSO 1: Funções Básicas**
1. Copie todo o conteúdo de `parte1_funcoes_basicas.sql`
2. Cole no SQL Editor
3. Clique em **Run**
4. Aguarde a mensagem: "Parte 1 executada com sucesso!"

#### **PASSO 2: Funções Financeiras**
1. Copie todo o conteúdo de `parte2_financeiro.sql`
2. Cole no SQL Editor
3. Clique em **Run**
4. Aguarde a mensagem: "Parte 2 executada com sucesso!"

#### **PASSO 3: Triggers de Automação**
1. Copie todo o conteúdo de `parte3_triggers.sql`
2. Cole no SQL Editor
3. Clique em **Run**
4. Aguarde a mensagem: "Parte 3 executada com sucesso!"

#### **PASSO 4: Sistema MRP**
1. Copie todo o conteúdo de `parte4_mrp.sql`
2. Cole no SQL Editor
3. Clique em **Run**
4. Aguarde a mensagem: "Parte 4 executada com sucesso!"

#### **PASSO 5: Processar Dados Existentes**
1. Copie todo o conteúdo de `parte5_backfill.sql`
2. Cole no SQL Editor
3. Clique em **Run**
4. Aguarde a mensagem: "Sistema de automação implementado com sucesso!"

### **3. Verificar Implementação**

Execute este SQL para verificar se tudo funcionou:

```sql
-- Verificar funções criadas
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'post_inventory_movement',
  'fi_post_purchase_receipt',
  'fi_post_sales_shipment',
  'refresh_mrp',
  'next_doc_number'
);

-- Verificar triggers criados
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name IN (
  'trg_mm_receiving_after',
  'trg_sd_order_reserve',
  'trg_sd_shipment_issue'
);

-- Verificar movimentações criadas
SELECT COUNT(*) as total_movimentacoes 
FROM wh_inventory_ledger 
WHERE tenant_id = 'LaplataLunaria';

-- Verificar sugestões MRP
SELECT COUNT(*) as total_sugestoes 
FROM wh_mrp_suggestion 
WHERE tenant_id = 'LaplataLunaria';
```

### **4. Testar Funcionalidades**

#### **Testar Movimentação de Estoque:**
```sql
-- Criar uma movimentação de teste
SELECT post_inventory_movement(
  'LaplataLunaria',
  'WH-001',
  'B_175',
  5,
  'test_movement',
  'test_table',
  'test_id'
);

-- Verificar se foi criada
SELECT * FROM wh_inventory_ledger 
WHERE tenant_id = 'LaplataLunaria' 
AND sku = 'B_175'
ORDER BY moved_at DESC;
```

#### **Testar MRP:**
```sql
-- Executar MRP
SELECT refresh_mrp('LaplataLunaria', 30);

-- Ver sugestões
SELECT * FROM wh_mrp_suggestion 
WHERE tenant_id = 'LaplataLunaria'
ORDER BY snapshot_at DESC
LIMIT 5;
```

## ✅ **RESULTADO ESPERADO**

Após executar todos os scripts:
- ✅ Funções de estoque criadas
- ✅ Triggers de automação ativos
- ✅ Sistema MRP funcionando
- ✅ Dados existentes processados
- ✅ KPI valor total funcionando
- ✅ Central de estoque funcionando

## 🆘 **SE HOUVER PROBLEMAS**

1. **Erro de permissão**: Verifique se está logado no Supabase
2. **Erro de sintaxe**: Execute os scripts um por vez
3. **Erro de tabela**: Verifique se as tabelas existem
4. **Erro de função**: Execute as partes em ordem

**SISTEMA PRONTO PARA USO!** 🚀
