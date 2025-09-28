#!/usr/bin/env tsx

// Script para debug da criação de material
import { createServerClient } from '@supabase/ssr'

async function testMaterialCreation() {
  console.log('🔍 Testando criação de material...')
  
  try {
    // 1. Testar API de materiais
    console.log('\n1. Testando GET /api/mm/materials...')
    const materialsResponse = await fetch('http://localhost:3000/api/mm/materials')
    console.log('Status:', materialsResponse.status)
    console.log('Headers:', Object.fromEntries(materialsResponse.headers.entries()))
    
    if (materialsResponse.ok) {
      const materialsData = await materialsResponse.json()
      console.log('Dados:', JSON.stringify(materialsData, null, 2))
    } else {
      const errorText = await materialsResponse.text()
      console.log('Erro:', errorText)
    }
    
    // 2. Testar API de vendors
    console.log('\n2. Testando GET /api/mm/vendors...')
    const vendorsResponse = await fetch('http://localhost:3000/api/mm/vendors')
    console.log('Status:', vendorsResponse.status)
    
    if (vendorsResponse.ok) {
      const vendorsData = await vendorsResponse.json()
      console.log('Vendors:', JSON.stringify(vendorsData, null, 2))
    } else {
      const errorText = await vendorsResponse.text()
      console.log('Erro:', errorText)
    }
    
    // 3. Testar criação de material (sem autenticação)
    console.log('\n3. Testando POST /api/mm/materials (sem auth)...')
    const createResponse = await fetch('http://localhost:3000/api/mm/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mm_desc: 'Teste Material Debug',
        mm_vendor_id: 'SUP_00001',
        mm_price_cents: 1000,
        mm_purchase_price_cents: 800
      })
    })
    
    console.log('Status:', createResponse.status)
    if (createResponse.ok) {
      const createData = await createResponse.json()
      console.log('Material criado:', JSON.stringify(createData, null, 2))
    } else {
      const errorText = await createResponse.text()
      console.log('Erro:', errorText)
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

testMaterialCreation()
