export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';
export const runtime = 'nodejs';

export default function Template({ children }: { children: React.ReactNode }) {
  return children;
}
