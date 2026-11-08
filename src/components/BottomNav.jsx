import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, ShieldAlert, CloudSun, Sun, Moon } from "lucide-react";

const links = [
  { to: "/", label: "Início", icon: LayoutDashboard },
  { to: "/rotina", label: "Rotina", icon: CalendarCheck },
  { to: "/seguranca", label: "Segurança", icon: ShieldAlert },
  { to: "/mobilidade", label: "Mobilidade", icon: CloudSun },
];

export default function BottomNav({ theme, toggleTheme }) {
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-silver/40 bg-pearl-light/90 p-2 backdrop-blur md:hidden dark:bg-forest/90">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs ${isActive ? "bg-sage/40 font-semibold" : ""}`}>
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
      <button onClick={toggleTheme} aria-label="Alternar tema claro e escuro" className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs">
        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        <span>Tema</span>
      </button>
    </nav>
  );
}