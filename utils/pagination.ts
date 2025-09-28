// utils/pagination.ts
// Utilitários para paginação consistente

export interface PaginationParams {
  page: number;
  pageSize: number;
  from: number;
  to: number;
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, Number(searchParams.get('page') || 1));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || 20)));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  return { page, pageSize, from, to };
}

export function validatePagination(page: number, pageSize: number): { valid: boolean; error?: string } {
  if (page < 1) {
    return { valid: false, error: 'page deve ser >= 1' };
  }
  if (pageSize < 1 || pageSize > 100) {
    return { valid: false, error: 'pageSize deve estar entre 1 e 100' };
  }
  return { valid: true };
}
