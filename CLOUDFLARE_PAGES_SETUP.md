# Cloudflare Pages Configuration

## Configuração do Projeto

### Root Directory
```
frontend
```

### Build Command
```bash
npm run pages:build
```

### Build Output Directory (Publish Directory)
```
.vercel/output/static
```

### Functions Directory
```
.vercel/output/functions
```

## Variáveis de Ambiente

Configure as seguintes variáveis no Cloudflare Pages Dashboard:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua_chave_anonima_aqui>
```

**⚠️ IMPORTANTE**: 
- NÃO use `SERVICE_ROLE_KEY` no frontend
- `SERVICE_ROLE_KEY` deve ser usado apenas em Edge Functions/Workers

## URLs de Deploy

- **Produção**: https://8823dbd9.erp-laplata.pages.dev
- **Branch**: erp-git

## Estrutura de Arquivos

```
frontend/
├── .vercel/output/        # Build output (publish directory)
│   ├── static/           # Static files
│   └── functions/        # Cloudflare Functions
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   └── lib/             # Utilities
├── next.config.js        # Next.js config
└── package.json         # Dependencies
```

## Comandos de Deploy

### Deploy Manual
```bash
cd frontend
npm run pages:build
npx wrangler pages deploy .vercel/output/static --functions .vercel/output/functions --project-name=erp-laplata
```

### Preview Local
```bash
cd frontend
npm run preview:cf
```

## Verificação

Após o deploy, verifique se todas as rotas estão funcionando:
- ✅ `/` (redirect)
- ✅ `/login`
- ✅ `/dashboard`
- ✅ `/mm` (Material Management)
- ✅ `/sd` (Sales & Distribution)
- ✅ `/wh` (Warehouse)
- ✅ `/crm` (Customer Relationship)
- ✅ `/fi` (Financial Management)
- ✅ `/co` (Controlling)