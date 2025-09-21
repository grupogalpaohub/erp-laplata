import { headers } from 'next/headers';
import { ENV } from '@/lib/env';
export function getRequestOrigin() {
  try {
    const h = headers();
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
    if (host) return `${proto}://${host}`;
  } catch {}
  return ENV.SITE_URL || 'http://localhost:3000';
}
