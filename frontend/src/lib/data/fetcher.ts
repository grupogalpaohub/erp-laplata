// lib/data/fetcher.ts
export const noStore = () => import('next/cache').then(m => m.revalidatePath);
export const mustNoStore = () => import('next/cache').then(m => m.unstable_noStore);