export const MATERIAL_CONFIG = {
  // Configurações de materiais
  DEFAULT_PAGE_SIZE: 20,
  MAX_BULK_OPERATIONS: 100,
} as const;

export const MATERIAL_TYPES = [
  'Raw Material',
  'Finished Good',
  'Semi-Finished',
  'Component',
  'Consumable',
  'Tool',
  'Equipment'
] as const;

export const MATERIAL_CLASSIFICATIONS = [
  'A - High Value',
  'B - Medium Value', 
  'C - Low Value',
  'Critical',
  'Non-Critical'
] as const;

export const UNITS_OF_MEASURE = [
  'PCS',
  'KG',
  'L',
  'M',
  'M2',
  'M3',
  'EA',
  'BOX',
  'PALLET'
] as const;
