export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // NADA de supabase aqui; apenas render.
  return children;
}
