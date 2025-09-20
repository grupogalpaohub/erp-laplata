import Link from "next/link";

export default function MMPage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Materiais (MM)</h1>
      <div className="grid grid-cols-2 gap-4">
        <Link href="/mm/create" className="rounded-xl border p-6 shadow hover:bg-fiori-surface">
          Cadastro de Materiais
        </Link>
        <Link href="/mm/catalog" className="rounded-xl border p-6 shadow hover:bg-fiori-surface">
          Catálogo de Materiais
        </Link>
      </div>
    </main>
  );
}
