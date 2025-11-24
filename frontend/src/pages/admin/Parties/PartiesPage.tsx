import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useActiveElections } from "@/hooks/useActiveElections";
import ElectionCardForParties from "../../../components/parties/ElectionCardForParties";
import ElectionFiltersForParties from "../../../components/parties/ElectionFiltersForParties";
import type { Election } from "@/types/election.types";

export default function PartiesPage() {
  const navigate = useNavigate();
  
  // 1. Datos del Hook
  const { elections, loading } = useActiveElections();
  
  // 2. Estado local para filtrado
  const [showFilters, setShowFilters] = useState(false);
  const [filteredElections, setFilteredElections] = useState<Election[]>([]);

  // 3. EFECTO DE SINCRONIZACIÓN (¡ESTO FALTABA!)
  // Cuando 'elections' cambie (lleguen datos del backend), actualizamos la lista local
  useEffect(() => {
    setFilteredElections(elections);
  }, [elections]);

  // Aplicar filtros
  const handleFilter = (filters: { name: string; type: string; status: string }) => {
    let filtered = [...elections];

    // Filtro por nombre
    if (filters.name.trim()) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filters.type !== "all") {
      filtered = filtered.filter((e) => e.type === filters.type);
    }

    // Filtro por estado
    if (filters.status !== "all") {
      filtered = filtered.filter((e) => e.status === filters.status);
    }

    setFilteredElections(filtered);
  };

  // Navegar a la vista de partidos de la elección
  // Esta ruta debe existir en tu AppRouter (ej: /admin/parties/:id)
  const handleElectionClick = (electionId: string) => {
    navigate(`/admin/parties/${electionId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-900 rounded-full border-t-transparent animate-spin"></div>
            <p className="text-lg text-gray-500">Cargando elecciones disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-semibold text-gray-800">
          Gestionar Partidos
        </h1>
        <p className="text-sm text-gray-600">
          Selecciona una elección para administrar sus partidos políticos y candidatos.
        </p>
      </div>

      {/* Botón Filtros */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <SlidersHorizontal size={20} />
          Filtros
        </button>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Lista de Elecciones */}
        <div className="flex-1 space-y-4">
          {filteredElections.length === 0 ? (
            <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
              <p className="text-lg text-gray-500">
                No se encontraron elecciones con esos criterios.
              </p>
              {elections.length === 0 && (
                 <p className="mt-2 text-sm text-gray-400">
                   Asegúrate de crear elecciones activas en el módulo "Gestionar Elecciones".
                 </p>
              )}
            </div>
          ) : (
            filteredElections.map((election) => (
              <ElectionCardForParties
                key={election.id}
                election={election}
                onClick={() => handleElectionClick(election.id)}
              />
            ))
          )}
        </div>

        {/* Panel de Filtros (Responsive) */}
        {showFilters && (
          <div className="w-full lg:w-80 animate-slideInRight">
             <ElectionFiltersForParties onFilterChange={handleFilter} />
          </div>
        )}
      </div>
    </div>
  );
};