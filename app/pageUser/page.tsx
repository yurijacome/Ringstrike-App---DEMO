"use client"

import "./page.css"

import { useUserContext } from "@/context/UserContext";


import CheckinsUser from "../components/RenderUserCheckins/RenderCheckinsUser";
import RenderPerfil from "../components/RenderUserProfile/RenderUserProfile.jsx";
import RenderUserHUB from "../components/RenderUserHUB/RenderUserHUB.jsx";


// Componente principal que renderiza baseado no estado
function UserContent() {
  const { activeComponent } = useUserContext();

  const renderComponent = () => {
    switch (activeComponent) {
      case 'checkins':
        return <CheckinsUser />;
      case 'perfil':
        return <RenderPerfil />; 
      case 'HUB':
        return <RenderUserHUB/>;
      default:
        return <RenderUserHUB/>; // Default to checkins instead of dashboard
    }
  };

  return (
    <>
        {renderComponent()}
    </>
  );
}

export default function UserContentRender() {
  return (
        <UserContent />
  );
}