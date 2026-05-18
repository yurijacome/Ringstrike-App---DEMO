export const MOCK_USERS = [
  {
    id: 1,
    nome: "Yuri Jácome",
    email: "yuri.demo@ringstrike.com",
    phone: "85999998888",
    mensalidade: "2026-12-20T00:00:00.000Z",
    plano: "Mensalidade Livre",
    aulasvoucher: 8,
    isAdmin: true,
    avisos: [
      "Treino especial de sparring nesta sexta às 19h.",
      "Leve sua luva e chegue 10 minutos antes da aula.",
    ],
  },
  {
    id: 2,
    nome: "Amanda Lima",
    email: "amanda.demo@ringstrike.com",
    phone: "85988887777",
    mensalidade: "2026-09-10T00:00:00.000Z",
    plano: "Plano Manhã",
    aulasvoucher: 0,
    isAdmin: false,
    avisos: ["Seu plano está ativo."],
  },
  {
    id: 3,
    nome: "Carlos Silva",
    email: "carlos.demo@ringstrike.com",
    phone: "85977776666",
    mensalidade: "2026-04-10T00:00:00.000Z",
    plano: "Pacote 5 aulas",
    aulasvoucher: 2,
    isAdmin: false,
    avisos: [],
  },
];

export const MOCK_TURMAS = [
  {
    id: 1,
    nome: "Muay Thai Manhã",
    horario: "06:30",
    tipo_data: "Constante",
    dia_especifico: null,
    dias: ["Seg", "Qua", "Sex"],
  },
  {
    id: 2,
    nome: "Muay Thai Noite",
    horario: "19:00",
    tipo_data: "Constante",
    dia_especifico: null,
    dias: ["Seg", "Ter", "Qui"],
  },
  {
    id: 3,
    nome: "Aulão de Sábado",
    horario: "09:00",
    tipo_data: "Data unica",
    dia_especifico: "2026-06-06T00:00:00.000Z",
    dias: [],
  },
];

export const MOCK_CHECKINS = [
  {
    id: 1,
    user_id: 1,
    nome: "Yuri Jácome",
    turma_id: 1,
    criado_em: "2026-05-18T09:00:00.000Z",
    checkinstatus: "Confirmado",
  },
  {
    id: 2,
    user_id: 2,
    nome: "Amanda Lima",
    turma_id: 2,
    criado_em: "2026-05-18T10:00:00.000Z",
    checkinstatus: "Solicitado",
  },
  {
    id: 3,
    user_id: 3,
    nome: "Carlos Silva",
    turma_id: 3,
    criado_em: "2026-05-17T15:30:00.000Z",
    checkinstatus: "Cancelado",
  },
];

export const MOCK_AUTH_USER = MOCK_USERS[0];
export const MOCK_TOKEN = "portfolio-mock-token";
