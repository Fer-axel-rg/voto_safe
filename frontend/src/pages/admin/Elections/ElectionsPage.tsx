// src/pages/admin/Elections/ElectionsPage.tsx
import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useElections } from "@/hooks/useElections";
import type { Election } from "@/types/election.types";
import ElectionCard from "@/components/elections/ElectionCard";
import ElectionFilters from "@/components/elections/ElectionFilters";
import AddElectionModal from "@/components/elections/AddElectionModal";
import EditElectionModal from "@/components/elections/EditElectionModal";

export default function ElectionsPage() {
  const { 
    elections, 
    filters, 
    loading,
    error,
    addElection, 
    updateElection, 
    deleteElection, 
    updateFilters 
  } = useElections();

  const [showFilters, setShowFilters] = useState(false); // ✅ Oculto por defecto
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setElectionToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (electionToDelete) {
      try {
        await deleteElection(electionToDelete);
        setShowDeleteConfirm(false);
        setElectionToDelete(null);
      } catch (err) {
        console.error('Error al eliminar:', err);
      }
    }
  };

  const handleEdit = (election: Election) => {
    setSelectedElection(election);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (id: string, election: Election) => {
    try {
      await updateElection(id, election);
      setShowEditModal(false);
      setSelectedElection(null);
    } catch (err) {
      console.error('Error al actualizar:', err);
    }
  };

  const handleAddElection = async (election: Omit<Election, 'id' | 'createdAt'>) => {
    try {
      await addElection(election);
      setShowAddModal(false);
    } catch (err) {
      console.error('Error al agregar:', err);
    }
  };

  // Loading state
  if (loading && elections.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-gray-600">Cargando elecciones...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold mb-2">Error al cargar elecciones</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">
          Gestionar Elecciones
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <SlidersHorizontal size={20} />
          Filtros
        </button>
      </div>

      <div className="flex gap-6">
        {/* Lista de Elecciones */}
        <div className="flex-1 space-y-4">
          {elections.length === 0 ? (
            <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
              <p className="text-gray-500 text-lg mb-4">
                No hay elecciones registradas.
              </p>
              <p className="text-gray-400 text-sm">
                {filters.name || filters.type !== 'all' || filters.status !== 'all'
                  ? 'Intenta ajustar los filtros o agrega una nueva elección.'
                  : '¡Agrega una nueva elección para comenzar!'}
              </p>
            </div>
          ) : (
            elections.map((election) => (
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
            + AGREGAR ELECCIÓN
          </button>
        </div>

        {/* Panel de Filtros */}
        {showFilters && (
          <ElectionFilters 
            filters={filters} 
            onFilterChange={updateFilters} 
          />
        )}
      </div>

      {/* Modal Agregar */}
      <AddElectionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddElection}
      />

      {/* Modal Editar */}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-96 shadow-2xl">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              ¿Eliminar elección?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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