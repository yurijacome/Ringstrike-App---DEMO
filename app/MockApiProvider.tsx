"use client";

import { useEffect } from "react";
import { MOCK_CHECKINS, MOCK_TOKEN, MOCK_TURMAS, MOCK_USERS } from "@/services/mockData";

const STORAGE_KEY = "ringstrike_mock_db";

type MockDb = {
  users: any[];
  turmas: any[];
  checkins: any[];
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function seedDb(): MockDb {
  return {
    users: clone(MOCK_USERS),
    turmas: clone(MOCK_TURMAS),
    checkins: clone(MOCK_CHECKINS),
  };
}

function getDb(): MockDb {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const db = seedDb();
    saveDb(db);
    return db;
  }

  try {
    return JSON.parse(stored);
  } catch {
    const db = seedDb();
    saveDb(db);
    return db;
  }
}

function saveDb(db: MockDb) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function getBody(init?: RequestInit) {
  if (!init?.body) return {};
  try {
    return JSON.parse(init.body as string);
  } catch {
    return {};
  }
}

export default function MockApiProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const rawUrl = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
      const url = new URL(rawUrl, window.location.origin);

      if (!url.pathname.startsWith("/mock-api")) {
        return originalFetch(input, init);
      }

      const method = (init?.method || "GET").toUpperCase();
      const path = url.pathname.replace("/mock-api", "") || "/";
      const db = getDb();
      const body = await getBody(init);

      // Auth fake para a versão portfolio.
      if (path === "/login" && method === "POST") {
        const user = db.users.find((u) => u.email === body.login || u.nome === body.login) || db.users[0];
        return json({ ...user, token: MOCK_TOKEN });
      }

      if (path === "/google-login" && method === "POST") {
        const user = db.users[0];
        return json({ ...user, token: MOCK_TOKEN });
      }

      if (path === "/check-user" && method === "POST") {
        return json({ exists: true });
      }

      // Users
      if (path === "/users" && method === "GET") return json(db.users);

      const userMatch = path.match(/^\/users\/(\d+)$/);
      if (userMatch) {
        const id = Number(userMatch[1]);
        if (method === "GET") return json(db.users.find((u) => u.id === id) || db.users[0]);
        if (method === "PATCH") {
          db.users = db.users.map((u) => (u.id === id ? { ...u, ...body } : u));
          saveDb(db);
          return json(db.users.find((u) => u.id === id));
        }
        if (method === "DELETE") {
          db.users = db.users.filter((u) => u.id !== id);
          saveDb(db);
          return json({ ok: true });
        }
      }

      if (path === "/register" && method === "POST") {
        const user = {
          id: Date.now(),
          nome: body.nome,
          email: body.email,
          phone: body.phone || "",
          mensalidade: null,
          plano: "",
          aulasvoucher: 0,
          isAdmin: false,
          avisos: ["Cadastro criado na versão demonstrativa."],
        };
        db.users.push(user);
        saveDb(db);
        return json(user, 201);
      }

      if (path.match(/^\/user\/(\d+)\/password$/) && method === "PATCH") {
        return json({ ok: true, message: "Senha alterada na simulação." });
      }

      // Turmas
      if (path === "/turmas" && method === "GET") return json(db.turmas);

      if (path === "/turma" && method === "POST") {
        const turma = {
          id: Date.now(),
          nome: body.nome,
          horario: body.horario,
          tipo_data: body.tipoData,
          dia_especifico: body.diaEspecifico,
          dias: body.dias || [],
        };
        db.turmas.push(turma);
        saveDb(db);
        return json(turma, 201);
      }

      const turmaMatch = path.match(/^\/turma\/(\d+)$/);
      if (turmaMatch) {
        const id = Number(turmaMatch[1]);
        if (method === "PUT") {
          db.turmas = db.turmas.map((t) =>
            t.id === id
              ? {
                  ...t,
                  nome: body.nome,
                  horario: body.horario,
                  tipo_data: body.tipoData,
                  dia_especifico: body.diaEspecifico,
                  dias: body.dias || [],
                }
              : t
          );
          saveDb(db);
          return json(db.turmas.find((t) => t.id === id));
        }
        if (method === "DELETE") {
          db.turmas = db.turmas.filter((t) => t.id !== id);
          db.checkins = db.checkins.filter((c) => c.turma_id !== id);
          saveDb(db);
          return json({ ok: true });
        }
      }

      // Checkins
      if (path === "/checkins" && method === "GET") {
        const turmaId = url.searchParams.get("turma_id");
        const data = turmaId ? db.checkins.filter((c) => c.turma_id === Number(turmaId)) : db.checkins;
        return json(data);
      }

      const checkinsByUserMatch = path.match(/^\/checkins\/user\/(\d+)$/);
      if (checkinsByUserMatch && method === "GET") {
        const userId = Number(checkinsByUserMatch[1]);
        return json(db.checkins.filter((c) => c.user_id === userId));
      }

      if (path === "/checkin" && method === "POST") {
        const checkin = { id: Date.now(), ...body };
        db.checkins.push(checkin);
        saveDb(db);
        return json(checkin, 201);
      }

      const checkinMatch = path.match(/^\/checkins\/(\d+)$/);
      if (checkinMatch) {
        const id = Number(checkinMatch[1]);
        if (method === "PUT") {
          db.checkins = db.checkins.map((c) => (c.id === id ? { ...c, ...body } : c));
          saveDb(db);
          return json(db.checkins.find((c) => c.id === id));
        }
        if (method === "DELETE") {
          db.checkins = db.checkins.map((c) => (c.id === id ? { ...c, checkinstatus: "Cancelado" } : c));
          saveDb(db);
          return json({ ok: true });
        }
      }

      return json({ message: `Endpoint mock não mapeado: ${method} ${path}` }, 404);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return <>{children}</>;
}
