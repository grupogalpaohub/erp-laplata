'use client'

import { useState, useEffect } from 'react'

interface PriceDisplayProps {
  materials: any[]
  materialIndex: number
}

export default function PriceDisplay({ materials, materialIndex }: PriceDisplayProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string>('')
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    const selectElement = document.querySelector(`select[name="item_${materialIndex}_mm_material"]`) as HTMLSelectElement
    if (selectElement) {
      const handleChange = () => {
        const materialId = selectElement.value
        setSelectedMaterial(materialId)
        
        if (materialId) {
          const material = materials.find(m => m.mm_material === materialId)
          if (material) {
            setPrice(material.purchase_price_cents)
          } else {
            setPrice(null)
          }
        } else {
          setPrice(null)
        }
      }

      selectElement.addEventListener('change', handleChange)
      return () => selectElement.removeEventListener('change', handleChange)
    }
  }, [materials, materialIndex])

  return (
    <div className="text-right text-sm text-gray-600">
      {price !== null ? `R$ ${(price / 100).toFixed(2)}` : '—'}
    </div>
  )
}
