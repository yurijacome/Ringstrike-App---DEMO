import { validateEditUser } from "@/utils/validators";
import { MOCK_AUTH_USER, MOCK_USERS } from "@/services/mockData";

const STORAGE_KEY = "ringstrike_mock_users";

const clone = (value) => JSON.parse(JSON.stringify(value));

const readUsers = () => {
  if (typeof window === "undefined") return clone(MOCK_USERS);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return clone(MOCK_USERS);
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
    return clone(MOCK_USERS);
  }
};

const saveUsers = (users) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
};

export const getUsers = async () => readUsers();

export const getUser = async (userId) => {
  const users = readUsers();
  return users.find((user) => Number(user.id) === Number(userId)) || MOCK_AUTH_USER;
};

export const addUser = async (user) => {
  const users = readUsers();
  const newUser = {
    id: Date.now(),
    nome: user.nome,
    email: user.email,
    phone: user.phone || "",
    mensalidade: user.mensalidade || null,
    plano: user.plano || "",
    aulasvoucher: user.aulasvoucher || 0,
    isAdmin: Boolean(user.isAdmin),
    avisos: ["Cadastro criado na versão demonstrativa."],
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const editUser = async (userId, changes) => {
  const errorMessage = validateEditUser(changes);
  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  const users = readUsers().map((user) =>
    Number(user.id) === Number(userId) ? { ...user, ...changes } : user
  );
  saveUsers(users);
  return users.find((user) => Number(user.id) === Number(userId));
};

export const changePassword = async () => ({
  ok: true,
  message: "Senha alterada na simulação.",
});

export const deleteUser = async (userId) => {
  const users = readUsers().filter((user) => Number(user.id) !== Number(userId));
  saveUsers(users);
  return { ok: true };
};
