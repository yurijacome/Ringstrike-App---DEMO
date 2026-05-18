import { MOCK_TURMAS } from "@/services/mockData";

const STORAGE_KEY = "ringstrike_mock_turmas";
const clone = (value) => JSON.parse(JSON.stringify(value));

const readTurmas = () => {
  if (typeof window === "undefined") return clone(MOCK_TURMAS);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TURMAS));
    return clone(MOCK_TURMAS);
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TURMAS));
    return clone(MOCK_TURMAS);
  }
};

const saveTurmas = (turmas) => {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(turmas));
};

export async function getTurmas() {
  return readTurmas();
}

export async function addTurma(body) {
  const turmas = readTurmas();
  const turma = {
    id: Date.now(),
    nome: body.nome,
    horario: body.horario,
    tipo_data: body.tipoData,
    dia_especifico: body.diaEspecifico,
    dias: body.dias || [],
  };
  turmas.push(turma);
  saveTurmas(turmas);
  return turma;
}

export async function editTurma(turmaId, body) {
  const turmas = readTurmas().map((turma) =>
    Number(turma.id) === Number(turmaId)
      ? {
          ...turma,
          nome: body.nome,
          horario: body.horario,
          tipo_data: body.tipoData,
          dia_especifico: body.diaEspecifico,
          dias: body.dias || [],
        }
      : turma
  );
  saveTurmas(turmas);
  return turmas.find((turma) => Number(turma.id) === Number(turmaId));
}

export async function deleteTurma(turmaId) {
  const turmas = readTurmas().filter((turma) => Number(turma.id) !== Number(turmaId));
  saveTurmas(turmas);
  return { ok: true };
}
