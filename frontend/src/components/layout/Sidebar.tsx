// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Vote, Users, Building2, BarChart2, LogOut } from "lucide-react";
import { ADMIN_ROUTES } from "@/router/routes";
import { useState } from "react";
import { createPortal } from "react-dom"; // <--- 1. IMPORTANTE: Importar esto

export default function Sidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  // ... (tu lógica de links y logout sigue igual) ...
  const links = [
    { to: ADMIN_ROUTES.DASHBOARD, label: "Página Principal", icon: Home },
    { to: ADMIN_ROUTES.VOTERS, label: "Lista de Votantes", icon: Users },
    { to: ADMIN_ROUTES.STATISTICS, label: "Estadísticas", icon: BarChart2 },
    { to: ADMIN_ROUTES.ELECTIONS, label: "Gestionar Elecciones", icon: Vote },
    { to: ADMIN_ROUTES.PARTIES, label: "Gestionar Partidos", icon: Building2 },
  ];

  const handleLogout = () => {
    navigate('/');
    setShowLogoutModal(false);
  };

  return (
    <>
      <div className="h-full w-full bg-blue-950 flex flex-col">
        {/* ... (Tu código del avatar y navegación sigue IGUAL) ... */}
        {/* Avatar/Perfil */}
        <div className="flex items-center justify-center py-6 border-b border-blue-800">
          <div className="w-16 h-16 rounded-full bg-white overflow-hidden border-2 border-blue-300">
            <img
              src="https://c0.klipartz.com/pngpicture/122/453/gratis-png-iconos-de-computadora-perfil-de-usuario-avatar-femenino-perfil-thumbnail.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-6 py-4 transition-all text-white/90 hover:bg-blue-800 hover:text-white
                  ${isActive ? "bg-blue-900 border-l-4 border-white font-medium" : ""}`
                }
              >
                <Icon size={22} className="flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-900">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-4 px-4 py-3 text-white/80 hover:bg-red-600/90 hover:text-white transition-all rounded-xl"
          >
            <LogOut size={22} className="flex-shrink-0" />
            <span className="text-sm font-medium">Salir</span>
          </button>
        </div>
      </div>

      {/* --- CORRECCIÓN AQUÍ --- */}
      {/* Usamos createPortal para sacar el modal del Sidebar y ponerlo en el body */}
      {showLogoutModal && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold mb-2 text-gray-800">¿Cerrar sesión?</h3>
            <p className="text-gray-500 mb-6 text-sm">Estás a punto de salir del panel de administración.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-blue-950 text-white font-medium rounded-xl hover:bg-blue-900 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>,
        document.body // <--- El segundo argumento: enviarlo al body del HTML
      )}
    </>
  );
}