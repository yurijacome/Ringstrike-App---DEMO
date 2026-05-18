# RingStrikeApp — versão web mockada para portfólio

Esta versão foi preparada para rodar como demonstração front-end, sem depender do backend no Render ou do banco no Supabase.

## O que foi mockado

- Usuários
- Turmas
- Check-ins
- Login tradicional
- Login Google
- Cadastro
- Edição de perfil
- Edição/criação/exclusão de turmas
- Confirmação/cancelamento/solicitação de check-ins

Os dados ficam salvos no `localStorage`, então a demo permite interação básica sem API real.

## Acesso sem login

As rotas abaixo ficam acessíveis diretamente:

- `/pageUser`
- `/pageAdmin`

A autenticação foi substituída por um usuário demonstrativo em `context/AuthContext.tsx`.

## Arquivos principais alterados/adicionados

- `services/mockData.js` — dados iniciais mockados
- `services/api.js` — base fake `/mock-api`
- `app/MockApiProvider.tsx` — intercepta chamadas mockadas restantes
- `services/getUsers.jsx` — CRUD mockado de usuários
- `services/getTurmas.jsx` — CRUD mockado de turmas
- `services/getCheckins.jsx` — CRUD mockado de check-ins
- `context/AuthContext.tsx` — usuário mockado sempre disponível
- `services/ProtectedRoute.tsx` — libera rotas protegidas na demo
- `app/layout.tsx` — remove dependência de Google Fonts para build offline
- `app/components/RenderTurmas/RenderTurmas.jsx` — ações de turmas apontam para serviços mockados

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse:

```txt
http://localhost:3000/pageUser
http://localhost:3000/pageAdmin
```

## Resetar dados mockados

No navegador, limpe o `localStorage` do site ou execute no console:

```js
localStorage.clear();
location.reload();
```
