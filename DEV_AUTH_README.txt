DEV AUTH (LOCAL)
================
1) Crie um usuário de teste no Supabase Auth (email/senha).
2) Exponha no seu ambiente local:
   TEST_EMAIL="seu-email@teste.com"
   TEST_PASSWORD="sua-senha"
3) Faça login DEV:
   curl -i -X POST http://localhost:3000/auth/dev-login
4) Verifique sessão:
   open http://localhost:3000/debug/session
5) Para sair:
   curl -i -X POST http://localhost:3000/auth/dev-logout

Observações:
- Essas rotas retornam 403 em produção.
- Não alteramos Supabase nem .env automaticamente.
- Sem sessão, a RLS retorna 0 linhas (comportamento correto).

WINDOWS (PowerShell):
====================
1) $env:TEST_EMAIL="seu-email@teste.com"
2) $env:TEST_PASSWORD="sua-senha"
3) Invoke-WebRequest -Uri "http://localhost:3000/auth/dev-login" -Method POST
4) Abra http://localhost:3000/debug/session

WINDOWS (CMD):
==============
1) set TEST_EMAIL=seu-email@teste.com
2) set TEST_PASSWORD=sua-senha
3) curl -X POST http://localhost:3000/auth/dev-login
4) Abra http://localhost:3000/debug/session
