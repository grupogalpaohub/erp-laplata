import { NextResponse } from 'next/server';
import { getTenantId } from '@/lib/auth';
import { backfillAllCustomerPaymentPreferences } from '@/lib/crm-payment-preferences';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const tenantId = await getTenantId();
    
    console.log(`[API] Iniciando backfill de preferências de pagamento para tenant: ${tenantId}`);
    
    await backfillAllCustomerPaymentPreferences(tenantId);
    
    return NextResponse.json({
      success: true,
      message: 'Backfill de preferências de pagamento concluído com sucesso',
      tenantId
    });

  } catch (error) {
    console.error('[API] Erro no backfill de preferências:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
