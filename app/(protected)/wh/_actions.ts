"use server"

import { supabaseServer } from '@/lib/supabase/server'
import { requireSession } from "@/lib/auth/requireSession"
import { revalidatePath } from "next/cache"

export async function createTransfer(formData: FormData) {
  await requireSession()
  
  const supabase = supabaseServer()
  
  const transferData = {
    mm_material: String(formData.get("mm_material") ?? ""),
    mm_qtt: Number(formData.get("mm_qtt")),
    from_plant: String(formData.get("from_plant") ?? ""),
    to_plant: String(formData.get("to_plant") ?? ""),
    reference_type: String(formData.get("reference_type") ?? "MANUAL"),
    reference_id: String(formData.get("reference_id") ?? ""),
    reason: String(formData.get("reason") ?? "TRANSFER")
  }

  // Validar dados
  if (!transferData.mm_material || !transferData.mm_qtt || transferData.mm_qtt <= 0) {
    return { success: false, error: "Dados inválidos" }
  }

  try {
    // Criar transferência
    const { data, error } = await supabase
      .from('wh_transfer')
      .insert({
        mm_material: transferData.mm_material,
        mm_qtt: transferData.mm_qtt,
        from_plant: transferData.from_plant,
        to_plant: transferData.to_plant,
        reference_type: transferData.reference_type,
        reference_id: transferData.reference_id,
        reason: transferData.reason,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating transfer:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/wh/transfers')
    return { success: true, message: 'Transferência criada com sucesso', data }
  } catch (error) {
    console.error('Error in createTransfer:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}
