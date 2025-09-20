// Configuração centralizada para tipos e classificações de material
// Este arquivo deve ser atualizado sempre que houver mudanças no customizing

export const MATERIAL_TYPES = [
  { type: 'brinco', name: 'Brinco' },
  { type: 'gargantilha', name: 'Gargantilha' },
  { type: 'choker', name: 'Choker' },
  { type: 'pulseira', name: 'Pulseira' },
  { type: 'kit', name: 'Kit' }
]

export const MATERIAL_CLASSIFICATIONS = [
  { classification: 'acessorio', name: 'Acessório' },
  { classification: 'joia', name: 'Joia' },
  { classification: 'bijuteria', name: 'Bijuteria' },
  { classification: 'semi-joia', name: 'Semi-joia' }
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
