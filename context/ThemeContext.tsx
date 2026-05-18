'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const lightTheme = {
  "--background": "#f5f5f5",
  "--mainColor1": "rgb(255, 255, 255)", // cor clara principal
  "--mainColor2": "rgb(0, 0, 0)",  // cor escura para textos
  "--mainColor3": "rgb(255, 0, 0)",
  "--mainColor4": "rgb(27, 27, 27)",
  "--mainShadow": "0 1px 10px rgb(0, 0, 0)"
};

const darkTheme = {
  "--background": "#111111",
  "--mainColor1": "rgb(5, 5, 5)", // cor escura principal
  "--mainColor2": "rgb(255, 255, 255)", // cor clara para textos
  "--mainColor3": "rgb(255, 0, 0)",
  "--mainColor4": "rgb(27, 27, 27)",
  "--mainShadow": "0 1px 10px rgb(0, 0, 0)"

};

function setCSSVariables(themeVars: Record<string, string>) {
  Object.entries(themeVars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (theme === "light") {
      setCSSVariables(lightTheme);
    } else {
      setCSSVariables(darkTheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
