// utils/validation/fields.ts
// Helper para validação de campos conforme schema real
// GUARDRAIL COMPLIANCE: Validação rigorosa de campos

import { REQUIRED_FIELDS, FORBIDDEN_FIELDS, FIELD_MAPPINGS } from '@/src/types/db';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateRequiredFields(
  data: Record<string, any>, 
  tableName: keyof typeof REQUIRED_FIELDS
): ValidationResult {
  const requiredFields = REQUIRED_FIELDS[tableName] || [];
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  );
  
  return {
    isValid: missingFields.length === 0,
    errors: missingFields.length > 0 ? [`Campos obrigatórios ausentes: ${missingFields.join(', ')}`] : [],
    warnings: []
  };
}

export function validateForbiddenFields(
  data: Record<string, any>, 
  tableName: keyof typeof FORBIDDEN_FIELDS
): ValidationResult {
  const forbiddenFields = FORBIDDEN_FIELDS[tableName] || [];
  const foundForbiddenFields = forbiddenFields.filter(field => 
    data[field] !== undefined
  );
  
  return {
    isValid: foundForbiddenFields.length === 0,
    errors: foundForbiddenFields.length > 0 ? [`Campos proibidos encontrados: ${foundForbiddenFields.join(', ')}`] : [],
    warnings: []
  };
}

export function validateFieldMappings(data: Record<string, any>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  Object.entries(FIELD_MAPPINGS).forEach(([oldField, newField]) => {
    if (data[oldField] !== undefined) {
      errors.push(`Campo '${oldField}' é obsoleto. Use '${newField}'`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateNumericField(
  value: any, 
  fieldName: string, 
  allowString: boolean = false
): ValidationResult {
  if (value === undefined || value === null) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  if (allowString && typeof value === 'string') {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return {
        isValid: false,
        errors: [`${fieldName} deve ser um número válido`],
        warnings: []
      };
    }
    return { isValid: true, errors: [], warnings: [] };
  }
  
  if (typeof value !== 'number') {
    return {
      isValid: false,
      errors: [`${fieldName} deve ser um número`],
      warnings: []
    };
  }
  
  return { isValid: true, errors: [], warnings: [] };
}

export function validateEnumField(
  value: any, 
  fieldName: string, 
  allowedValues: string[]
): ValidationResult {
  if (value === undefined || value === null) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  if (!allowedValues.includes(value)) {
    return {
      isValid: false,
      errors: [`${fieldName} deve ser um dos valores: ${allowedValues.join(', ')}`],
      warnings: []
    };
  }
  
  return { isValid: true, errors: [], warnings: [] };
}

export function validateDateField(
  value: any, 
  fieldName: string
): ValidationResult {
  if (value === undefined || value === null) {
    return { isValid: true, errors: [], warnings: [] };
  }
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return {
      isValid: false,
      errors: [`${fieldName} deve ser uma data válida`],
      warnings: []
    };
  }
  
  return { isValid: true, errors: [], warnings: [] };
}

export function validateAllFields(
  data: Record<string, any>, 
  tableName: keyof typeof REQUIRED_FIELDS
): ValidationResult {
  const results = [
    validateRequiredFields(data, tableName),
    validateForbiddenFields(data, tableName),
    validateFieldMappings(data)
  ];
  
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
}
