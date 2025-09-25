'use client'

import React from 'react'

interface MaterialTypeSelectProps {
  name: string
  id?: string
  className?: string
  defaultValue?: string
}

export default function MaterialTypeSelect({ name, id, className, defaultValue }: MaterialTypeSelectProps) {
  const materialTypes = [
    { value: '', label: 'Selecione o tipo...' },
    { value: 'Gargantilha', label: 'Gargantilha' },
    { value: 'Pulseira', label: 'Pulseira' },
    { value: 'Anel', label: 'Anel' },
    { value: 'Brinco', label: 'Brinco' },
    { value: 'Colar', label: 'Colar' },
    { value: 'Kit', label: 'Kit' },
    { value: 'Acessório', label: 'Acessório' },
    { value: 'Outros', label: 'Outros' }
  ]

  return (
    <select id={id} name={name} className={className} defaultValue={defaultValue}>
      {materialTypes.map((type) => (
        <option key={type.value} value={type.value}>
          {type.label}
        </option>
      ))}
    </select>
  )
}

