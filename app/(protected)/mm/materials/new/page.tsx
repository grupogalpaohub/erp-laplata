'use client'

import { useState, FormEvent, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMaterialPage() {
  const router = useRouter()
  const [mmDesc, setDesc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    start(async () => {
      const res = await fetch('/api/mm/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mm_desc: mmDesc }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.ok) {
        setError(json?.error ?? 'Erro ao criar material.')
        return
      }
      router.push(`/mm/materials/${encodeURIComponent(json.mm_material)}`)
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl mb-4">Novo Material</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block">
          <span className="text-sm">Descrição *</span>
          <input
            className="w-full border rounded p-2"
            value={mmDesc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {pending ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  )
}