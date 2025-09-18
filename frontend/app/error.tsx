// app/error.tsx
"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border bg-white p-6 text-red-600">
      Erro: {error.message || "Falha ao renderizar"}
    </div>
  );
}
