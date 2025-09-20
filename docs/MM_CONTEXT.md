# ERP LaPlata — Módulo MM & Pedidos de Compras (Contexto Oficial)

## 🔐 Regras inegociáveis (não violar)
- **Sem dados falsos/mock**. Sempre consumir dados reais do Supabase.
- **Sem alterações de schema fora dos patches SQL abaixo**.
- **RLS ativo**; todas as consultas com usuário autenticado.
- **Nada de Supabase no middleware** (edge). Consultas só em Server Components / Route Handlers (`runtime = 'nodejs'`).
- **Sem uso de `service_role` no cliente**.

## 🗂️ Novas estruturas de banco (via SQL patch)
**Materiais**
- Coluna nova: `mm_material.price_last_updated_at timestamptz`
- Tabelas de log:
  - `mm_price_log (id, mm_material, old_price, new_price, changed_at, changed_by)`
  - `mm_change_log (id, table_name, record_id, field_name, old_value, new_value, changed_at, changed_by)`
- Triggers:
  - `trg_log_material_price_change` → loga mudanças de preço + atualiza `price_last_updated_at`
  - `trg_log_material_nonprice_changes` → loga mudanças de campos não-preço

**Pedidos de Compras**
- `mm_purchase_order` (header): colunas novas
  - `status text` (valores: `'rascunho','aprovado','em_andamento','recebido','cancelado'`)
  - `order_date date`
  - `total_cents bigint`
- `mm_purchase_order_item` (itens): colunas novas
  - `unit_cost_cents bigint` (preço congelado no momento do insert)
  - `line_total_cents bigint` (mm_qtt × unit_cost_cents)
- Triggers:
  - `trg_freeze_item_price` (before insert): congela preço no item (snapshot do `mm_material.mm_price_cents`)
  - `trg_update_po_total_*` (after ins/upd/del): recalcula `total_cents` no header
  - `trg_prevent_item_price_update` (before update): bloqueia mudar `unit_cost_cents` e `mm_material`; permite mudar **quantidade** apenas com header em `rascunho` e recalcula `line_total_cents`.

## 🧭 Telas/Tiles criadas
- **MM → Pedidos de Compras**
  - `/mm/purchases` (lista Fiori com filtros por coluna)
  - `/mm/purchases/new` (criação de pedido + itens; preço congelado pelo trigger)
- **MM → Materiais**
  - `/mm/materials/edit` (edição individual; modal de "Alterar Preço" com de/para)
- **ADMIN → Log de Mudanças**
  - `/admin/logs/material` (consolida logs de preço e campos; export CSV)

## ⚙️ Observações
- Campo de **quantidade** no item: o schema costuma usar `mm_qtt`. Caso sua tabela use `quantity`, o trigger usa `coalesce(new.mm_qtt, new.quantity)`.
- Status do PO: português, conforme definição do negócio.
- UI: estilo Fiori, sem mocks. Filtrar via `searchParams`/SSR.
