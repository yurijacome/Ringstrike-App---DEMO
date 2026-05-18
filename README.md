# RingStrikeApp — versão web mockada para portfólio

Sistema fullstack desenvolvido para gerenciamento de presença e controle operacional de uma academia de Muay Thai.

O projeto foi criado com foco em centralizar o gerenciamento de alunos, check-ins, turmas e mensalidades em uma única aplicação moderna, responsiva e integrada.

Esta versão foi preparada para rodar como demonstração front-end, sem depender do backend no Render ou do banco no Supabase.

---

## 🚀 Visão Geral

O RingStrikeApp permite que alunos realizem cadastro e login na plataforma, acompanhem informações importantes da academia e solicitem presença nas aulas através de um sistema de check-in.

Além da área do aluno, o sistema conta com um painel administrativo completo para gerenciamento operacional da academia.

## 👤 Área do Aluno

Os alunos possuem acesso a funcionalidades como:

* Cadastro e autenticação de conta
* Login tradicional e autenticação com Google
* Hub principal com avisos e informações importantes
* Visualização do status da mensalidade
* Visualização de planos e horários disponíveis
* Solicitação de check-ins nas aulas
* Histórico e controle de presença
* Página de perfil do usuário
* Interface responsiva adaptada para diferentes dispositivos

---

## 🛠️ Área Administrativa

O painel administrativo oferece controle total sobre o funcionamento da academia:

* Gerenciamento de usuários
* Controle de turmas e horários disponíveis
* Aprovação e confirmação de check-ins
* Envio de avisos globais para os alunos
* Controle de mensalidades vencidas
* Gerenciamento operacional das aulas
* Controle de presença dos alunos

---

## ⚙️ Tecnologias Utilizadas

## Frontend

* Next.js
* React
* TypeScript / JavaScript
* CSS Modules
* Context API

## Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt

## Banco de Dados

* PostgreSQL
* Supabase

## Infraestrutura & Deploy

* Vercel (Frontend)
* Render (Backend)

---

## 🔐 Autenticação & Segurança

O projeto conta com:

* Autenticação JWT
* Login com Google via NextAuth
* Hash de senhas utilizando bcrypt
* Controle de rotas protegidas
* Controle de permissões administrativas
* Variáveis de ambiente para informações sensíveis

---

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
