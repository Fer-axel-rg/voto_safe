import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { UserCircle, Menu, X } from "lucide-react";
import { ADMIN_ROUTES } from "@/router/routes";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Cerrar menú al cambiar de página
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    // h-[100dvh] ayuda en móviles para evitar saltos con la barra del navegador
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">

      {/* --- OVERLAY (Fondo oscuro) --- */}
      {/* Z-40: Debajo del sidebar (Z-50) pero encima del contenido */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Contenedor) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none
      `}>
        <div className="h-full relative flex flex-col">
          {/* Botón X para cerrar (Visible solo en móvil) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-2 right-2 p-2 text-white/70 hover:text-white md:hidden"
          >
            <X size={24} />
          </button>

          {/* Renderizamos el Sidebar */}
          <Sidebar />
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex flex-col flex-1 w-full min-w-0">
        {/* Header */}
        <header className="h-16 bg-white flex items-center justify-between px-4 border-b border-gray-200 shadow-sm z-10">
          <button
            className="md:hidden p-2 -ml-2 text-blue-950 rounded-lg hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>

          <div className="flex-1 md:hidden text-center font-bold text-blue-950">
            {/* Título opcional para móvil */}
            ONPE
          </div>
          <div className="hidden md:block flex-1"></div>

          <button
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            onClick={() => navigate(ADMIN_ROUTES.BALLOTS)}
          >
            <span className="hidden sm:block text-sm font-semibold font-poppins text-blue-950">ADMIN</span>
            <UserCircle size={32} className="text-blue-950" />
          </button>
        </header>

        {/* Main - overflow-x-hidden previene el scroll horizontal no deseado */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}