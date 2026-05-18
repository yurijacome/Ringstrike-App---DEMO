import { MOCK_CHECKINS } from "@/services/mockData";

const STORAGE_KEY = "ringstrike_mock_checkins";
const clone = (value) => JSON.parse(JSON.stringify(value));

const readCheckins = () => {
  if (typeof window === "undefined") return clone(MOCK_CHECKINS);
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CHECKINS));
    return clone(MOCK_CHECKINS);
  }
  try {
    return JSON.parse(stored);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CHECKINS));
    return clone(MOCK_CHECKINS);
  }
};

const saveCheckins = (checkins) => {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(checkins));
};

export const getCheckins = async (turmaId = null) => {
  const checkins = readCheckins();
  return turmaId ? checkins.filter((checkin) => Number(checkin.turma_id) === Number(turmaId)) : checkins;
};

export const getCheckinsByUser = async (userId) => {
  return readCheckins().filter((checkin) => Number(checkin.user_id) === Number(userId));
};

export const CreateCheckin = async (checkinData) => {
  const checkins = readCheckins();
  const newCheckin = { id: Date.now(), ...checkinData };
  checkins.push(newCheckin);
  saveCheckins(checkins);
  return newCheckin;
};

const updateStatus = async (checkinId, status) => {
  const checkins = readCheckins().map((checkin) =>
    Number(checkin.id) === Number(checkinId) ? { ...checkin, checkinstatus: status } : checkin
  );
  saveCheckins(checkins);
  return checkins.find((checkin) => Number(checkin.id) === Number(checkinId));
};

export const ConfirmCheckin = async (checkinId) => updateStatus(checkinId, "Confirmado");
export const DeleteCheckin = async (checkinId) => updateStatus(checkinId, "Cancelado");
export const CancelCheckin = async (checkinId) => updateStatus(checkinId, "Cancelado");
export const RedeployCheckin = async (checkinId) => updateStatus(checkinId, "Solicitado");
