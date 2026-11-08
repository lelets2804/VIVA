import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ theme, toggleTheme }) {
  return (
    <div className="flex min-h-screen bg-pearl text-moss transition-colors dark:bg-moss dark:text-pearl">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}