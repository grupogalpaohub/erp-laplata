import { getSiteURL } from './site';

/** URL de callback padronizada (precisa estar cadastrada no Google & Supabase) */
export function getOAuthRedirectTo() {
  return `${getSiteURL()}/auth/callback`;
}
