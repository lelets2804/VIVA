import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Marca from "./Marca";
import { LayoutDashboard, CalendarCheck, ShieldAlert, CloudSun, Lightbulb, MessageCircle, PanelLeftClose, PanelLeftOpen, Sun, Moon } from "lucide-react";

const links = [
  { to: "/", label: "Início", icon: LayoutDashboard },
  { to: "/rotina", label: "Rotina", icon: CalendarCheck },
  { to: "/seguranca", label: "Segurança", icon: ShieldAlert },
  { to: "/mobilidade", label: "Mobilidade", icon: CloudSun },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/assistente", label: "Assistente", icon: MessageCircle },
];

const item = ({ isActive }) =>
  `group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
    isActive ? "bg-forest font-semibold text-pearl-light dark:bg-sage dark:text-moss" : "hover:bg-sage/20"
  }`;

export default function Sidebar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 248 : 84 }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="sticky top-0 hidden h-screen shrink-0 flex-col gap-2 overflow-hidden border-r border-moss/10 bg-pearl-light/90 p-4 backdrop-blur-xl md:flex dark:border-white/10 dark:bg-moss/80"
    >
      <div className={`mb-8 flex items-center ${open ? "justify-between" : "justify-center"}`}>
        {open && <Marca />}
        <button onClick={() => setOpen(!open)} aria-label={open ? "Recolher menu" : "Expandir menu"} aria-expanded={open} className="btn-icone">
          {open ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} title={open ? undefined : label} className={item}>
            <Icon size={21} className="shrink-0" />
            {open ? <span>{label}</span> : <span className="sr-only">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button onClick={toggleTheme} aria-label={theme === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro"} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-sage/20">
        {theme === "dark" ? <Sun size={21} className="shrink-0" /> : <Moon size={21} className="shrink-0" />}
        {open && <span>{theme === "dark" ? "Tema claro" : "Tema escuro"}</span>}
      </button>
    </motion.aside>
  );
}