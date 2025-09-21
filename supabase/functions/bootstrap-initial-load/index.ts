import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createSupabaseServerClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImportJob {
  job_id: string
  tenant_id: string
  file_name: string
  total_records: number
  processed_records: number
  status: 'running' | 'completed' | 'failed'
  started_at: string
  completed_at?: string
  error_message?: string
}

interface ImportLog {
  job_id: string
  record_number: number
  error_message: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createSupabaseServerClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { tenant_id = 'LaplataLunaria' } = await req.json()

    // Create import job
    const jobId = crypto.randomUUID()
    const importJob: ImportJob = {
      job_id: jobId,
      tenant_id,
      file_name: 'bootstrap_initial_load',
      total_records: 0,
      processed_records: 0,
      status: 'running',
      started_at: new Date().toISOString()
    }

    // Insert job
    const { error: jobError } = await supabaseClient
      .from('import_job')
      .insert(importJob)

    if (jobError) throw jobError

    const files = [
      'mm_vendor.txt',
      'mm_material.txt', 
      'wh_warehouse.txt',
      'wh_inventory_balance.txt',
      'mm_purchase_order.txt',
      'mm_purchase_order_item.txt',
      'mm_receiving.txt'
    ]

    let totalProcessed = 0
    const errors: ImportLog[] = []

