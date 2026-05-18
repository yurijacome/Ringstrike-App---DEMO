"use client";

import "./RenderCheckins.css";
import { useState, useEffect } from "react";

import { getTurmas } from "@/services/getTurmas";
import { getUsers } from "@/services/getUsers";
import {
  getCheckins,
  ConfirmCheckin,
  DeleteCheckin,
  CreateCheckin,
} from "@/services/getCheckins";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { X } from "lucide-react";



// componente principal que renderiza Checkins
const RenderCheckins = () => {
  const [turmas, setTurmas] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCheckins, setLoadingCheckins] = useState({});

  // Fetch turmas and checkins and users
  const fetchData = async () => {
    try {
      setLoading(true);
      const turmasData = await getTurmas();
      setTurmas(turmasData);

      const usersData = await getUsers();
      setUsers(usersData);

      // Fetch checkins for each turma based on its type
      const allCheckins = [];
      for (const turma of turmasData) {
        try {
          const checkinsData = await getCheckins(turma.id);

          allCheckins.push(...checkinsData);
        } catch (error) {
          console.error(
            `Erro ao buscar checkins para turma ${turma.id}:`,
            error
          );
        }
      }
      setCheckins(allCheckins);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setTurmas([]);
      setCheckins([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Filter checkins by turma
  const getCheckinsByTurma = (turmaId) => {
    return checkins.filter((checkin) => checkin.turma_id === turmaId);
  };

  const parseDate = (value) => {
    const date = new Date(value);
    return value && !isNaN(date.getTime()) ? date : null;
  };

  // handlers
  const handleConfirm = async (checkinId) => {
    try {
      setLoadingCheckins((prev) => ({ ...prev, [checkinId]: true }));
      await ConfirmCheckin(checkinId);

      // Update the checkin status locally instead of refetching
      setCheckins((prevCheckins) =>
        prevCheckins.map((checkin) =>
          checkin.id === checkinId
            ? { ...checkin, checkinstatus: "Confirmado" }
            : checkin
        )
      );

      toast.success("Check-in confirmado com sucesso!");

      // Show success feedback
    } catch (error) {
      console.error("Erro ao confirmar check-in:", error);
      toast.error("Erro ao confirmar check-in. Tente novamente.");
    } finally {
      setLoadingCheckins((prev) => ({ ...prev, [checkinId]: false }));
    }
  };

  const handleDelete = async (checkinId) => {
    if (!window.confirm("Você tem certeza que deseja cancelar o checkin?"))
      return;
    try {
      setLoadingCheckins((prev) => ({ ...prev, [checkinId]: true }));
      await DeleteCheckin(checkinId);

      // Update the checkin status locally instead of refetching
      setCheckins((prevCheckins) =>
        prevCheckins.map((checkin) =>
          checkin.id === checkinId
            ? { ...checkin, checkinstatus: "Cancelado" }
            : checkin
        )
      );

      // Show success feedback
      toast.success("Check-in cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar check-in:", error);
      toast.error("Erro ao cancelar check-in. Tente novamente.");
    } finally {
      setLoadingCheckins((prev) => ({ ...prev, [checkinId]: false }));
    }
  };

  // formata dia atual em iso para comparação com user
  const Hoje = new Date();
  const dataHoje = Hoje.toISOString().split('T')[0];


  // Card para adicionar um novo checkin
  const NewCheckinCard = ({ setNewCardOpen, turmaId }) => {
  
    const [selectedUserID, setSelectedUserID] = useState("");
    const selectedUser = users.find((u) => u.id === Number(selectedUserID));

    
      const hoje = new Date();
      const HojeISO = new Date(
        hoje.toLocaleString("en-US", { timeZone: "America/Fortaleza" })
      ).toISOString();
    
      const handleAddNewCheckin = async () => {
        const checkinData = {
          user_id: Number(selectedUserID) || "",
          nome: selectedUser?.nome || "",
          turma_id: turmaId,
          criado_em: HojeISO,
          checkinstatus: "Solicitado",
        };

        const today = new Date(HojeISO).toISOString().split('T')[0];
        const existingCheckin = checkins.find(checkin => checkin.user_id === checkinData.user_id && checkin.turma_id === checkinData.turma_id && checkin.criado_em.split('T')[0] === today);

        if (existingCheckin) {
          toast.error("checkin ja realizado para esse usuario");
          return;
        }

        try {
          await CreateCheckin(checkinData);
          toast.success("Check-in solicitado com sucesso!");
          // Update the checkins list locally instead of refetching
          setCheckins((prevCheckins) => [...prevCheckins, { ...checkinData, id: Date.now() }]);
          setNewCardOpen(false);
        } catch (error) {
          if (error.message.includes("Já existe um checkin para essa turma na mesma data")) {
            toast.error("checkin ja realizado para esse usuario");
          } else {
            toast.error("Erro ao solicitar check-in: " + error.message);
          }
        } 

      };


  return (
    <div className="checkinCard">
      <div className="checkinInfo">
        <h5>Usuário:</h5>
        <select
          className="selecUser"
          value={selectedUserID}
          onChange={(e) => setSelectedUserID(e.target.value)}
        >
          <option value="">Selecione um usuário</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="AddButtons">
        <X
          color="var(--mainColor3)"
          size={20}
          onClick={() => setNewCardOpen(false)}
          style={{ marginRight: "10px" }}
        ></X>

        <button
          className="checkinButton"
          onClick={() => handleAddNewCheckin()}
        >
          Solicitar
        </button>
      </div>
    </div>
  );
};

  
  // Card de checkin por turma
  const TurmaCheckinsCard = ({ turma }) => {
    const [activeFilter, setActiveFilter] = useState("Solicitado");
    const [newCardOpen, setNewCardOpen] = useState(false);
    const turmaCheckins = getCheckinsByTurma(turma.id);

    // Formatação de datas
    const DiaEspecificoFormatado = new Date(
      turma.dia_especifico
    ).toLocaleDateString("pt-BR", { timeZone: "UTC" });

    const HojeFormatado = new Date().toLocaleDateString("pt-BR", {
      timeZone: "UTC",
    });


    // Contagem otimizada por status
    const countByStatus = (status) =>
      turmaCheckins.filter((checkin) => checkin.checkinstatus === status)
        .length;

    // Filtragem simplificada
    const filteredCheckins = turmaCheckins.filter(
      (checkin) => checkin.checkinstatus === activeFilter
    );

    // Renderização
    return (
      <div key={turma.id} className="CheckinTurmaCard">
        <div className="CheckinCardHeader">
          <h3>
            Turma : <span>{turma.nome}</span>
          </h3>
          <div className="CheckinCardDataArea">
            {turma.tipo_data === "Data unica" ? (
              <h3>
                Data : <span>{DiaEspecificoFormatado}</span>
              </h3>
            ) : (
              <h3>
                Data : <span>{HojeFormatado}</span>
              </h3>
            )}

            <h3>
              Horário : <span>{turma.horario}</span>
            </h3>
          </div>
        </div>

        <div className="CheckinCardBody">
          <div className="checkin-actions">
            <button
              className={`checkin-btn ${
                activeFilter === "Solicitado" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("Solicitado")}
            >
              Solicitados ({countByStatus("Solicitado")})
            </button>
            <button
              className={`checkin-btn ${
                activeFilter === "Confirmado" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("Confirmado")}
            >
              Confirmados ({countByStatus("Confirmado")})
            </button>
          </div>

          <div className="checkinsArea">
            {filteredCheckins.length === 0 ? (
              <div className="checkins">
                {newCardOpen && (
                  <NewCheckinCard
                    setNewCardOpen={setNewCardOpen}
                    turmaId={turma.id}
                  />
                )}
                <div className="checkinCard">
                  <button
                    className="checkinAddButton"
                    onClick={() => setNewCardOpen(true)}
                    title= "Adicionar novo checkin"

                  >
                    <p>+</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="checkins">
                {filteredCheckins.map((checkin) => {
                  const mensalidadeData = parseDate(checkin.mensalidade);
                  const mensalidadeTexto = mensalidadeData
                    ? mensalidadeData.toLocaleDateString("pt-BR")
                    : "Sem mensalidade";
                  const mensalidadeAtual = mensalidadeData
                    ? mensalidadeData.toISOString().split('T')[0] >= dataHoje
                    : false;

                  return (
                    <div key={checkin.id} className="checkinCard">
                      <div className="checkinInfo">
                        <h5 className="checkinName">
                          Nome: <span>{checkin.nome}</span>
                        </h5>
                        <h5>
                          Plano: <span>{checkin.plano ? checkin.plano : "Sem plano"}</span>
                        </h5>
                        <h5>
                          Aulas Voucher: <span>{checkin.aulasvoucher ? checkin.aulasvoucher : "Sem voucher"}</span>
                        </h5>
                        <h5>
                          Mensalidade: <span className={mensalidadeAtual ? "green" : ""}>{mensalidadeTexto}</span>
                        </h5>
                        <h5 className="checkinTime">
                          Solicitado as:
                          <span>
                            {new Date(checkin.criado_em).toLocaleTimeString("pt-BR")}
                          </span>
                        </h5>
                      </div>

                      <div>
                        {checkin.checkinstatus === "Solicitado" ? (
                          <button
                            onClick={() => handleConfirm(checkin.id)}
                            className="checkinButton confirm-btn"
                            disabled={loadingCheckins[checkin.id]}
                          >
                            {loadingCheckins[checkin.id] ? "Confirmando" : "Confirmar"}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDelete(checkin.id)}
                            className="checkinButton cancel-btn"
                            disabled={loadingCheckins[checkin.id]}
                          >
                            {loadingCheckins[checkin.id] ? "Cancelando..." : "Cancelar"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {newCardOpen && (
                  <NewCheckinCard
                    setNewCardOpen={setNewCardOpen}
                    turmaId={turma.id}
                  />
                )}
                <div className="checkinCard">
                  <button
                    className="checkinAddButton"
                    onClick={() => setNewCardOpen(true)}
                  >
                    <p>+</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // carregamento 
  if (loading) {
    return (
      <div className="componentContent">
        <Loading text="Carregando Checkins" subtext="Buscando informações..." />
      </div>
    );
  }
  // Sem turmas
  if (turmas.length === 0) {
    return (
      <div className="componentContent">
        <div className="empty-message">
          <h2>Nenhuma turma encontrada</h2>
        </div>
      </div>
    );
  }

  // Renderização final
  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2>Checkins</h2>
      </div>

      <div className="componentArea">
        {turmas.map((turma) => (
          <TurmaCheckinsCard key={turma.id} turma={turma} />
        ))}
      </div>
    </div>
  );
};

export default RenderCheckins;
