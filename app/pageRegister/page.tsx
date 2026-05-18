"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateRegister} from "@/utils/validators";
import { addUser} from "@/services/getUsers";

import Image from "next/image";
import backgroundImage from "@/assets/background.png";
import "./page.css"
import { toast } from 'react-toastify';
import Toastify from "@/app/components/Toastify/Toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleVoltar = () => {
      router.push('/pageLogin');
    }

const handleRegister = async () => {
  try {
    const validationError = validateRegister(email, nome, senha, confirmPassword);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const body = {
      email,
      nome,
      senha,
    };

    const response = await addUser(body);
    console.log(response);

    if (!response) {
      toast.error("Erro ao adicionar usuário");
      return;
    }
    

    toast.success("Usuário criado com sucesso!");

    setTimeout(() => {
      router.push("/pageLogin");
    }, 1500);

  } catch (error: any) {
    const message =
      error.message ||
      "Erro ao adicionar usuário";
      console.log(message);

    toast.error(message);
  }
};


    return (
        <div className="registerBody" style={{ backgroundImage: `url(${backgroundImage.src})` }}>
          <Toastify />
        <Image
          className="logo"
          src="/logo.png"
          alt="RingStrike logo"
          width={400}
          height={0}
          priority
            />
        <h1>Registrar</h1>

            <input type="text" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <input type="text" placeholder="Nome e Sobrenome" 
                value={nome} onChange={(e) => setNome(e.target.value)}
            />
            <input type="password" placeholder="Password"
                value={senha} onChange={(e) => setSenha(e.target.value)}
            />
            <input type="password" placeholder="Confirm Password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
                className="register"
                onClick={handleRegister}
                >Registrar
            </button>
            <button
                className="login"
                onClick={handleVoltar}
                >Voltar
            </button>



        </div>
    ) 
}