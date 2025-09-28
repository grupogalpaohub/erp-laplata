export const MATERIAL_CONFIG = {
  // Configurações de materiais
  DEFAULT_PAGE_SIZE: 20,
  MAX_BULK_OPERATIONS: 100,
} as const;

export const MATERIAL_TYPES = [
  'raw_material',
  'finished_good',
  'component',
  'service',
  'Brinco',
  'Choker',
  'Gargantilha',
  'Kit',
  'Pulseira'
] as const;

export const MATERIAL_CLASSIFICATIONS = [
  'prata',
  'ouro',
  'acabamento',
  'embalagem',
  'Amuletos',
  'Elementar',
  'Ciclos',
  'Ancestral'
] as const;

export const UNITS_OF_MEASURE = [
  'unidade',
  'kg',
  'g',
  'm',
  'cm',
  'l',
  'ml',
  'pcs',
  'box',
  'pallet'
] as const;

export const MATERIAL_PURITY_OPTIONS = [
  '925',
  '750',
  '585',
  '375',
  '999',
  '999.9'
] as const;

export const MATERIAL_COLOR_OPTIONS = [
  'Dourado',
  'Prateado',
  'Rose Gold',
  'Bronze',
  'Cobre',
  'Preto',
  'Branco',
  'Colorido'
] as const;

export const MATERIAL_FINISH_OPTIONS = [
  'Polido',
  'Fosco',
  'Escovado',
  'Martelado',
  'Lixado',
  'Brutal',
  'Acetinado'
] as const;

