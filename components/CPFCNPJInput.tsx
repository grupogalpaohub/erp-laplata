'use client'

import { useState, useEffect } from 'react'

interface CPFCNPJInputProps {
  name: string
  id: string
  required?: boolean
  defaultValue?: string
  className?: string
  placeholder?: string
}

export default function CPFCNPJInput({ 
  name, 
  id, 
  required = false, 
  defaultValue = '', 
  className = '', 
  placeholder = '000.000.000-00 ou 00.000.000/0000-00' 
}: CPFCNPJInputProps) {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const formatCPFCNPJ = (input: string) => {
    // Remove tudo que não é dígito
    const numbers = input.replace(/\D/g, '')
    
    // Se tem 11 dígitos ou menos, formata como CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    
    // Se tem mais de 11 dígitos, formata como CNPJ
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatCPFCNPJ(input)
    setValue(formatted)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas números, backspace, delete, tab, escape, enter
    if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <input
      type="text"
      name={name}
      id={id}
      required={required}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className={className}
      placeholder={placeholder}
      maxLength={18}
    />
  )
}
