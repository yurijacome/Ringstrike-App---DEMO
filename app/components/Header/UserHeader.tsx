"use client";

import Logo from "@/assets/logo.png";
import "./header.css";
import { useUserContext } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getUser} from "@/services/getUsers";
import { signOut } from "next-auth/react";

const UserHeader = () => {
  const { setActiveComponent } = useUserContext();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  type UserData = {
    nome?: string;
    // add other properties as needed
  };
  
  const [userData, setUserData] = useState<UserData>({});

    const fetchUserData = async () => {
      if (!user) {
        return;
      }
      try {
        const userData = await getUser(user.id);
        setUserData(userData);
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };
    useEffect(() => {
      fetchUserData();
    }, [user]);

  const handleNavigation = (component: string) => {
    setActiveComponent(component as any);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Deseja deslogar?");
    if (!confirmLogout) {
      return;
    }
    // Logout from AuthContext (clears localStorage)
    logout(false);
    // Sign out from NextAuth
    await signOut({ callbackUrl: '/pageLogin' });
  };

  return (
    <header>
      <img src={Logo.src} alt="Logo" className="logo" />
      <div className="welcome">
      <h4>Bem-vindo, </h4>
      <span className="user">{userData?.nome}</span>
      </div>

      <nav>
        <button
          onClick={() => handleNavigation("HUB")}
          className="NavButton"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigation("checkins")}
          className="NavButton"
        >
          Checkins
        </button>
        <button
          onClick={() => handleNavigation("perfil")}
          className="NavButton"
        >
          Perfil
        </button>
      </nav>

        <button
          className="userButton"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menu do usuário"
        >
          <FaUserCircle />
        </button>
      {sidebarOpen && (
        <div
          className="sidebarOverlay"
          onClick={() => setSidebarOpen(false)}
        >
          <aside className="sidebar" onClick={(e) => e.stopPropagation()}>
            <span className="sidebarSpan">{user?.nome}</span>


            <button
              className="sidebarButton"
              onClick={() => handleNavigation("HUB")}
            >
              HUB
            </button>

            <button
              className="sidebarButton"
              onClick={() => handleNavigation("checkins")}
            >
              Checkins
            </button>

            <button
              className="sidebarButton"
              onClick={() => handleNavigation("perfil")}
            >
              Perfil
            </button>




            <button className="sidebarButton" onClick={handleLogout}>
              Deslogar
            </button>

            <button
              className="sidebarButton Close"
              onClick={() => setSidebarOpen(false)}
            >
              Fechar
            </button>
          </aside>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
