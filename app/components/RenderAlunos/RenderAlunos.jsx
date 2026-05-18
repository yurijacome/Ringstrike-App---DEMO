"use client";

import "./RenderAlunos.css";
import { useState, useEffect } from "react";

import { getUsers, editUser, addUser, deleteUser } from "@/services/getUsers";
import { validateRegister, validateEditUser } from "@/utils/validators";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaWhatsapp } from "react-icons/fa";
import { Pen } from "lucide-react";
import { Trash } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";

// #region Formatar Dados -------------------------------------------------------------

// Formata telefone para exibição (88)99999-9999
const formatPhone = (userphone) => {
  if (!userphone) return "";
  let cleaned = userphone.replace(/\D/g, ""); // remove tudo que não é número

  if (cleaned.length === 10) {
    // telefone fixo
    return cleaned.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  } else if (cleaned.length === 11) {
    // celular
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  return userphone; // se não tiver 10 ou 11, retorna como está
};

// Formata input para exibição
const formatPhoneInput = (value) => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  } else if (cleaned.length === 10) {
    // fixo
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  } else if (cleaned.length >= 11) {
    // celular (mostra até 11)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7,
      11
    )}`;
  } else {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }
};

// garante que telefone seja salvo só em numeros
const handlePhoneChange = (e, setTelefone) => {
  const value = e.target.value;

  const numericValue = value.replace(/\D/g, "");
  setTelefone(numericValue);
};

//formata iso do aluno em dd/mm/aaaa para exibição
const mensalidadeUserFormatada = (user) => {
  return user.mensalidade
    ? new Intl.DateTimeFormat("pt-BR", {
        timeZone: "UTC",
      }).format(new Date(user.mensalidade))
    : "";
};

// dia atual
const Hoje = new Date();

// formata dia atual em iso para comparação com user
const dataHoje = Hoje.toISOString();

// #endregion

// #region Cards ------------------------------------------------------------------

// Card Principal
const UserCard = ({ user, onUserUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [nome, setNome] = useState(user.nome || "");
  const [email, setEmail] = useState(user.email || "");
  const [telefone, setTelefone] = useState(user.phone || "");
  const [mensalidade, setMensalidade] = useState(user.mensalidade || "");
  const [plano, setPlano] = useState(user.plano || "");
  const [aulasVoucher, setAulasVoucher] = useState(user.aulasvoucher || 0);

  // #region handlers de Usuário ----------------------------------------------------------
  const handleEdit = async () => {
    try {
      const changes = {
        nome: nome,
        email: email,
        phone: telefone,
        mensalidade: mensalidade,
        plano: plano,
        aulasvoucher: aulasVoucher,
      };


      // Validate the changes
      const validationError = validateEditUser(changes);
      if (validationError) {
        toast.error(validationError);
        return; // Stop execution if validation fails
      }

      await editUser(user.id, changes);
      setEditMode(false);
      // Exibe o toast antes de atualizar os dados
      toast.success("Usuário editado com sucesso!");
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      toast.error("Erro ao editar usuário: " + error.message);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja excluir esse aluno?"
    );
    if (!confirmDelete) {
      return; // Cancela a exclusão se o usuário não confirmar
    }
    try {
      await deleteUser(user.id);
      // Exibe o toast antes de atualizar os dados
      toast.success("Aluno excluído com sucesso!");
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error) {
      console.error("Erro ao deletar aluno:", error);
    }
  };

  const handleCancel = () => {
    // Reset form values to original user data
    setNome(user.nome || "");
    setEmail(user.email || "");
    setTelefone(user.phone || "");
    setMensalidade(user.mensalidade || "");
    setPlano(user.plano || "");
    setAulasVoucher(user.aulasvoucher || 0);
    setEditMode(false);
  };
  // #endregion

  // Renderização do card
  return (
    <div className="userCard">
      {editMode ? (
        <div className="actionButtons">
          <button className="" onClick={handleEdit} title="Salvar alterações">
            <Check color="var(--mainColor3)" size={20} />
          </button>
          <button onClick={handleCancel} title="Cancelar edição">
            <X color="var(--mainColor3)" size={20} />
          </button>
        </div>
      ) : (
        <div className="actionButtons">
          <button
            className="Wpp"
            onClick={() => {
              if (user.phone) {
                const phone = user.phone.replace(/\D/g, "");
                window.open(`https://wa.me/+55${phone}`, "_blank");
              } else {
                toast.error("Número de telefone não cadastrado");
              }
            }}
            title="Enviar mensagem no WhatsApp"
          >
            <FaWhatsapp size={20} />
          </button>
          <button onClick={() => setEditMode(true)} title="Editar usuario">
            <Pen color="var(--mainColor3)" size={20}  