    for (const fileName of files) {
      try {
        console.log(`Processing ${fileName}...`)
        
        // Read file from GitHub
        const fileUrl = `https://raw.githubusercontent.com/grupogalpaohub/erp-laplata/erp-git/${fileName}`
        const response = await fetch(fileUrl)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName}: ${response.statusText}`)
        }
        
        const csvText = await response.text()
        const lines = csvText.split('\n').filter(line => line.trim())
        const headers = lines[0].split(',')
        const dataLines = lines.slice(1)
        
        console.log(`Found ${dataLines.length} records in ${fileName}`)
        
        // Process in batches of 1000 (Free Tier friendly)
        const batchSize = 1000
        for (let i = 0; i < dataLines.length; i += batchSize) {
          const batch = dataLines.slice(i, i + batchSize)
          const batchErrors = await processBatch(
            supabaseClient, 
            fileName, 
            headers, 
            batch, 
            tenant_id, 
            jobId, 
            i + 1
          )
          errors.push(...batchErrors)
          totalProcessed += batch.length
        }
        
        console.log(`Completed ${fileName}: ${dataLines.length} records processed`)
        
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
        errors.push({
          job_id: jobId,
          record_number: 0,
          error_message: `File processing error: ${error.message}`,
          created_at: new Date().toISOString()
        })
      }
    }

    // Update job status
    const { error: updateError } = await supabaseClient
      .from('import_job')
      .update({
        total_records: totalProcessed,
        processed_records: totalProcessed - errors.length,
        status: errors.length > 0 ? 'failed' : 'completed',
        completed_at: new Date().toISOString(),
        error_message: errors.length > 0 ? `${errors.length} errors occurred` : null
      })
      .eq('job_id', jobId)

    if (updateError) throw updateError

    // Insert error logs
    if (errors.length > 0) {
      await supabaseClient
        .from('import_log')
        .insert(errors)
    }

    return new Response(
      JSON.stringify({
        success: true,
        job_id: jobId,
        total_processed: totalProcessed,
        errors: errors.length,
        message: `Bootstrap completed. Processed ${totalProcessed} records with ${errors.length} errors.`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Bootstrap error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function processBatch(
  supabaseClient: any,
  fileName: string,
  headers: string[],
  batch: string[],
  tenantId: string,
  jobId: string,
  startRecordNumber: number
): Promise<ImportLog[]> {
  const errors: ImportLog[] = []
  
  try {
    switch (fileName) {
      case 'mm_vendor.txt':
        await processVendors(supabaseClient, headers, batch, tenantId)
        break
      case 'mm_material.txt':
        await processMaterials(supabaseClient, headers, batch, tenantId)
        break
      case 'wh_warehouse.txt':
        await processWarehouses(supabaseClient, headers, batch, tenantId)
        break
      case 'wh_inventory_balance.txt':
        await processInventoryBalances(supabaseClient, headers, batch, tenantId)
        break
      case 'mm_purchase_order.txt':
        await processPurchaseOrders(supabaseClient, headers, batch, tenantId)
        break
      case 'mm_purchase_order_item.txt':
        await processPurchaseOrderItems(supabaseClient, headers, batch, tenantId)
        break
      case 'mm_receiving.txt':
        await processReceivings(supabaseClient, headers, batch, tenantId)
        break
      default:
        throw new Error(`Unknown file type: ${fileName}`)
    }
  } catch (error) {
    console.error(`Batch processing error for ${fileName}:`, error)
    errors.push({
      job_id: jobId,
      record_number: startRecordNumber,
      error_message: `Batch error: ${error.message}`,
      created_at: new Date().toISOString()
    })
  }
  
  return errors
}

async function processVendors(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const vendors = batch.map(line => {
    const values = line.split(',')
    const record: any = { tenant_id: tenantId }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'vendor_id':
          record.vendor_id = value
          break
        case 'vendor_name':
          record.name = value
          break
        case 'email':
          record.email = value
          break
        case 'telefone':
          record.phone = value
          break
        case 'cidade':
          record.city = value
          break
        case 'estado':
          record.state = value
          break
        case 'vendor_rating':
          record.rating = value
          break
      }
    })
    
    record.status = 'active'
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('mm_vendor')
    .upsert(vendors, { onConflict: 'vendor_id,tenant_id' })

  if (error) throw error
}

async function processMaterials(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const materials = batch.map(line => {
    const values = line.split(',')
    const record: any = { tenant_id: tenantId }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'sku':
          record.sku = value
          break
        case 'mm_comercial':
          record.commercial_name = value
          break
        case 'mm_desc':
          record.description = value
          break
        case 'mm_mat_type':
          record.material_type = value
          break
        case 'mm_mat_class':
          record.classification = value
          break
        case 'mm_price_cents':
          record.price_per_unit = parseInt(value) || 0
          break
        case 'status':
          record.status = value
          break
      }
    })
    
    record.material_type = 'finished_good'
    record.category = 'brincos'
    record.unit_of_measure = 'unidade'
    record.currency = 'BRL'
    record.min_stock = 10
    record.max_stock = 100
    record.lead_time_days = 7
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('mm_material')
    .upsert(materials, { onConflict: 'sku,tenant_id' })

  if (error) throw error
}

async function processWarehouses(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const warehouses = batch.map(line => {
    const values = line.split(',')
    const record: any = { tenant_id: tenantId }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'plant_id':
          record.warehouse_id = value
          break
        case 'name':
          record.name = value
          break
        case 'is_default':
          record.is_default = value === 'TRUE'
          break
      }
    })
    
    record.status = 'active'
    record.country = 'Brasil'
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('wh_warehouse')
    .upsert(warehouses, { onConflict: 'warehouse_id,tenant_id' })

  if (error) throw error
}

async function processInventoryBalances(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const balances = batch.map((line, index) => {
    const values = line.split(',')
    const record: any = { 
      tenant_id: tenantId,
      balance_id: `BAL${String(index + 1).padStart(3, '0')}`
    }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'plant_id':
          record.plant_id = value
          break
        case 'mm_material':
          record.sku = value
          break
        case 'on_hand_qty':
          record.quantity_on_hand = parseInt(value) || 0
          break
        case 'reserved_qty':
          record.quantity_reserved = parseInt(value) || 0
          break
      }
    })
    
    record.status = 'active'
    record.last_count_date = new Date().toISOString().split('T')[0]
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('wh_inventory_balance')
    .upsert(balances, { onConflict: 'balance_id,tenant_id' })

  if (error) throw error
}

async function processPurchaseOrders(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const orders = batch.map(line => {
    const values = line.split(',')
    const record: any = { tenant_id: tenantId }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'mm_order':
          record.po_id = value
          break
        case 'vendor_id':
          record.vendor_id = value
          break
        case 'status':
          record.status = value
          break
        case 'po_date':
          record.order_date = value
          break
        case 'expected_delivery':
          record.expected_delivery = value
          break
      }
    })
    
    record.currency = 'BRL'
    record.total_amount = 0
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('mm_purchase_order')
    .upsert(orders, { onConflict: 'po_id,tenant_id' })

  if (error) throw error
}

async function processPurchaseOrderItems(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const items = batch.map((line, index) => {
    const values = line.split(',')
    const record: any = { 
      tenant_id: tenantId,
      item_id: `POI${String(index + 1).padStart(3, '0')}`
    }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'mm_order':
          record.po_id = value
          break
        case 'plant_id':
          record.plant_id = value
          break
        case 'mm_material':
          record.sku = value
          break
        case 'mm_qtt':
          record.quantity = parseInt(value) || 0
          break
        case 'unit_price_cents':
          record.unit_price = parseInt(value) || 0
          break
        case 'line_total_cents':
          record.total_price = parseInt(value) || 0
          break
      }
    })
    
    record.currency = 'BRL'
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('mm_purchase_order_item')
    .upsert(items, { onConflict: 'item_id,tenant_id' })

  if (error) throw error
}

async function processReceivings(supabaseClient: any, headers: string[], batch: string[], tenantId: string) {
  const receivings = batch.map((line, index) => {
    const values = line.split(',')
    const record: any = { 
      tenant_id: tenantId,
      receiving_id: `RC-2024-${String(index + 1).padStart(3, '0')}`
    }
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim()
      switch (header) {
        case 'mm_order':
          record.po_id = value
          break
        case 'plant_id':
          record.plant_id = value
          break
        case 'mm_material':
          record.sku = value
          break
        case 'qty_received':
          record.qty_received = parseInt(value) || 0
          break
        case 'received_at':
          record.received_at = value
          break
        case 'received_by':
          record.received_by = value
          break
      }
    })
    
    record.status = 'received'
    record.created_at = new Date().toISOString()
    record.updated_at = new Date().toISOString()
    
    return record
  })

  const { error } = await supabaseClient
    .from('mm_receiving')
    .upsert(receivings, { onConflict: 'receiving_id,tenant_id' })

  if (error) throw error
}
