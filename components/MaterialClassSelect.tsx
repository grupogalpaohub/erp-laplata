'use client'

import React from 'react'

interface MaterialClassSelectProps {
  name: string
  id?: string
  className?: string
  defaultValue?: string
  options?: string[]
}

export default function MaterialClassSelect({ name, id, className, defaultValue, options = [] }: MaterialClassSelectProps) {
  const materialClasses = [
    { value: '', label: 'Selecione a classe...' },
    ...options.map(option => ({ value: option, label: option }))
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

