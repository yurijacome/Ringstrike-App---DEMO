"use client";

import "./userProfile.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import { getUser, editUser, changePassword } from "@/services/getUsers";
import { validateEditUser } from "@/utils/validators";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Pen } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";


const RenderPerfil = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [userData, setUserData] = useState({});
  const [email, setEmail] = useState( userData.email || "");
  const [nome, setNome] = useState( userData.nome || "");
  const [telefone, setTelefone] = useState( userData.phone || "");
  const [mensalidade, setMensalidade] = useState( userData.mensalidade || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const { user } = useAuth();
  const fetchUserData = async () => {
    setLoading(true);

    try {
      const userData = await getUser(user.id);
      setEmail(userData.email);
      setNome(userData.nome);
      setTelefone(userData.phone);
      setMensalidade(userData.mensalidade);
      setUserData(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }

    setLoading(false);
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  // Renderização do loading
  if (loading) {
    return (
      <div className="componentContent">
        <Loading text="Carregando Perfil" subtext="Buscando informações..." />
      </div>
    );
  }

  const handleEdit = async () => {
    try {
      const changes = {
        nome: nome,
        email: email,
        phone: telefone,
      };

      // Validate the changes
      const validationError = validateEditUser(changes);
      if (validationError) {
        toast.error(validationError);
        return; // Stop execution if validation fails
      }

      // Se o usuário optou por alterar a senha
      if (editPassword) {
        if (!senhaAtual || !senhaNova || !confirmarSenha) {
          toast.error("Por favor, preencha todos os campos de senha.");
          return;
        }
        if (senhaNova !== confirmarSenha) {
          toast.error("A nova senha e a confirmação não coincidem.");
          return;
        }
        try {
          await changePassword(user.id, senhaAtual, senhaNova);
        } catch (error) {
          console.error("Erro ao alterar senha:", error);
          toast.error("Erro ao alterar senha: " + error.message);
          return; // Não prossegue se erro na senha
        }
      }

      await editUser(user.id, changes);
      setEditMode(false);
      setEditPassword(false);
      setSenhaAtual("");
      setSenhaNova("");
      setConfirmarSenha("");
      


      // Só mostra o alerta se tudo ocorreu sem erros
      toast.success("Usuário editado com sucesso!");
      fetchUserData();

    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      toast.error("Erro ao editar usuário: " + error.message);
    }
  };

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
  const mensalidadeUserFormatada = (mensalidade) => {
    //formata a iso date para dd/mm/yyyy
    const date = new Date(mensalidade);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2>Perfil</h2>
      </div>

      <div className="profileContainer">
        <div className="editButtons">
          {!editMode ? (
            <>
              <button onClick={() => setEditMode(!editMode) } title="Editar" >
                <Pen size={30} color="red" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit()} title="Salvar" >
                <Check size={30} color="red"/>
              </button>
              <button onClick={() => {setEditMode(false); setEditPassword(false)} } title="Cancelar">
                <X size={30} color="red"/>
              </button>
            </>
          )}
        </div>

        <div className="profileField">
          <h4>Email :</h4>
          {editMode ? (
            <input
              type="email"
              value={email}
              placeholder={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          ) : (
            <span>{userData.email}</span>
          )}
        </div>

        <div className="profileField">
          <h4>Nome :</h4>
          {editMode ? (
            <input
              type="text"
              value={nome}
              placeholder={nome}
              autoCapitalize="words"
              onChange={(e) => setNome(e.target.value)}
            />
          ) : (
            <span>{userData.nome}</span>
          )}
        </div>

        <div className="profileField">
          <h4>Fone :</h4>
          {editMode ? (
            <input
              placeholder="(88) 88888-8888"
              type="tel"
              value={formatPhoneInput(telefone)}
              onChange={(e) => handlePhoneChange(e, setTelefone)}
              maxLength={15}
            />
          ) : (
            <span>{userData.phone ? formatPhone(userData.phone) : "Não cadastrado"}</span>
          )}
        </div >
        <div className="profileField">
          <h4>Plano :</h4>
          <span>{userData.plano ?  userData.plano : "Nenhum plano cadastrado"}</span>

        </div>
          {editMode && (
                    <div className="profileField">
                      <button
                      className={`passwordButton ${editPassword ? 'selected' : ''}`}
                      onClick={() => setEditPassword(!editPassword) }>Alterar Senha</button>
                      </div>

          )}
         { editPassword && (
              <>
                              <div className="profileField">
                <h4>Senha atual:</h4>
                <input
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                />
                </div>
                <div className="profileField">
                <h4>Nova senha:</h4>
                <input
                  type="password"
                  value={senhaNova}
                  onChange={(e) => setSenhaNova(e.target.value)}
                />
                </div>
                <div className="profileField">
                <h4>Confirmar senha:</h4>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
                </div>
              </>
              )}

        <div className="profileField">
          {!editMode && (
            <>
              <h4>Mensalidade :</h4>
              <span>
                {userData.mensalidade
                  ? `${mensalidadeUserFormatada(userData.mensalidade)}`
                  : "Não cadastrado"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenderPerfil;
