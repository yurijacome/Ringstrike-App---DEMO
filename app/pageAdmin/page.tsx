"use client"
import "./page.css"

import { useAdminContext } from "@/context/AdminContext";

import RenderCheckis from "../components/RenderCheckins/RenderCheckins.jsx";
import RenderTurmas from "../components/RenderTurmas/RenderTurmas.jsx";
import RenderAlunos from "../components/RenderAlunos/RenderAlunos.jsx";
import RenderPerfil from "../components/RenderUserProfile/RenderUserProfile.jsx";


// Componente principal que renderiza baseado no estado
function AdminContent() {
  const { activeComponent } = useAdminContext();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'turmas':
        return <RenderTurmas />;
      case 'checkins':
        return <RenderCheckis />;
      case 'alunos':
        return <RenderAlunos />;
      case 'perfil':
        return <RenderPerfil />;

      default:
        return <RenderCheckis />; 
    }
  };

  return (
    <>
        {renderComponent()}
    </>
  );
}

export default function AdminContentRender() {
  return (
        <AdminContent />
  );
}
