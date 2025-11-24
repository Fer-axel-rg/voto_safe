import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, Loader2, Users, Plus, XCircle } from "lucide-react";

// Componentes Visuales
import PartyCard from "../../../components/parties/PartyCard";
import AddPartyModal from "../../../components/parties/AddPartyModal";
import ImportCSVModal from "../../../components/parties/ImportCSVModal";

// Tipos
import type { Party } from "../../../types/party.types";
import type { Election } from "../../../types/election.types";

// Hooks
import { useParties } from "../../../hooks/useParties";
import { useAuth } from "../../../hooks/useAuth";

export default function PartyDetailPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  // 1. Hook de Gestión de Partidos (Conectado al Backend)
  const { parties, loading, addParty, deleteParty, addMultipleParties } = useParties(electionId);
  
  // 2. Estado para la Elección (Datos del Padre: Nombre y Categorías)
  const [election, setElection] = useState<Election | null>(null);
  const [loadingElection, setLoadingElection] = useState(true);
  
  // Estados de Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  // --- CARGAR DATOS DE LA ELECCIÓN (Nombre y Categorías) ---
  useEffect(() => {
    if (!electionId || !token) return;

    const fetchElectionDetails = async () => {
      try {
        // Llamada al endpoint que devuelve la elección completa con sus categorías
        const response = await fetch(`http://localhost:8080/api/v1/elections/${electionId}`, {
          headers: { 'Authorization': token }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Mapeo de datos (Backend -> Frontend)
          setElection({
            id: data.idEleccion,
            name: data.nombre,
            type: data.tipoEleccion,
            startDate: data.fechaInicio,
            endDate: data.fechaFin,
            status: data.estado,
            description: data.descripcion,
            // Mapeo crítico: Categorias (Necesarias para el modal de agregar candidatos)
            categories: data.categorias ? data.categorias.map((c: any) => ({
                id: c.idCategoria,
                name: c.nombre
            })) : []
          });
        } else {
          console.error("Error al cargar detalles de la elección");
        }
      } catch (error) {
        console.error("Error de red:", error);
      } finally {
        setLoadingElection(false);
      }
    };

    fetchElectionDetails();
  }, [electionId, token]);

  // --- MANEJADORES ---

  const handleEditParty = (party: Party) => {
    setEditingParty(party);
    setShowAddModal(true);
  };

  const handleSaveParty = async (partyData: Omit<Party, 'id' | 'electionId' | 'electionName' | 'createdAt'>) => {
    if (!election) return;

    // Construir objeto completo para el hook (aunque el hook solo usa parte de esto)
    // La lógica real de mapeo está dentro de `addParty` en `useParties.ts`
    
    if (editingParty) {
      console.log("Update party pendiente de implementar en backend/hook");
      // await updateParty(editingParty.id, partyData);
    } else {
      await addParty(partyData);
    }
    
    setShowAddModal(false);
    setEditingParty(null);
  };

  const handleDeleteParty = (partyId: string) => {
      if (confirm("¿Estás seguro de eliminar este partido?")) {
        deleteParty(partyId);
      }
  };

  const handleImportCSV = async (importedParties: Omit<Party, 'id' | 'createdAt'>[]) => {
    // El hook se encarga de enviarlo al endpoint /batch
    await addMultipleParties(importedParties);
    setShowImportModal(false);
  };

  // --- RENDERIZADO ---

  if (loadingElection) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] animate-fadeIn">
            <Loader2 size={48} className="text-[#0f366d] animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-500">Cargando información de la elección...</p>
        </div>
      );
  }

  if (!election) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] mx-auto max-w-7xl gap-6 bg-white rounded-[2rem] shadow-xl p-12 animate-fadeIn">
        <div className="p-4 text-red-500 bg-red-100 rounded-full">
            <XCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">No se encontró la elección</h2>
        <p className="max-w-md text-center text-gray-500">
            Es posible que la elección haya sido eliminada o el ID sea incorrecto.
        </p>
        <button 
            onClick={() => navigate("/admin/parties")} 
            className="px-6 py-3 bg-[#0f366d] text-white rounded-xl hover:bg-blue-800 transition-colors font-semibold flex items-center gap-2"
        >
            <ArrowLeft size={20} /> Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fadeIn bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 my-4">
      
      {/* Botón Volver */}
      <button 
        onClick={() => navigate("/admin/parties")}
        className="flex items-center gap-2 text-gray-500 hover:text-[#0f366d] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all mb-6 font-medium w-fit"
      >
        <ArrowLeft size={20} /> Volver a elecciones
      </button>

      {/* Header con info de la elección */}
      <div className="flex flex-col items-start justify-between gap-6 pb-6 mb-8 border-b border-gray-100 md:flex-row md:items-center">
        <div>
          <h1 className="mb-3 text-4xl font-bold text-gray-800">
            {election.name}
          </h1>
          <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full w-fit">
             <Users size={18} className="text-[#0f366d]" />
             <span className="font-medium">Gestionar Partidos</span>
             <span className="text-gray-400">|</span>
             {/* Muestra la cantidad real de categorías */}
             <span>{election.categories?.length || 0} categorías habilitadas</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowImportModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#0f366d] text-[#0f366d] rounded-xl hover:bg-blue-50 transition-colors font-semibold shadow-sm"
        >
          <Upload size={20} />
          Importar masivamente
        </button>
      </div>

      {/* Grid de Partidos */}
      <div className="grid grid-cols-1 gap-8 mb-10 md:grid-cols-2 xl:grid-cols-3">
        {parties.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fbff] to-[#eaf2fc] rounded-[2.5rem] p-16 text-center border-2 border-dashed border-[#dce9f9] min-h-[300px]">
            <div className="bg-white p-6 rounded-full text-[#0f366d] mb-6 shadow-md">
                <Users size={40} />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-800">Aún no hay partidos inscritos</h3>
            <p className="max-w-md mx-auto mb-8 text-lg text-gray-500">
              Esta elección está vacía. ¡Comienza agregando el primer partido político y sus candidatos!
            </p>
            <button
                onClick={() => {
                    setEditingParty(null);
                    setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-[#0f366d] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                <Plus size={24} /> AGREGAR PRIMER PARTIDO
            </button>
          </div>
        ) : (
          parties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              onEdit={handleEditParty}
              onDelete={handleDeleteParty}
            />
          ))
        )}
      </div>

      {/* Botón Agregar Flotante (Si hay partidos) */}
      {parties.length > 0 && (
        <div className="flex justify-center pb-4">
          <button
            onClick={() => {
              setEditingParty(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-3 bg-green-500 text-white py-4 px-12 rounded-[30px] font-bold text-lg hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <Plus size={24} /> AGREGAR NUEVO PARTIDO
          </button>
        </div>
      )}

      {/* Modales */}
      {election && (
        <>
            <AddPartyModal
                isOpen={showAddModal}
                election={election} // ¡Aquí pasamos la elección con categorías reales!
                party={editingParty}
                onClose={() => {
                setShowAddModal(false);
                setEditingParty(null);
                }}
                onSave={handleSaveParty}
            />

            <ImportCSVModal
                isOpen={showImportModal}
                election={election}
                onClose={() => setShowImportModal(false)}
                onImport={handleImportCSV}
            />
        </>
      )}
    </div>
  );
}