import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("vivva-theme") || localStorage.getItem("viva-theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("vivva-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}