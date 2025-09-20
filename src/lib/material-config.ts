// Configuração centralizada para tipos e classificações de material
// Este arquivo deve ser atualizado sempre que houver mudanças no customizing

export const MATERIAL_TYPES = [
  { type: 'Brinco', name: 'Brinco' },
  { type: 'Gargantilha', name: 'Gargantilha' },
  { type: 'Choker', name: 'Choker' },
  { type: 'Pulseira', name: 'Pulseira' },
  { type: 'Kit', name: 'Kit' }
]

export const MATERIAL_CLASSIFICATIONS = [
  { classification: 'Amuletos', name: 'Amuletos' },
  { classification: 'Elementar', name: 'Elementar' },
  { classification: 'Ciclos', name: 'Ciclos' },
  { classification: 'Ancestral', name: 'Ancestral' }
]

export const UNITS_OF_MEASURE = [
  { value: 'unidade', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma' },
  { value: 'g', label: 'Grama' },
  { value: 'm', label: 'Metro' },
  { value: 'cm', label: 'Centímetro' },
  { value: 'l', label: 'Litro' },
  { value: 'ml', label: 'Mililitro' }
]

// Função para obter o nome do tipo pelo valor
export function getMaterialTypeName(type: string): string {
  const materialType = MATERIAL_TYPES.find(t => t.type === type)
  return materialType?.name || type
}

// Função para obter o nome da classificação pelo valor
export function getMaterialClassificationName(classification: string): string {
  const materialClassification = MATERIAL_CLASSIFICATIONS.find(c => c.classification === classification)
  return materialClassification?.name || classification
}
