# 🚀 Deploy do ERP Laplata no Supabase

## 📋 Instruções de Deploy

### 1. Acesse o Supabase Dashboard
- URL: https://supabase.com/dashboard
- Projeto: `gpjcfwjssfvqhppxdudp`

### 2. Execute o SQL no Editor SQL
1. Vá para **SQL Editor** no menu lateral
2. Clique em **New Query**
3. Copie e cole o conteúdo do arquivo `deploy_supabase.sql`
4. Clique em **Run** para executar

### 3. Verificar Deploy
Após executar o SQL, verifique se:
- [ ] Todas as tabelas foram criadas
- [ ] RLS está habilitado
- [ ] Políticas foram aplicadas
- [ ] Funções foram criadas
- [ ] Dados iniciais foram inseridos

### 4. Configurar Edge Functions (Manual)

#### 4.1. Acesse Functions
- No menu lateral, vá para **Edge Functions**

#### 4.2. Criar cada função:

**setup-mm:**
1. Clique em **Create a new function**
2. Nome: `setup-mm`
3. Copie o conteúdo de `supabase/functions/setup-mm/index.ts`
4. Deploy

**po-create:**
1. Clique em **Create a new function**
2. Nome: `po-create`
3. Copie o conteúdo de `supabase/functions/po-create/index.ts`
4. Deploy

**so-create:**
1. Clique em **Create a new function**
2. Nome: `so-create`
3. Copie o conteúdo de `supabase/functions/so-create/index.ts`
4. Deploy

**kpi-refresh:**
1. Clique em **Create a new function**
2. Nome: `kpi-refresh`
3. Copie o conteúdo de `supabase/functions/kpi-refresh/index.ts`
4. Deploy

### 5. Configurar Google OAuth

#### 5.1. Acesse Authentication
- No menu lateral, vá para **Authentication**
- Clique em **Providers**

#### 5.2. Configurar Google
1. Ative o **Google** provider
2. Configure as credenciais:
   - **Client ID**: (fornecido pelo Google)
   - **Client Secret**: (fornecido pelo Google)
3. **Redirect URLs**: 
   - `https://gpjcfwjssfvqhppxdudp.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (para desenvolvimento)

### 6. Configurar Variáveis de Ambiente

#### 6.1. Acesse Settings
- No menu lateral, vá para **Settings**
- Clique em **API**

#### 6.2. Anotar as chaves:
- **Project URL**: `https://gpjcfwjssfvqhppxdudp.supabase.co`
- **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (apenas backend)

### 7. Testar o Sistema

#### 7.1. Testar Autenticação
1. Vá para **Authentication** > **Users**
2. Crie um usuário de teste
3. Teste login

#### 7.2. Testar APIs
1. Vá para **API** > **REST**
2. Teste as tabelas criadas
3. Verifique se RLS está funcionando

#### 7.3. Testar Edge Functions
1. Vá para **Edge Functions**
2. Teste cada função criada
3. Verifique logs

## ✅ Checklist de Deploy

- [ ] SQL executado com sucesso
- [ ] Todas as tabelas criadas
- [ ] RLS habilitado e funcionando
- [ ] Edge Functions deployadas
- [ ] Google OAuth configurado
- [ ] Usuário de teste criado
- [ ] APIs testadas
- [ ] Variáveis de ambiente anotadas

## 🔧 Troubleshooting

### Erro de RLS
- Verificar se as políticas foram aplicadas
- Confirmar que o JWT contém `tenant_id`

### Erro de Edge Functions
- Verificar se as funções foram deployadas
- Confirmar variáveis de ambiente

### Erro de Conexão
- Verificar URL e chaves
- Confirmar que o projeto está ativo

## 📞 Próximos Passos

Após o deploy no Supabase:
1. **Deploy no Cloudflare Pages**
2. **Configurar variáveis de ambiente**
3. **Testar sistema completo**
4. **Configurar domínio personalizado**

## 🎉 Deploy Concluído!

O ERP Laplata estará pronto para uso após seguir todos os passos acima.