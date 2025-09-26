// .guardrails/guardrail.ts
export function GUARDRAIL_CHECK() {
  console.log("🛡️ GUARDRAIL ATIVADO - ERP-V1");

  // 1) Verdades absolutas
  const ABSOLUTE_TRUTHS = [
    "✅ .env.local existe e está correto",
    "✅ admin@teste.com existe e é admin ativo",
    "✅ DB existe e RLS/Policies estão ATIVAS e FORÇADAS",
    "✅ Tenant real ativo: LaplataLunaria",
    "✅ O diretório do projeto é ERP-V1 (repo: grupogalpaohub/erp-laplata, branch ERP-V1)",
  ];

  // 2) Proibições absolutas
  const ABSOLUTE_PROHIBITIONS = [
    "❌ NUNCA tocar em RLS/policies/funções/triggers/roles do banco",
    "❌ NUNCA rodar migrações ou DDL sem ordem explícita do owner",
    "❌ NUNCA mexer em .env.local sem instrução explícita",
    "❌ NUNCA desabilitar middleware",
    "❌ NUNCA criar GRANT ALL / bypass de segurança",
    "❌ NUNCA usar Service Role no client/browser",
    "❌ NUNCA pedir Supabase URL/keys/URI ─ já estão no .env.local",
    "❌ NUNCA alterar UI/UX (cores, tipografia, layout, componentes)",
  ];

  // 3) Processo obrigatório
  const MANDATORY_PROCESS = [
    "1. Executar somente após terminal/log indicar pronto",
    "2. Para qualquer bug: trazer evidências do Console e Network (print/log) antes de mudar código",
    "3. Seguir o protocolo das 3 Provas em caso de erro",
  ];

  // 4) Protocolo 3 Provas
  const THREE_PROOFS_PROTOCOL = [
    "Prova 1: Schema existe",
    "Prova 2: Dados existem",
    "Prova 3: RLS ativo e coerente",
    "Se OK e app não mostra → problema no código (front/API)",
  ];

  // 5) Diagnóstico obrigatório
  const DIAGNOSTIC_REQUIREMENTS = [
    "Mostrar erros do console do browser",
    "Mostrar requests falhando no network (status/body)",
    "Confirmar que está quebrado (passos para reproduzir)",
  ];

  // 6) Regras UI/UX
  const UI_UX_RULES = [
    "🎨 NÃO alterar UI/UX sem autorização explícita",
    "🎨 Manter padrão visual existente (Tailwind, componentes atuais)",
  ];

  console.table({ ABSOLUTE_TRUTHS, ABSOLUTE_PROHIBITIONS, MANDATORY_PROCESS, THREE_PROOFS_PROTOCOL, DIAGNOSTIC_REQUIREMENTS, UI_UX_RULES });

  return {
    canProceed: false,
    status: "BLOQUEADO - AGUARDANDO AUTORIZAÇÃO",
    message: "NÃO POSSO FAZER NADA SEM SEGUIR TODOS OS GUARDRAILS",
    nextStep: "Apresentar evidências e pedir autorização explícita"
  };
}

export function PROTOCOL_CHECK(action: string) {
  console.log("🔍 PROTOCOLO ATIVADO PARA:", action);
  const steps = [
    "1. INVESTIGAR: Console/Network",
    "2. CONFIRMAR: Evidências concretas",
    "3. PERGUNTAR: 'Posso fazer X? Autorização explícita?'",
    "4. AGUARDAR: ok do owner",
    "5. EXECUTAR: só após autorização explícita",
  ];
  steps.forEach(s => console.log(s));
  return {
    action,
    status: "BLOQUEADO - AGUARDANDO AUTORIZAÇÃO",
    nextStep: "Evidências + permissão"
  };
}
