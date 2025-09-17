'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Catálogo de Materiais</h1>
      <div className="text-center py-8">
        <h2 className="text-lg font-medium text-red-600 mb-2">
          Erro ao carregar catálogo
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  )
}