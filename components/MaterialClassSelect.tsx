'use client'

import React from 'react'

interface MaterialClassSelectProps {
  name: string
  id?: string
  className?: string
  defaultValue?: string
}

export default function MaterialClassSelect({ name, id, className, defaultValue }: MaterialClassSelectProps) {
  const materialClasses = [
    { value: '', label: 'Selecione a classe...' },
    { value: 'Elementar', label: 'Elementar' },
    { value: 'Ciclos', label: 'Ciclos' },
    { value: 'Amuletos', label: 'Amuletos' },
    { value: 'Ancestral', label: 'Ancestral' },
    { value: 'Místico', label: 'Místico' },
    { value: 'Naturaleza', label: 'Naturaleza' },
    { value: 'Protetor', label: 'Protetor' },
    { value: 'Outros', label: 'Outros' }
  ]

  return (
    <select id={id} name={name} className={className} defaultValue={defaultValue}>
      {materialClasses.map((classe) => (
        <option key={classe.value} value={classe.value}>
          {classe.label}
        </option>
      ))}
    </select>
  )
}

