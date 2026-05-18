"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AdminComponent = 'turmas' | 'checkins' | 'alunos' | 'perfil';

interface AdminContextType {
  activeComponent: AdminComponent;
  setActiveComponent: (component: AdminComponent) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState<AdminComponent>('checkins');

  // Load saved component from localStorage on mount
  useEffect(() => {
    const savedComponent = localStorage.getItem('adminActiveComponent');
    if (savedComponent && ['turmas', 'checkins', 'alunos', 'perfil'].includes(savedComponent)) {
      setActiveComponent(savedComponent as AdminComponent);
    } else {
      // Default to checkins if nothing is saved
      setActiveComponent('checkins');
    }
  }, []);

  // Save component to localStorage when it changes
  const handleSetActiveComponent = (component: AdminComponent) => {
    setActiveComponent(component);
    localStorage.setItem('adminActiveComponent', component);
  };

  return (
    <AdminContext.Provider value={{ activeComponent, setActiveComponent: handleSetActiveComponent }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};
