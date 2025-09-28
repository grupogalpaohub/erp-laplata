// utils/http.ts
// Utilitários para envelope de resposta padronizado

export interface ApiResponse<T = any> {
  ok: true;
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResult<T = any> = ApiResponse<T> | ApiError;

export const ok = <T>(data: T, extra: Record<string, any> = {}): ApiResponse<T> => ({
  ok: true,
  data,
  ...extra
});

export const fail = (code: string, message: string, status = 400): Response => {
  return new Response(
    JSON.stringify({ 
      ok: false, 
      error: { code, message } 
    }), 
    { 
      status, 
      headers: { 'content-type': 'application/json' } 
    }
  );
};

export const success = <T>(data: T, total?: number, page?: number, pageSize?: number): Response => {
  return Response.json(ok(data, { total, page, pageSize }));
};
