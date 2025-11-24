import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";

// Hooks y Tipos (Rutas relativas corregidas)
import { useElections } from "../../../hooks/useElections";
import type { Election } from "../../../types/election.types";

// Componentes Visuales (Los tuyos)
import ElectionCard from "../../../components/elections/ElectionCard";
// Importamos el componente y su tipo de estado por separado
import ElectionFilters, { type ElectionFiltersState } from "../../../components/elections/ElectionFilters";
import AddElectionModal from "../../../components/elections/AddElectionModal";
import EditElectionModal from "../../../components/elections/EditElectionModal";

export default function ElectionsPage() {
  // CONEXIÓN CON EL BACKEND
  // Nota: Renombramos 'createElection' a 'addElection' para que coincida con tu código original
  const { elections, loading, createElection: addElection, updateElection, deleteElection } = useElections();

  // ESTADOS VISUALES (Tu diseño)
  const [showFilters, setShowFilters] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState<string | null>(null);

  // ESTADO DE FILTROS
  const [filters, setFilters] = useState<ElectionFiltersState>({
    name: "",
    status: "all"
  });

  // --- LÓGICA CORREGIDA (Usando useMemo para evitar el error de render infinito) ---
  const filteredElections = useMemo(() => {
    let result = [...elections];

    // Filtro por nombre
    if (filters.name.trim()) {
      result = result.filter((e) =>
        e.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filtro por estado
    if (filters.status !== "all") {
      result = result.filter((e) => e.status === filters.status);
    }

    return result;
  }, [elections, filters]); // Se recalcula solo cuando cambian datos o filtros

  // Manejador de cambios en los filtros
  const handleFilterChange = (newFilters: ElectionFiltersState) => {
    setFilters(newFilters);
  };

  // --- MANEJADORES DE ACCIONES (Tu lógica original) ---
  const handleDelete = (id: string) => {
    setElectionToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (electionToDelete) {
      deleteElection(electionToDelete);
      setShowDeleteConfirm(false);
      setElectionToDelete(null);
    }
  };

  const handleEdit = (election: Election) => {
    setSelectedElection(election);
    setShowEditModal(true);
  };

  const handleSaveEdit = (id: string, election: Election) => {
    updateElection(id, election);
    setShowEditModal(false);
    setSelectedElection(null);
  };

  // Renderizado
  return (
    <div className="mx-auto max-w-7xl animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gestionar Elecciones
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 transition-colors rounded-lg ${
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
          {loading && elections.length === 0 ? (
             <div className="p-12 text-center text-gray-500">Cargando datos...</div>
          ) : filteredElections.length === 0 ? (
            <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
              <p className="text-lg text-gray-500">
                {elections.length === 0 
                  ? "No hay elecciones registradas. ¡Agrega una nueva!" 
                  : "No se encontraron elecciones con esos filtros."}
              </p>
            </div>
          ) : (
            filteredElections.map((election) => (
              <ElectionCard
                key={election.id}
                election={election}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}

          {/* Botón Agregar */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-green-500 text-white py-4 rounded-[30px] font-semibold text-lg hover:bg-green-600 transition-colors shadow-[0_4px_12px_rgba(182,187,211,0.3)]"
          >
            + AGREGAR
          </button>
        </div>

        {/* Panel de Filtros Lateral */}
        {showFilters && (
          <div className="w-full lg:w-80">
             <ElectionFilters onFilterChange={handleFilterChange} />
          </div>
        )}
      </div>

      {/* --- MODALES (Tus componentes originales) --- */}
      
      <AddElectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addElection}
      />

      <EditElectionModal
        isOpen={showEditModal}
        election={selectedElection}
        onClose={() => {
          setShowEditModal(false);
          setSelectedElection(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Modal Confirmación Eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              ¿Eliminar elección?
            </h3>
            <p className="mb-6 text-gray-600">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}