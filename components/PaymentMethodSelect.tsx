'use client'

import React from 'react'

interface PaymentMethodSelectProps {
  name: string
  id?: string
  className?: string
  defaultValue?: string
  required?: boolean
}

export default function PaymentMethodSelect({ name, id, className, defaultValue, required }: PaymentMethodSelectProps) {
  const paymentMethods = [
    { value: '', label: 'Selecione a forma de pagamento...' },
    { value: 'PIX', label: 'PIX' },
    { value: 'CARTAO', label: 'Cartão de Crédito/Débito' },
    { value: 'BOLETO', label: 'Boleto Bancário' },
    { value: 'TRANSFERENCIA', label: 'Transferência Bancária' },
    { value: 'DINHEIRO', label: 'Dinheiro' },
    { value: 'OUTROS', label: 'Outros' }
  ]

  return (
    <select 
      id={id} 
      name={name} 
      className={className} 
      defaultValue={defaultValue}
      required={required}
    >
      {paymentMethods.map((method) => (
        <option key={method.value} value={method.value}>
          {method.label}
        </option>
      ))}
    </select>
  )
}

