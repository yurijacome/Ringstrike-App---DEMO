"use client";

import Logo from "@/assets/logo.png";
import "./header.css";
import { useAdminContext } from "@/context/AdminContext";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { signOut } from "next-auth/react";



const AdminHeader = () => {
  const { setActiveComponent } = useAdminContext();

  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

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
      <span className="user">{user?.nome}</span>
      </div>

      <nav>
        <button
          onClick={() => handleNavigation("turmas")}
          className="NavButton"
        >
          Turmas
        </button>
        <button
          onClick={() => handleNavigation("checkins")}
          className="NavButton"
        >
          Checkins
        </button>
        <button
          onClick={() => handleNavigation("alunos")}
          className="NavButton"
        >
          Alunos
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
              onClick={() => handleNavigation("perfil")}
            >
              Perfil
            </button>

                  <button
              className="sidebarButton"
              onClick={() => handleNavigation("turmas")}
            >
              Turmas
            </button>

            <button
              className="sidebarButton"
              onClick={() => handleNavigation("checkins")}
            >
              Checkins
            </button>

                              <button
              className="sidebarButton"
              onClick={() => handleNavigation("alunos")}
            >
              Alunos
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

export default AdminHeader;
