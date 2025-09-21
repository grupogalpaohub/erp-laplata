# Local Server — Branch local-server

## Fluxo
1) Criar/alternar:
   ```bash
   scripts/setup-local-server-branch.sh
   ```

2) Criar .env.local (copie do .env.local.example):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://gpjcfwjssfvqhppxdudp.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3) Supabase → Auth → URL Configuration → Additional Redirect URLs:
   ```
   http://localhost:3000/auth/callback
   ```

4) Rodar:
   ```bash
   npm install
   npm run dev      # hot reload
   npm run preview  # build prod + start (igual Vercel)
   ```

## Publicar no GitHub sem disparar deploy no Vercel

Deixe o Vercel com auto-deploy desativado para branches não-prod.

Push:
```bash
git push -u origin local-server
```

## Observações

- O hook local bloqueia enviar erp-prod por engano.
- Use PR/merge de local-server → erp-dev quando quiser abrir Preview no Vercel.
