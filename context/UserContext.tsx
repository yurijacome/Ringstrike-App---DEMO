"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserComponent =  'checkins' | 'perfil'  | 'HUB';

interface UserContextType {
  activeComponent: UserComponent;
  setActiveComponent: (component: UserComponent) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeComponent, setActiveComponent] = useState<UserComponent>('HUB');



  return (
    <UserContext.Provider value={{ activeComponent, setActiveComponent }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within an UserProvider');
  }
  return context;
};
