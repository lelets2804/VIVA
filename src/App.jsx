import { Routes, Route } from "react-router-dom";
import useTheme from "./hooks/useTheme";
import { CenaProvider } from "./context/CenaContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Rotina from "./pages/Rotina";
import Seguranca from "./pages/Seguranca";
import Mobilidade from "./pages/Mobilidade";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <CenaProvider>
      <Routes>
        <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rotina" element={<Rotina />} />
          <Route path="/seguranca" element={<Seguranca />} />
          <Route path="/mobilidade" element={<Mobilidade />} />
        </Route>
      </Routes>
    </CenaProvider>
  );
}