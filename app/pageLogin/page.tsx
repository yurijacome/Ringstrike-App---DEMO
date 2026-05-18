"use client"
import { API_BASE_URL } from "@/services/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateLogin, checkIfExists } from "@/utils/validators";
import Loading from "@/app/components/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import backgroundImage from "@/assets/background.png";
import Image from "next/image";
import "./page.css"

import Toastify from "@/app/components/Toastify/Toastify";
import { toast } from 'react-toastify';
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const router = useRouter();
  const { data: session, status } = useSession();


  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      handleGoogleLogin(session.user.email!, session.user.name!);
    }
  }, [session, status]);

  const handleGoogleLogin = async (email: string, nome: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/google-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome }),
      });
      const data = await response.json();

      if (response.ok) {
        const user = {
          id: data.id,
          email: data.email,
          nome: data.nome,
          isAdmin: data.isAdmin
        };

        toast.success("Login com Google efetuado com sucesso!");

        authLogin(data.token, user);

        if (data.isAdmin === true) {
          router.push("/pageAdmin");
        } else {
          router.push("/pageUser");
        }
      } else {
        toast.error("Erro ao fazer login com Google");
      }
    } catch (error) {
      toast.error("Falha ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  };

  // #region handlers ------------------------------------------------------------------
  const handleLogin = async () => {
    setLoading(true);

    const errorMessage = validateLogin(login, password);

    if (errorMessage) {
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // 🔍 Verificação no backend antes de enviar senha
    const userExists =
      (checkIfExists("email", login)) ||
      (checkIfExists("nome", login));
    if (!userExists) {
      toast.error("Usuário não encontrado");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha: password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        const user = {
          id: data.id,
          email: data.email,
          nome: data.nome,
          isAdmin: data.isAdmin
        };

        toast.success("Login efetuado com sucesso!");
        
        authLogin(data.token, user);
        
        if (data.isAdmin === true) {
          router.push("/pageAdmin");
        } else {
          router.push("/pageUser");
        }
      } else { 
        toast.error("Credenciais inválidas");
      }
    } catch (error) { 
      toast.error("Falha ao conectar ao servidor");
    } finally {
      setLoading(false);
    }
  }

  const handleRegister = () => {
    // toast.error("cadastro desativado");
    router.push('/pageRegister');
  };
  // #endregion


  // pagina de login
  return (
    <div className="loginBody" style={{backgroundImage: `url(${backgroundImage.src})`,
    }}>
        <Toastify />
      
        <Image
          className="loginLogo"
          src="/logo.png"
          alt="RingStrike logo"
          width={400}
          height={0}
          priority
      />
      {loading ? (
        <Loading
          text="Realizando Login"
          subtext="Buscando informações do usuario..."
        />
      ) : (
          
        <div className="formArea">
          <h1>Login</h1>


          <input type="text" placeholder="Email" value={login}
            onChange={(e) => setLogin(e.target.value)} className="LoginInput"
          />
          <input type="password" placeholder="Senha" value={password}
            onChange={(e) => setPassword(e.target.value)} className="LoginInput"
          />

          <button
            className="loginButton"
            onClick={handleLogin}
          >
            Login
          </button>

          

          <button
            className="googleButton"
            onClick={() => signIn("google")}
          >
            <FcGoogle size={24} style={{ marginRight: 8 }} />
            Entrar com Google
          </button>
          <button
            className="registerLink"
            onClick={handleRegister}
          >
            Registrar
          </button>
        </div>
      )
      }
        
    </div>
  )
}
