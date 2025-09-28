// Helper para document numbering baseado no banco real
export async function getNextDocNumber(tenant_id: string, doc_type: string): Promise<string> {
  // Usar função do banco: public.next_doc_number(tenant, type)
  // Tipos suportados: "PO", "SO", "FI", "WH"
  const response = await fetch(`/api/doc-numbering?tenant_id=${tenant_id}&doc_type=${doc_type}`);
  const result = await response.json();
  
  if (!result.ok) {
    throw new Error(`Erro ao gerar número do documento: ${result.error.message}`);
  }
  
  return result.data.next_number;
}

export const DOC_TYPES = {
  PURCHASE_ORDER: 'PO',
  SALES_ORDER: 'SO', 
  FINANCIAL: 'FI',
  WAREHOUSE: 'WH'
} as const;
