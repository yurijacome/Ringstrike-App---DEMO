"use client";

import "./RenderTurmas.css";
import { useState, useEffect, useRef } from "react";

import { getTurmas, addTurma, editTurma, deleteTurma } from "@/services/getTurmas";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Pen } from "lucide-react";
import { Trash } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";


// Componente Principal para renderizar turmas
const GenerateTurmaCards = () => {
  const [turmas, setTurmas] = useState([]);
  const [showNewCard, setShowNewCard] = useState(false);
  const [loading, setLoading] = useState(true);

  // Busca as turmas na API quando o componente monta
  useEffect(() => {
    const fetchTurmas = async () => {
      setLoading(true);
      const data = await getTurmas();
      setTurmas(data);
      setLoading(false);
    };

    fetchTurmas();
  }, []); // array vazio -> executa só na montagem


  // Componente para selecionar o horário
  const TimeWhell = ({ horario, setHorario }) => {
  const hours = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    value: i.toString().padStart(2, "0"),
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    value: i.toString().padStart(2, "0"),
  }));

  // Parse o horário atual para extrair horas e minutos
  const currentTime = horario || "17:00";
  const [currentHour, currentMinute] = currentTime.split(':').map(Number);
  
  const [hour, setHour] = useState(currentHour || 12);
  const [minute, setMinute] = useState(currentMinute || 0);
  const hourWheelRef = useRef(null);
  const minuteWheelRef = useRef(null);

  // Atualiza o horário completo quando hora ou minuto mudam
  useEffect(() => {
    const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    setHorario(newTime);
  }, [hour, minute]);

  // Rola para o item selecionado quando o componente é montado
  useEffect(() => {
    if (hourWheelRef.current) {
      const selectedHourElement = hourWheelRef.current.querySelector(`.timewheel-item.selected`);
      if (selectedHourElement) {
        selectedHourElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    if (minuteWheelRef.current) {
      const selectedMinuteElement = minuteWheelRef.current.querySelector(`.timewheel-item.selected`);
      if (selectedMinuteElement) {
        selectedMinuteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const handleHourChange = (selectedHour, element) => {
    const newHour = parseInt(selectedHour);
    setHour(newHour);
    
    // Mantém a posição de rolagem
    if (element && hourWheelRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleMinuteChange = (selectedMinute, element) => {
    const newMinute = parseInt(selectedMinute);
    setMinute(newMinute);
    
    // Mantém a posição de rolagem
    if (element && minuteWheelRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="timewheel-container">
      <div className="timewheel-column">
        {/* <div className="timewheel-label">Hora</div> */}
        <div className="timewheel" ref={hourWheelRef}>
          {hours.map((h) => (
            <div
              key={h.id}
              className={`timewheel-item ${hour === h.id ? 'selected' : ''}`}
              onClick={(e) => handleHourChange(h.value, e.currentTarget)}
            >
              {h.value}
            </div>
          ))}
        </div>
      </div>
      
      <div className="timewheel-separator">:</div>
      
      <div className="timewheel-column">
        {/* <div className="timewheel-label">Minuto</div> */}
        <div className="timewheel" ref={minuteWheelRef}>
          {minutes.map((m) => (
            <div
              key={m.id}
              className={`timewheel-item ${minute === m.id ? 'selected' : ''}`}
              onClick={(e) => handleMinuteChange(m.value, e.currentTarget)}
            >
              {m.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  };

  // Componente para renderizar e selecionar os dias da semana
  const DaysSelectArea = ({dias, setDias, editMode}) => {
    const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    const toggleDay = (day) => {
      const safeDias = dias || [];
      if (safeDias.includes(day)) {
        setDias(safeDias.filter((d) => d !== day));
      } else {
        setDias([...safeDias, day]);
      }
    };

    return (
      <div className="DaySelectArea">
        {days.map((day, index) => {
          const safeDias = dias || [];
          const isSelected = safeDias.includes(day);
          return (
            <button
              key={index}
              onClick={() => {
                if (editMode === undefined || editMode) {
                  toggleDay(day);
                }
              }}
              style={{
                backgroundColor: isSelected
                  ? "rgb(255, 0, 0)"
                  : "rgba(255, 0, 0, 0.1)",
                boxShadow: isSelected
                  ? "0 0px 8px 1px rgba(252, 0, 0, 100.548)"
                  : "none",
                scale: isSelected ? 1.1 : 1,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    );
  };

  // Componente para renderizar o calendário
  const Calendario = ({diaEspecifico, setDiaEspecifico}) => {
    return (
      <input
        className="calendario"
        type="date"
        value={diaEspecifico ? diaEspecifico.split("T")[0] : ""}
        onChange={(e) => setDiaEspecifico(e.target.value)}
      />
    );
  }

  // #region Cards de Turma -------------------------------------------------------------

  //Card de turma padrão
  const TurmaCard = ({ turma }) => {
    const [editMode, setEditMode] = useState(false);
    const [nome, setNome] = useState(turma.nome);
    const [horario, setHorario] = useState(turma.horario);
    const [tipoData, setTipoData] = useState(turma.tipo_data);
    const [diaEspecifico, setDiaEspecifico] = useState(turma.dia_especifico);
    const [dias, setDias] = useState(turma.dias);

    // Função para formatar a data para exibir no formato brasileiro
    const DiaFormatado = new Date(turma.dia_especifico).toLocaleDateString(
      "pt-BR",
      { timeZone: "UTC" }
    );

    // #region handlers de Turma ----------------------------------------------------------

    const handleSave = async () => {
      try {
        const body = {
          nome,
          horario,
          tipoData: tipoData,
          diaEspecifico: diaEspecifico,
          dias: dias,
        };

        if (body.nome === "" ) {
          toast.error("Preencha o nome da turma");
          return;
        }

        if (body.horario === "" ) {
          toast.error("Preencha o horário da turma");
          return;
        }

        if (body.tipoData === "" ) {
          toast.error("Escolha o tipo de data");
          return;
        }
        if (body.tipoData === "Data unica" && (body.diaEspecifico === "" || body.diaEspecifico === null)) {
          toast.error("Escolha a data");
          return;
        }
        if(body.tipoData === "Constante" && (!body.dias || body.dias.length === 0)) {
          toast.error("Selecione ao menos um dia da semana");
          return;
        }
        await editTurma(turma.id, body);
        toast.success("Turma editada");

        // Refresh the turmas list
        const updatedTurmas = await getTurmas();
        setTurmas(updatedTurmas);
        setEditMode(false);
      } catch (error) {
        toast.error("Erro ao editar turma:", error);
      }
    };

    const handleCancel = () => {
      // Reset form values to original turma data
      setNome(turma.nome);
      setHorario(turma.horario);
      setTipoData(turma.tipo_data);
      setDiaEspecifico(turma.dia_especifico);
      setDias(turma.dias);
      setEditMode(false);
    };

    const DeleteTurma = async () => {
      const confirmDelete = window.confirm(
        "Você tem certeza que deseja excluir esta turma?"
      );
      if (!confirmDelete) {
        return; // Cancela a exclusão se o usuário não confirmar
      }
      try {
        await deleteTurma(turma.id);

        // Refresh the turmas list after successful deletion
        const updatedTurmas = await getTurmas();
        setTurmas(updatedTurmas);
        toast.success("Turma excluída");
      } catch (error) {
        toast.error("Erro ao deletar turma:", error);
      }
    };
    // #endregion


    // Renderização
    return (
      <div className="TurmaCard">
        <div className="CardHeader">
          <div className="CardHeaderInfo">
            <h3>Turma :</h3>
            {editMode === false ? (
                <span> {turma.nome}</span>
              ) : (
                <input
                  placeholder="Nome da turma"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                ></input>
              )}
          </div>
          
          <div className="CardActions">
            {editMode ? (
              <>
                <button onClick={handleSave} title="Salvar alterações">
                  <Check color="red" size={24} />
                </button>
                <button onClick={handleCancel} title="Cancelar edição">
                  <X color="red" size={24} />
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(true)} title="Editar turma">
                  <Pen color="red" size={24} />
                </button>
                <button onClick={() => DeleteTurma()} title="Deletar turma">
                  <Trash color="red" size={24} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="TimeArea">

          <div className="TimeField">
            <h4>Horario : </h4>
            {editMode === false ? (
              <span> {turma.horario}</span>
            ) : (
              <TimeWhell horario={horario} setHorario={setHorario} />
            )}
          </div>

          <div className="TimeField">
            <h4>Data :</h4>
            {editMode === false ? (
                tipoData === "Data unica" && (
                  <span>{DiaFormatado}</span>
                ) 
              ) : 
              (
              
                  <select
                    value={tipoData}
                    onChange={(e) => setTipoData(e.target.value)}
                  >
                    <option value="Constante">Constante</option>
                    <option value="Data unica">Data única</option>
                  </select>
                
              )
            }
          </div>
          {editMode === false ? (
            tipoData === "Constante" && (
              <DaysSelectArea dias={dias} setDias={setDias} editMode={editMode} />
            ) 
          ) : 
          ( tipoData === "Constante" ? (
              <DaysSelectArea  dias={dias} setDias={setDias} editMode={editMode} />
            ) :
            (
              <div className="TimeField">
                <Calendario diaEspecifico={diaEspecifico} setDiaEspecifico={setDiaEspecifico} />
              </div>
            
            )
          )}

        </div>
      </div>
    );
  };

  // torna visivel o card de criar turma
  const CreateNewTurmaCard = () => {
    setShowNewCard(true);
  };

  // Card para criar uma nova turma, todo baseado no turmaCard, precisam ser modificados juntos
  const NewTurmaCard = () => {
    const [nome, setNome] = useState("");
    const [horario, setHorario] = useState("");
    const [tipoData, setTipoData] = useState("Constante");
    const [diaEspecifico, setDiaEspecifico] = useState("");
    const [dias, setDias] = useState([]);
 
    // Função para adicionar uma nova turma
    const AddTurma = async () => {
      try {
        // Normaliza valores antes de enviar
        const body = {
          nome: nome?.trim() || null,
          horario: horario?.trim() || null,
          tipoData: tipoData,
          diaEspecifico:
            tipoData === "Data unica" ? diaEspecifico?.trim() || null : null,
          dias:
            tipoData === "Constante" ? (Array.isArray(dias) ? dias : []) : null,
        };
        if (body.nome === "" || body.nome === null  ) {
          toast.error("Preencha o nome da turma");
          return;
        }

        if (body.horario === "" || body.horario === null ) {
          toast.error("Preencha o horário da turma");
          return;
        }

        if (body.tipoData === "" ) {
          toast.error("Escolha o tipo de data");
          return;
        }
        if (body.tipoData === "Data unica" && (body.diaEspecifico === "" || body.diaEspecifico === null)) {
          toast.error("Escolha a data");
          return;
        }
        if(body.tipoData === "Constante" && (!body.dias || body.dias.length === 0 || body.dias === null)) {
          toast.error("Selecione ao menos um dia da semana");
          return;
        }
        const data = await addTurma(body);
        toast.success("Turma adicionada!");

        const updatedTurmas = await getTurmas();
        setTurmas(updatedTurmas);
        setShowNewCard(false);

        return data;
      } catch (error) {
        toast.error("Erro ao adicionar turma:", error);
      }
    };

    // Renderização
    return (
      <div className="TurmaCard">

        <div className="CardHeader">

          <div className="CardHeaderInfo">
            <h3>Turma :</h3>
            <input
              placeholder="Nome da turma"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            ></input>
          </div>

          <div className="CardActions">
            <button onClick={AddTurma} title="Salvar turma">
              <Check color="red" size={24} />
            </button>
            <button onClick={() => setShowNewCard(false)} title="Cancelar">
              <X color="red" size={24} />
            </button>
          </div>
        </div>

        <div className="TimeArea">

          <div className="TimeField">
            <h4>Horário : </h4>
            <TimeWhell horario={horario} setHorario={setHorario} />
          </div>

          <div className="TimeField">
            <h4>Data : </h4>
            <select
              value={tipoData}
              onChange={(e) => setTipoData(e.target.value)}
            >
              <option value="Constante">Constante</option>
              <option value="Data unica">Data única</option>
            </select>
          </div>

            {tipoData === "Data unica" ? (
              <div className="TimeField">
                  <Calendario diaEspecifico={diaEspecifico} setDiaEspecifico={setDiaEspecifico} />
              </div>
            ) : (
              <DaysSelectArea dias={dias} setDias={setDias} />
            )}

        </div>

      </div>
    );
  };
  // #endregion


  if (loading) {
    return (
      <div className="componentContent">
        <Loading
          text="Carregando Turmas"
          subtext="Buscando informações..."
        />
      </div>
    );
  }
  //Renderizando principal
  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2> Turmas </h2>
      </div>
      <div className="componentArea">
      
            {turmas.map((turma, index) => (
              <TurmaCard key={turma.id} turma={turma} />
            ))}
            {showNewCard && (
              <NewTurmaCard onCancel={() => setShowNewCard(false)} />
            )}
            <button className="TurmaCard Add" onClick={CreateNewTurmaCard} title="Adicionar nova turma">
              <p>+</p>
            </button>
        
      </div>
    </div>
  );
};

export default GenerateTurmaCards;
