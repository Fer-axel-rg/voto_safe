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
    <div className="flex w-full h-screen overflow-hidden bg-gray-50">

      {/* --- OVERLAY (Fondo oscuro) --- */}
      {/* Z-40: Debajo del sidebar (Z-50) pero encima del contenido */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR (Contenedor) --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:shadow-none
      `}>
        <div className="relative flex flex-col h-full">
          {/* Botón X para cerrar (Visible solo en móvil) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute p-2 top-2 right-2 text-white/70 hover:text-white md:hidden"
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
        <header className="z-10 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
          <button
            className="p-2 -ml-2 rounded-lg md:hidden text-blue-950 hover:bg-gray-100"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={28} />
          </button>

          <div className="flex-1 font-bold text-center md:hidden text-blue-950">
            {/* Título opcional para móvil */}
            ONPE
          </div>
          <div className="flex-1 hidden md:block"></div>

          <button
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
            onClick={() => navigate('/')}
          >
            <span className="hidden text-sm font-semibold sm:block font-poppins text-blue-950">ADMIN</span>
            <UserCircle size={32} className="text-blue-950" />
          </button>
        </header>

        {/* Main - overflow-x-hidden previene el scroll horizontal no deseado */}
        <main className="flex-1 p-4 overflow-x-hidden overflow-y-auto bg-gray-50 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}