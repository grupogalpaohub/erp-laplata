'use client'

import { useState, FormEvent, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMaterialPage() {
  const router = useRouter()
  const [mmDesc, setDesc] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [pending, start] = useTransition()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    
    if (!mmDesc.trim()) {
      setError('Descrição é obrigatória')
      return
    }

    start(async () => {
      try {
        console.log('Enviando material:', { mm_desc: mmDesc })
        
        const res = await fetch('/api/mm/materials-debug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mm_desc: mmDesc }),
        })
        
        console.log('Resposta da API:', res.status, res.statusText)
        
        const json = await res.json().catch(() => ({}))
        console.log('JSON da resposta:', json)
        
        if (!res.ok || !json.ok) {
          setError(json?.error ?? `Erro ${res.status}: ${res.statusText}`)
          return
        }
        
        setSuccess(`Material criado com sucesso! ID: ${json.mm_material}`)
        setDesc('') // Limpar o campo
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push(`/mm/materials/${encodeURIComponent(json.mm_material)}`)
        }, 2000)
        
      } catch (err) {
        console.error('Erro na requisição:', err)
        setError('Erro de conexão. Tente novamente.')
      }
    })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-white">Novo Material</h1>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Descrição *
          </label>
          <input
            className="w-full border border-gray-600 rounded-lg p-3 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={mmDesc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Digite a descrição do material"
            required
            disabled={pending}
          />
        </div>
        
        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-3">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}
        
        <button
          type="submit"
          disabled={pending || !mmDesc.trim()}
          className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? 'Salvando...' : 'Salvar Material'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Debug Info:</h3>
        <p className="text-xs text-gray-400">
          Status: {pending ? 'Enviando...' : 'Pronto'}<br/>
          Descrição: "{mmDesc}"<br/>
          Tamanho: {mmDesc.length} caracteres
        </p>
      </div>
    </div>
  )
}