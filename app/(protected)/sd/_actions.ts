"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { requireSession } from "@/lib/auth/requireSession"
import { toCents } from "@/lib/money"
import { revalidatePath } from "next/cache"

export async function createSalesOrder(formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  // Criar cabeçalho do pedido
  const header = {
    customer_id: String(formData.get("customer_id") ?? "").trim(),
    status: String(formData.get("status") ?? "draft").trim(),
    order_date: String(formData.get("order_date") ?? new Date().toISOString().split('T')[0]),
    expected_ship: String(formData.get("expected_ship") ?? "").trim() || null,
    total_cents: toCents(Number(formData.get("total") || 0)),
    total_negotiated_cents: toCents(Number(formData.get("total_negotiated") || 0)),
    payment_method: String(formData.get("payment_method") ?? "").trim() || null,
    payment_term: String(formData.get("payment_term") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  }

  const { data: order, error: orderError } = await supabase
    .from("sd_sales_order")
    .insert(header)
    .select("so_id")
    .single()

  if (orderError) {
    console.error("Erro ao criar pedido:", orderError)
    throw new Error(`Erro ao criar pedido: ${orderError.message}`)
  }

  // Criar itens do pedido
  const itemsData = formData.getAll("items[]") as string[]
  if (itemsData.length > 0) {
    const items = itemsData.map(item => {
      const parsed = JSON.parse(item)
      return {
        so_id: order.so_id,
        mm_material: parsed.mm_material,
        mm_qtt: Number(parsed.mm_qtt || 0),
        unit_price_cents_at_order: toCents(parsed.unit_price),
        total_cents: toCents(parsed.unit_price) * Number(parsed.mm_qtt || 0),
      }
    })

    const { error: itemsError } = await supabase
      .from("sd_sales_order_item")
      .insert(items)

    if (itemsError) {
      console.error("Erro ao criar itens do pedido:", itemsError)
      throw new Error(`Erro ao criar itens: ${itemsError.message}`)
    }
  }

  revalidatePath("/sd/orders")
  revalidatePath("/sd")
  
  return { success: true, so_id: order.so_id }
}

export async function updateSalesOrderStatus(so_id: string, newStatus: string) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  const { error } = await supabase
    .from("sd_sales_order")
    .update({ status: newStatus })
    .eq("so_id", so_id)

  if (error) {
    console.error("Erro ao atualizar status do pedido:", error)
    throw new Error(`Erro ao atualizar status: ${error.message}`)
  }

  revalidatePath("/sd/orders")
  revalidatePath(`/sd/orders/${so_id}`)
  
  return { success: true }
}

export async function updateSalesOrder(so_id: string, formData: FormData) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  const payload = {
    customer_id: String(formData.get("customer_id") ?? "").trim(),
    status: String(formData.get("status") ?? "draft").trim(),
    order_date: String(formData.get("order_date") ?? "").trim(),
    expected_ship: String(formData.get("expected_ship") ?? "").trim() || null,
    total_cents: toCents(Number(formData.get("total") || 0)),
    total_negotiated_cents: toCents(Number(formData.get("total_negotiated") || 0)),
    payment_method: String(formData.get("payment_method") ?? "").trim() || null,
    payment_term: String(formData.get("payment_term") ?? "").trim() || null,
    notes: String(formData.get("notes") ?? "").trim() || null,
  }

  const { error } = await supabase
    .from("sd_sales_order")
    .update(payload)
    .eq("so_id", so_id)

  if (error) {
    console.error("Erro ao atualizar pedido:", error)
    throw new Error(`Erro ao atualizar pedido: ${error.message}`)
  }

  revalidatePath("/sd/orders")
  revalidatePath(`/sd/orders/${so_id}`)
  
  return { success: true }
}

export async function deleteSalesOrder(so_id: string) {
  await requireSession()
  
  const supabase = getSupabaseServerClient()
  
  // Deletar itens primeiro
  const { error: itemsError } = await supabase
    .from("sd_sales_order_item")
    .delete()
    .eq("so_id", so_id)

  if (itemsError) {
    console.error("Erro ao deletar itens do pedido:", itemsError)
    throw new Error(`Erro ao deletar itens: ${itemsError.message}`)
  }

  // Deletar pedido
  const { error: orderError } = await supabase
    .from("sd_sales_order")
    .delete()
    .eq("so_id", so_id)

  if (orderError) {
    console.error("Erro ao deletar pedido:", orderError)
    throw new Error(`Erro ao deletar pedido: ${orderError.message}`)
  }

  revalidatePath("/sd/orders")
  revalidatePath("/sd")
  
  return { success: true }
}
