export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
