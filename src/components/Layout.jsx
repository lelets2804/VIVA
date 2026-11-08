import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function Layout({ theme, toggleTheme }) {
  return (
    <div className="flex min-h-screen bg-pearl text-moss transition-colors dark:bg-moss dark:text-pearl">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8">
        <Outlet />
      </main>
      <BottomNav theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}