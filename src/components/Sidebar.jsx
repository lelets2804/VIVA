import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {LayoutDashboard, CalendarCheck, ShieldAlert, CloudSun, ChevronLeft, ChevronRight, Sun, Moon,} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/rotina", label: "Rotina", icon: CalendarCheck },
  { to: "/seguranca", label: "Segurança", icon: ShieldAlert },
  { to: "/mobilidade", label: "Mobilidade", icon: CloudSun },
];

export default function Sidebar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 240 : 80 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="sticky top-0 hidden md:flex h-screen shrink-0 flex-col gap-2 overflow-hidden border-r border-silver/40 bg-pearl-light p-4 dark:bg-forest/60">
      <div className="mb-6 flex items-center justify-between">
        {open && (
          <span className="text-2xl font-bold text-silver-metal">VIVVA</span> )}
        <button onClick={() => setOpen(!open)} aria-label={open ? "Recolher menu" : "Expandir menu"} aria-expanded={open} className="rounded-lg p-2 hover:bg-sage/30">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} aria-label={label} className={({ isActive }) =>`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${ isActive ? "bg-sage/40 font-semibold" : "hover:bg-sage/20" }` }>
            <Icon size={22} className="shrink-0" />
            {open && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button onClick={toggleTheme} aria-label="Alternar tema claro e escuro" className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-sage/20" >
        {theme === "dark" ? (
          <Sun size={22} className="shrink-0" /> ) : (
          <Moon size={22} className="shrink-0" /> )}
        {open && <span>{theme === "dark" ? "Tema claro" : "Tema escuro"}</span>}
      </button>
    </motion.aside>
  );
}