/>
          </button>
          <button onClick={() => handleDelete()} title="Excluir usuario">
            <Trash color="var(--mainColor3)" size={20} />
          </button>
        </div>
      )}
      <div className="cardLabel">
        <h4>Nome:</h4>
        {!editMode ? (
          <span>{user.nome}</span>
        ) : (
          <input
            placeholder="  Nome Sobrenome"
            value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoCapitalize="words"
          />
        )}
      </div>

      <div className="cardLabel">
        <h4>Email:</h4>
        {!editMode ? (
          <span>{user.email}</span>
        ) : (
          <input
            placeholder="  nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
      </div>

      <div className="cardLabel">
        <h4>Telefone:</h4>
        {!editMode ? (
          <span>{user.phone ? formatPhone(user.phone) : "Não definido"}</span>
        ) : (
          <input
            placeholder="(88) 88888-8888"
            type="text"
            value={formatPhoneInput(telefone)}
            onChange={(e) => handlePhoneChange(e, setTelefone)}
            maxLength={15}
          />
        )}
      </div>

      <div className="cardLabel">
        <h4>Plano:</h4>
        {!editMode ? (
          <span>
            {user.plano ? user.plano : "Nenhum plano ativo no momento."}
          </span>
        ) : (
          <select value={plano} onChange={(e) => setPlano(e.target.value)}>
            <option value="">Selecione um plano</option>
            <option value="Mensalidade livre">Mensalidade livre</option>
            <option value="Plano Matinal">Plano Matinal</option>
            <option value="Pacote de aulas">Pacote de aulas</option>
            <option value="Inativo">Inativo</option>
          </select>
        )}
      </div>

      <div className="cardLabel">
        <h4>Mensalidade:</h4>
        {!editMode ? (
          <span className={user.mensalidade >= dataHoje ? "green" : ""}>
            {user.mensalidade
              ? user.mensalidade < dataHoje
                ? `Vencida em ${mensalidadeUserFormatada(user)}`
                : `Válida até ${mensalidadeUserFormatada(user)}`
              : "Não definida"}
          </span>
        ) : (
          <input
            type="date"
            className="calendarInput"
            value={mensalidade}
            onChange={(e) => setMensalidade(e.target.value)}
          />
        )}
      </div>

      <div className="cardLabel">
        <h4>Aulas em Voucher:</h4>
        {!editMode ? (
          <span>{user.aulasvoucher ? user.aulasvoucher : "Nenhuma aula em voucher"}</span>
        ) : (
          <input
            type="number"
            value={aulasVoucher}
            onChange={(e) => setAulasVoucher(e.target.value)}
          />
        )}
      </div> 
    </div>


  );
};

// Renderização do card de adicionar novo aluno
const NewUserCard = ({ newCard, setNewCard, onUserUpdated }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdmin, setIsAdmin] = useState("");

  // Adicionar novo aluno
  const handleAddUser = async () => {
    try {
      // Validate the new user data
      const validationError = validateRegister(email, nome, senha);
      if (validationError) {
        toast.error(validationError);
        return; // Stop execution if validation fails
      }

      const body = {
        email,
        nome,
        senha,
        isAdmin,
      };
      const response = await addUser(body);
      if (response) {
        if (onUserUpdated) {
          onUserUpdated();
          setNewCard(false);
        }
      }
      toast.success("Usuário criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar usuário: " + error.message);
    }
  };

  // Renderização do card
  return (
    newCard && (
      <div className="userCard">
        <div className="actionButtons">
          <button onClick={handleAddUser}>
            <Check color="var(--mainColor3)" size={20} />
          </button>
          <button onClick={() => setNewCard(false)}>
            {" "}
            <X color="var(--mainColor3)" size={20} />
          </button>
        </div>
        <div className="cardLabel">
          <h4>Nome:</h4>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>
        <div className="cardLabel">
          <h4>Email:</h4>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="cardLabel">
          <h4>Senha:</h4>
          <input
            type="text"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <div className="cardLabel">
          <h4>Administrador?</h4>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={isAdmin ? "selected" : "notSelected"}
              onClick={() => setIsAdmin(true)}
            >
              Sim
            </button>
            <button
              className={!isAdmin ? "selected" : "notSelected"}
              onClick={() => setIsAdmin(false)}
            >
              Não
            </button>
          </div>
        </div>
      </div>
    )
  );
};
// #endregion

// Renderização principal de alunos
const RenderAlunos = () => {
  const [loading, setLoading] = useState(true);
  const [alunos, setAlunos] = useState([]);
  const [newCard, setNewCard] = useState(false);
  const [filter, setFilter] = useState("Az");

  // fetch alunos
  const fetchAlunos = async (currentFilter = filter) => {
    setLoading(true);
    const data = await getUsers();


    // Ensure data is an array
    const dataArray = Array.isArray(data) ? data : [];

    // Ordenar por nome A–Z
    const dataFilteredAz = [...dataArray].sort((a, b) =>
      a.nome.localeCompare(b.nome)
    );

    // Filtrar apenas quem está com mensalidade em dia
    const dataFilteredMensalidade = dataArray.filter(
      (user) => user.mensalidade < dataHoje
    );

    if (currentFilter === "Az") {
      setAlunos(dataFilteredAz);
    } else {
      setAlunos(dataFilteredMensalidade);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchAlunos(filter);
  }, [filter]);

  // Renderização do loading
  if (loading) {
    return (
      <div className="componentContent">
        <Loading text="Carregando Alunos" subtext="Buscando informações..." />
      </div>
    );
  }
  // Renderização do conteudo
  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2>Alunos</h2>
      </div>
      <div className="componentFilter">
        <h4>Filtrar por</h4>
        <button
          onClick={() => {
            setFilter("Az");
            fetchAlunos("Az");
          }}
        >
          Alfabetica
        </button>
        <button
          onClick={() => {
            setFilter("Mensalidade");
            fetchAlunos("Mensalidade");
          }}
        >
          Mensalidade Vencida
        </button>
      </div>

      <div className="componentArea">
        {alunos.map((aluno) => (
          <UserCard key={aluno.id} user={aluno} onUserUpdated={fetchAlunos} />
        ))}
        {newCard ? (
          <NewUserCard
            newCard={newCard}
            setNewCard={setNewCard}
            onUserUpdated={fetchAlunos}
          />
        ) : null}
        <button onClick={() => setNewCard(true)} className="addNewUserCard" title="Adicionar novo aluno">
          +
        </button>
      </div>
    </div>
  );
};

export default RenderAlunos;
