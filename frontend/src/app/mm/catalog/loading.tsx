export default function Loading() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Catálogo de Materiais</h1>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </main>
  );
}