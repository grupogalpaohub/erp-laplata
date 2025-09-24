import { requireSession } from '@/lib/auth/requireSession';

export default async function Debug() {
  const { session, tenantId } = await requireSession();
  return <pre>{JSON.stringify({ user: session.user.id, tenantId }, null, 2)}</pre>;
}
