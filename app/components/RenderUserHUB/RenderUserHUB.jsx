"use client";

import "./userHUB.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

import { getUser} from "@/services/getUsers";

import Loading from "../Loading/Loading";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Pen } from "lucide-react";
import { X } from "lucide-react";
import { Check } from "lucide-react";


const RenderUserHUB = () => {
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({});
  const [mensalidade, setMensalidade] = useState( userData.mensalidade || "");
  const [nome, setNome] = useState(userData.nome || "");
  const [avisos, setAvisos] = useState(userData.avisos || []);


  const { user } = useAuth();
  const fetchUserData = async () => {
    setLoading(true);

    try {
      const userData = await getUser(user.id);
      setNome(userData.nome);
      setMensalidade(userData.mensalidade);
      setUserData(userData);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }

    setLoading(false);
  };
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);
  // Renderização do loading
  if (loading) {
    return (
      <div className="componentContent">
        <Loading text="Carregando HUB" subtext="Buscando informações..." />
      </div>
    );
  }


  const mensalidadeUserFormatada = (mensalidade) => {
    //formata a iso date para dd/mm/yyyy
    const date = new Date(mensalidade);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //dia atual
  const Hoje = new Date();


  return (
    <div className="componentContent">
      <div className="componentHeader">
        <h2>Home</h2>
      </div>


        <div className="componentArea">

          <div className="HUB">

          <div className="AvisosArea">
            <span>Avisos</span>
            <h4>
              {avisos.length > 0
                ? avisos.map((aviso, index) => (
                    <div key={index} className="avisoItem">
                      {aviso}
                    </div>
                  ))
                : "Sistema de avisos indisponível no momento."}
            </h4>
            
          </div>
        
          <div className="PlanoAtivoArea">
            <span>Status do seu plano</span>
              {mensalidade ? (() => {
                return mensalidadeUserFormatada(mensalidade) > mensalidadeUserFormatada(Hoje) ? (
                  <div className="plano Ativo">
                    <h4>Plano Ativo : <span>{userData.plano? userData.plano : "Nenhum plano ativo no momento."}</span></h4>
                    <h4>Vencimento: <span style={{ color: "green" }}>{mensalidadeUserFormatada(mensalidade)}</span></h4>
                  </div>
                ) : (
                  <div className="plano Vencido">
                    <span>Plano Vencido</span>
                    <span>Vencimento: {mensalidadeUserFormatada(mensalidade)}</span>
                  </div>
                );
              })() : "Nenhum plano ativo no momento."}
            
          </div>

          <div className="plansArea">
              <h2>Nossos Planos:</h2>
              <div className="planCards">
                <div className="planCard">
                  <h3>Mensalidade Livre </h3>
                  <span>Segunda a sexta - 18:00hrs & 19:00hrs</span>
                  <span>Segunda, quarta e sexta - 06:30hrs</span>
                  <h3>R$175,00</h3>
                  <button onClick={() => toast.error("Funcionalidade de renovação em breve!")}>Assinar Plano</button>
                </div>
                
                <div className="planCard">
                  <h3>Plano Manhã </h3>
                  <span>Segunda, quarta e sexta</span>
                  <span>Apenas horario da manhã - 06:30hrs</span>
                  <h3>R$110,00</h3>
                  <button onClick={() => toast.error("Funcionalidade de renovação em breve!")}>Assinar Plano</button>
                </div>

                <div className="planCard">
                  <h3>Pacote 5 aulas </h3>
                  <span>Qualquer horario de treino disponivel</span>
                  <span>Validade de 30 dias</span>
                  <h3>R$90,00</h3>
                  <button onClick={() => toast.error("Funcionalidade de renovação em breve!")}>Assinar Plano</button>
                </div>

                <div className="planCard">
                  <h3>Pacote 10 aulas </h3>
                  <span>Qualquer horario de treino disponivel</span>
                  <span>Validade de 60 dias</span>
                  <h3>R$160,00</h3>
                  <button onClick={() => toast.error("Funcionalidade de renovação em breve!")}>Assinar Plano</button>
                </div>

                <div className="planCard">
                  <h3>Pacote 15 aulas </h3>
                  <span>Qualquer horario de treino disponivel</span>
                  <span>Validade de 90 dias</span>
                  <h3>R$225,00</h3>
                  <button onClick={() => toast.error("Funcionalidade de renovação em breve!")}>Assinar Plano</button>
                </div>
              </div>
              </div>

  
        </div>

      </div>



    </div>
  );
};

export default RenderUserHUB;
