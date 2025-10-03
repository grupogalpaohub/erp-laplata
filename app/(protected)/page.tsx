export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

export default function ProtectedIndex() {
  // mande para sua landing logada
  redirect('/dashboard'); // ajuste se quiser outra default
}