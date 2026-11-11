import { lazy, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";
import ErrorBoundary from "./ErrorBoundary";

const FundoCidade = lazy(() => import("./FundoCidade"));
const temWebGL = () => { try { const c = document.createElement("canvas"); return Boolean(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } };
const webgl = temWebGL();

export default function Layout({ theme, toggleTheme }) {
  const { pathname } = useLocation();
  const home = pathname === "/";
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="relative flex min-h-screen text-moss transition-colors dark:text-pearl">
      <div aria-hidden="true" className="fixed inset-0 z-0 bg-pearl dark:bg-moss">{webgl && <ErrorBoundary fallback={null}><Suspense fallback={null}><FundoCidade /></Suspense></ErrorBoundary>}</div>
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-1 bg-pearl/80 backdrop-blur-[2px] transition-opacity duration-700 dark:bg-moss/60 ${home ? "opacity-0" : "opacity-100"}`} />
      <div className="relative z-10 shrink-0"><Sidebar theme={theme} toggleTheme={toggleTheme} /></div>
      <main className={`relative z-10 min-w-0 flex-1 p-4 pb-24 md:p-8 md:pb-8 ${home ? "pointer-events-none" : ""}`}><Outlet /></main>
      <BottomNav theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}