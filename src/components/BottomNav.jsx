import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, ShieldAlert, CloudSun, Lightbulb, MessageCircle, Sun, Moon } from "lucide-react";

const links = [
  { to: "/", label: "Início", icon: LayoutDashboard },
  { to: "/rotina", label: "Rotina", icon: CalendarCheck },
  { to: "/seguranca", label: "Segurança", icon: ShieldAlert },
  { to: "/mobilidade", label: "Mobilidade", icon: CloudSun },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/assistente", label: "Assistente", icon: MessageCircle },
];

const base = "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0 text-[0.65rem] leading-none tracking-[-0.01em] transition-colors";

export default function BottomNav({ theme, toggleTheme }) {
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-50 flex items-stretch gap-0.5 border-t border-moss/10 bg-pearl-light/95 px-1.5 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-moss/95">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `${base} ${isActive ? "bg-forest font-semibold text-pearl-light dark:bg-sage dark:text-moss" : "opacity-80"}`}>
          <Icon size={21} aria-hidden="true" />
          <span className="whitespace-nowrap">{label}</span>
        </NavLink>
      ))}
      <button onClick={toggleTheme} aria-label={theme === "dark" ? "Mudar para o tema claro" : "Mudar para o tema escuro"} className={`${base} opacity-80`}>
        {theme === "dark" ? <Sun size={21} aria-hidden="true" /> : <Moon size={21} aria-hidden="true" />}
        <span>Tema</span>
      </button>
    </nav>
  );
}