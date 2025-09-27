'use client'

import React from 'react'

interface MaterialTypeSelectProps {
  name: string
  id?: string
  className?: string
  defaultValue?: string
  options?: string[]
}

export default function MaterialTypeSelect({ name, id, className, defaultValue, options = [] }: MaterialTypeSelectProps) {
  const materialTypes = [
    { value: '', label: 'Selecione o tipo...' },
    ...options.map(option => ({ value: option, label: option }))
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
