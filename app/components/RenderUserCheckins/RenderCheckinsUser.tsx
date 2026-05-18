"use client";

import "./checkinsUser.css";
import { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import { getTurmas } from "@/services/getTurmas";
import {
  getCheckinsByUser,
  CreateCheckin,
  DeleteCheckin,
  RedeployCheckin,
} from "@/services/getCheckins";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Turma {
  id: string;
  nome: string;
  horario: string;
  tipo_data: string;
  dia_especifico: string;
  dias: string[];
}

interface Checkin {
  id: string;
  turma_id: string;
  checkinstatus: string;
  criado_em: string;
  nome: string;
}

const CheckinsUser = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [userCheckins, setUserCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequest, setLoadingRequest] = useState<Record<string, boolean>>(
    {}
  );

  const { user } = useAuth();

  //pega dados
  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }

      // dados das turmas
      const turmasData: Turma[] = await getTurmas();
      setTurmas(turmasData);

      //dados dos checkins do usuario
      const userCheckinsData: Checkin[] = await getCheckinsByUser(user?.id);
      setUserCheckins(userCheckinsData);

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setTurmas([]);
      setUserCheckins([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // #region Data ------------------------------------------------------------------
  const hoje = new Date();
  const HojeISO = new Date(
    hoje.toLocaleString("en-US", { timeZone: "America/Fortaleza" })
  ).toISOString();

  const HojeFormatado = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Fortaleza",
  });

  const hojeSemana = new Date().toLocaleDateString("pt-BR", {
    timeZone: "America/Fortaleza",
    weekday: "long",
  });

  const hojeSemanaFormatado =
    hojeSemana.charAt(0).toUpperCase() + hojeSemana.slice(1, 3).toLowerCase();

  const getDataSemTimestamp = (data: string) => {
    const dataSemTimestamp = new Date(data).toISOString().split("T")[0];
    return dataSemTimestamp;
  };
  // #endregion

  // Function to find checkin for a specific turma
  const findCheckinsForTurma = (turmaId: string): Checkin | null => {
    return userCheckins.find((checkin) => checkin.turma_id === turmaId) || null;
  };

  // função para localizar no usercheckis checkis feitos no dia atual para a turma especifica
  const findCheckinsForHoje = (turmaId: string): Checkin | null => {
    return (
      userCheckins.find(
        (checkin) =>
          checkin.turma_id === turmaId &&
          getDataSemTimestamp(checkin.criado_em) ===
            getDataSemTimestamp(HojeISO)
      ) || null
    );
  };

  // Function to render a card for a specific turma
  const TurmaCard = ({
    turma,
    checkin,
  }: {
    turma: Turma;
    checkin: Checkin | null;
  }) => {
    const DiaEspecificoFormatado =
      turma.dia_especifico && turma.dia_especifico.trim() !== ""
        ? new Date(turma.dia_especifico).toLocaleDateString("pt-BR", {
            timeZone: "America/Fortaleza",
          })
        : "";

    // #region handlers de Checkin ----------------------------------------------------------
    const handleRequestCheckin = async (turmaId: string) => {
      const checkinData = {
        user_id: user?.id || "",
        nome: user?.nome || "",
        turma_id: turmaId,
        criado_em: HojeISO,
        checkinstatus: "Solicitado",
      };

      try {
        setLoadingRequest((prev) => ({ ...prev, [turmaId]: true }));
        await CreateCheckin(checkinData);
        toast.success("Check-in solicitado com sucesso!");
      } catch {
        toast.error("Erro ao solicitar check-in.");
      } finally {
        await fetchData();
        setLoadingRequest((prev) => ({ ...prev, [turmaId]: false }));
      }
    };

    const handleDelete = async (checkinId: string) => {
      if (!window.confirm("Você tem certeza que deseja cancelar o checkin?"))
        return;
      try {
        setLoadingRequest((prev) => ({ ...prev, [checkinId]: true }));
        await DeleteCheckin(checkinId);
        toast.success("Check-in cancelado com sucesso!");
      } catch {
        toast.error("Erro ao cancelar check-in.");
      } finally {
        await fetchData();
        setLoadingRequest((prev) => ({ ...prev, [checkinId]: false }));
      }
    };

    const handleRedeploy = async (checkinId: string) => {
      try {
        setLoadingRequest((prev) => ({ ...prev, [checkinId]: true }));
        await RedeployCheckin(checkinId);
        toast.success("Check-in solicitado com sucesso!");
      } catch {
        toast.error("Erro ao solicitar check-in.");
      } finally {
        await fetchData();
        setLoadingRequest((prev) => ({ ...prev, [checkinId]: false }));
      }
    };
    // #endregion

    return (
      <div className="UserTurmaCard">
        <div className="UserTurmaCardHeader">
          <h3>Turma</h3>
          <span>{turma.nome}</span>
        </div>

        <div className="UserTurmaCardBody">
          <div className="infoRow">
            <div className="UserTurmaCardInfo">
              <h4>Horario:</h4>
              <span>{turma.horario}</span>
            </div>

            <div className="UserTurmaCardInfo">
              <h4>Data:</h4>
              <span>
                {turma.dia_especifico ? DiaEspecificoFormatado : HojeFormatado}
              </span>
            </div>
          </div>

          <div className="infoRow">
            <div className="UserTurmaCardInfo">
              <h4>Status:</h4>
              <span className={`status ${checkin?.checkinstatus}`}>{checkin ? checkin.checkinstatus : "Nenhum check-in"}</span>
            </div>

            {checkin &&
            (checkin.checkinstatus === "Solicitado" ||
              checkin.checkinstatus === "Confirmado") ? (
              <button
                onClick={() => handleDelete(checkin.id)}
                className="request-checkin-btn"
                disabled={loadingRequest[checkin.id]}
              >
                {loadingRequest[checkin.id]
                  ? "Cancelando..."
                  : "Cancelar Checkin"}
              </button>
            ) : checkin && checkin.checkinstatus === "Cancelado" ? (
              <button
                onClick={() => handleRedeploy(checkin.id)}
                className="request-checkin-btn"
                disabled={loadingRequest[checkin.id]}
              >
                {loadingRequest[checkin.id]
                  ? "Re-Solicitando..."
                  : "Re-Solicitar Checkin"}
              </button>
            ) : (
              <button
                onClick={() => handleRequestCheckin(turma.id)}
                className="request-checkin-btn"
                disabled={loadingRequest[turma.id]}
              >
                {loadingRequest[turma.id]
                  ? "Solicitando..."
                  : "Solicitar Checkin"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };



  if (loading) {
    return (
      <div className="componentContent">
        <Loading text="Carregando Turmas" subtext="Buscando informações..." />
      </div>
    );
  }

  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2>Meus Check-ins</h2>
      </div>

      <div className="componentArea">
        {turmas.map((turma) =>
          turma.tipo_data === "Data unica" ? (
            <TurmaCard
              key={turma.id}
              turma={turma}
              checkin={findCheckinsForTurma(turma.id)}
            />
          ) : turma.dias && turma.dias.includes(hojeSemanaFormatado) ? (
            <TurmaCard
              key={turma.id}
              turma={turma}
              checkin={findCheckinsForHoje(turma.id)}
            />
          ) : null
        )}
      </div>
    </div>
  );
};

export default CheckinsUser;
