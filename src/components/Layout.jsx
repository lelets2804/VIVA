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
    <div className="relative flex min-h-screen text-moss transition-colors dark:text-pearl-light">
      <a href="#conteudo" className="sr-only z-100 rounded-xl bg-ambar px-4 py-3 font-semibold text-moss focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Pular para o conteúdo</a>
      <div aria-hidden="true" className="fixed inset-0 z-0 bg-pearl dark:bg-moss">{webgl && <ErrorBoundary fallback={null}><Suspense fallback={null}><FundoCidade /></Suspense></ErrorBoundary>}</div>
      {/* Nas telas internas a cidade fica ao fundo, bem suave, para o conteúdo ser lido com conforto. */}
      <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-1 bg-pearl-light/88 backdrop-blur-md transition-opacity duration-700 dark:bg-moss/82 ${home ? "opacity-0" : "opacity-100"}`} />
      <div className="relative z-10 shrink-0"><Sidebar theme={theme} toggleTheme={toggleTheme} /></div>
      <main id="conteudo" tabIndex={-1} className={`relative z-10 min-w-0 flex-1 px-5 pt-8 pb-28 outline-none md:px-10 md:pt-12 md:pb-12 lg:px-14 ${home ? "pointer-events-none" : ""}`}><Outlet /></main>
      <BottomNav theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}