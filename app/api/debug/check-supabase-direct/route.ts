import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    console.log('🔍 VERIFICAÇÃO DIRETA DO SUPABASE...')
    
    // 1. Verificar tabelas principais através de consultas diretas
    const results = {
      mm_vendor: null,
      mm_material: null,
      crm_customer: null,
      sd_sales_order: null,
      sd_sales_order_item: null,
      mm_purchase_order: null,
      mm_purchase_order_item: null,
      doc_numbering: null,
      tenant: null
    }
    
    const errors = {}
    
    // Testar cada tabela principal
    for (const tableName of Object.keys(results)) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
        
        if (error) {
          errors[tableName] = error.message
          results[tableName] = null
        } else {
          results[tableName] = data || []
        }
      } catch (err) {
        errors[tableName] = err instanceof Error ? err.message : 'Erro desconhecido'
        results[tableName] = null
      }
    }
    
    // 2. Verificar dados específicos de algumas tabelas
    const sampleData = {}
    
    try {
      // Verificar fornecedores
      const { data: vendors, error: vendorError } = await supabase
        .from('mm_vendor')
        .select('vendor_id, vendor_name, email, telefone, cidade, estado, vendor_rating, created_at')
        .limit(3)
      
      if (!vendorError) {
        sampleData.vendors = vendors || []
      }
    } catch (err) {
      console.log('Erro ao buscar fornecedores:', err)
    }
    
    try {
      // Verificar materiais
      const { data: materials, error: materialError } = await supabase
        .from('mm_material')
        .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_price_cents, status, mm_vendor_id, created_at')
        .limit(3)
      
      if (!materialError) {
        sampleData.materials = materials || []
      }
    } catch (err) {
      console.log('Erro ao buscar materiais:', err)
    }
    
    try {
      // Verificar clientes
      const { data: customers, error: customerError } = await supabase
        .from('crm_customer')
        .select('customer_id, name, email, telefone, customer_type, status, created_date')
        .limit(3)
      
      if (!customerError) {
        sampleData.customers = customers || []
      }
    } catch (err) {
      console.log('Erro ao buscar clientes:', err)
    }
    
    try {
      // Verificar pedidos de venda
      const { data: orders, error: orderError } = await supabase
        .from('sd_sales_order')
        .select('so_id, doc_no, customer_id, status, order_date, total_cents, total_final_cents, total_negotiated_cents, payment_method, payment_term, notes, created_at')
        .limit(3)
      
      if (!orderError) {
        sampleData.orders = orders || []
      }
    } catch (err) {
      console.log('Erro ao buscar pedidos de venda:', err)
    }
    
    try {
      // Verificar itens de pedidos de venda
      const { data: orderItems, error: orderItemError } = await supabase
        .from('sd_sales_order_item')
        .select('so_id, sku, quantity, unit_price_cents, line_total_cents, material_id, row_no, created_at')
        .limit(3)
      
      if (!orderItemError) {
        sampleData.orderItems = orderItems || []
      }
    } catch (err) {
      console.log('Erro ao buscar itens de pedidos:', err)
    }
    
    try {
      // Verificar pedidos de compra
      const { data: purchaseOrders, error: poError } = await supabase
        .from('mm_purchase_order')
        .select('mm_order, vendor_id, status, po_date, expected_delivery, notes, total_cents, created_at')
        .limit(3)
      
      if (!poError) {
        sampleData.purchaseOrders = purchaseOrders || []
      }
    } catch (err) {
      console.log('Erro ao buscar pedidos de compra:', err)
    }
    
    try {
      // Verificar itens de pedidos de compra
      const { data: poItems, error: poItemError } = await supabase
        .from('mm_purchase_order_item')
        .select('po_item_id, mm_order, plant_id, mm_material, mm_qtt, quantity, unit_cost_cents, line_total_cents, currency, material_id, created_at')
        .limit(3)
      
      if (!poItemError) {
        sampleData.poItems = poItems || []
      }
    } catch (err) {
      console.log('Erro ao buscar itens de pedidos de compra:', err)
    }
    
    try {
      // Verificar numeração de documentos
      const { data: docNumbering, error: docError } = await supabase
        .from('doc_numbering')
        .select('*')
        .limit(5)
      
      if (!docError) {
        sampleData.docNumbering = docNumbering || []
      }
    } catch (err) {
      console.log('Erro ao buscar numeração de documentos:', err)
    }
    
    try {
      // Verificar tenants
      const { data: tenants, error: tenantError } = await supabase
        .from('tenant')
        .select('*')
        .limit(3)
      
      if (!tenantError) {
        sampleData.tenants = tenants || []
      }
    } catch (err) {
      console.log('Erro ao buscar tenants:', err)
    }
    
    console.log('✅ Verificação direta finalizada!')
    
    return NextResponse.json({
      success: true,
      investigation: {
        tableAccess: results,
        sampleData,
        errors
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Erro na verificação direta:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
