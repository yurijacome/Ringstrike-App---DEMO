'use client';
import { useTheme } from "@/context/ThemeContext";
import {Sun, Moon} from 'lucide-react'

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title="Mudar tema"
      style={{
        position: "fixed",
        bottom: 1 ,
        right: 20,
        borderRadius: 8,
        border: "none",
        background: "var(--main-color2)",
        cursor: "pointer",
        width: 25,
        height: 35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {theme === "light" ? <Moon size={80} color="red"/> : <Sun  size={80} color="red"/>}
    </button>
  );
}
