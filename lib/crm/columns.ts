// lib/crm/columns.ts
export const CRM_CUSTOMER_TABLE = "crm_customer";

/**
 * Colunas que sabemos existir hoje (base, já usadas no seu schema atual).
 * NÃO incluir tenant_id (RLS cuida).
 */
export const BASE_COLUMNS: readonly string[] = [
  "name",            // Nome/Razão Social
  "customer_type",   // "PF" | "PJ"
  "email",           // email principal
  "contact_email",   // email de contato
  "document_id",     // cpf/cnpj
  "telefone",        // telefone principal
  "contact_phone",   // telefone de contato
  "phone_country",   // país do telefone
  "contact_name",    // nome do contato
  "addr_street",     // rua
  "addr_number",     // número
  "addr_complement", // complemento
  "addr_district",   // bairro
  "addr_city",       // cidade
  "addr_state",      // estado
  "addr_zip",        // CEP
  "addr_country",    // país
  "is_active",       // ativo/inativo
  "status"           // status
] as const;

/**
 * Colunas opcionais. Se existirem no DB, serão usadas; senão, ignoradas de forma segura.
 * Você pode ampliar esta lista depois (sem risco).
 */
export const OPTIONAL_COLUMNS: readonly string[] = [
  "sales_channel",           // Canal/Origem
  "payment_method_pref",     // Ex.: PIX/BOLETO/CARTAO
  "payment_terms",           // Ex.: "AVISTA", "30", "30/60"
  "customer_category",       // Ex.: "ATACADO" | "VAREJO" | "VIP" | "REGULAR"
  "state_registration",      // IE
  "municipal_registration",  // IM
  "notes"                    // Observações
] as const;
