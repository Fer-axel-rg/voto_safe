// src/pages/admin/Parties/PartyDetailPage.tsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import type { Election } from "@/types/election.types";

export default function PartyDetailPage() {
  const { electionId } = useParams<{ electionId: string }>();
  const navigate = useNavigate();
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadElection();
  }, [electionId]);

  const loadElection = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('votosafe_token');
      
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const response = await fetch(`http://localhost:8080/api/v1/elections/${electionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar elección');
      }

      const data = await response.json();
      
      // Mapear del backend al frontend
      const mappedElection: Election = {
        id: data.id_eleccion,
        name: data.nombre,
        type: data.tipo_eleccion,
        startDate: data.fecha_inicio,
        endDate: data.fecha_fin,
        status: data.estado,
        allowNullVote: data.allow_null_vote ?? true,
        requireMinimumCategory: data.require_minimum_category ?? false,
        allowMultipleVotes: data.allow_multiple_votes ?? false,
        autoSendVote: data.auto_send_vote ?? false,
        categories: (data.categorias || []).map((cat: any) => ({
          id: cat.id_categorias,
          name: cat.nombre,
          description: cat.descripcion
        })),
        createdAt: data.created_at || new Date().toISOString()
      };

      setElection(mappedElection);
    } catch (error) {
      console.error('Error cargando elección:', error);
      alert('Error al cargar la elección');
      navigate('/admin/parties');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">Cargando elección...</p>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">Elección no encontrada</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/parties')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2 uppercase">
              {election.name}
            </h1>
            <p className="text-gray-600 text-sm">
              Gestionar Partidos - {election.categories.length} categorías
            </p>
          </div>
        </div>
        
        <button
          className="flex items-center gap-2 px-6 py-3 bg-[#0f366d] text-white rounded-lg hover:bg-blue-800 transition-colors"
          onClick={() => alert('Importar CSV - Por implementar')}
        >
          <Upload size={20} />
          Importar CSV
        </button>
      </div>

      {/* Contenido Temporal - Por implementar */}
      <div className="bg-[#eaf2fc] rounded-[30px] p-12 shadow-[0_4px_12px_rgba(182,187,211,0.3)] text-center">
        <p className="text-gray-500 text-lg mb-4">
          🚧 Gestión de partidos en desarrollo
        </p>
        <p className="text-gray-400 text-sm">
          Aquí podrás agregar y gestionar partidos para esta elección
        </p>
        
        {/* Info de la elección */}
        <div className="mt-8 bg-white rounded-xl p-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-4">Información de la Elección:</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Tipo:</span> {election.type}</p>
            <p><span className="font-medium">Estado:</span> {election.status}</p>
            <p><span className="font-medium">Período:</span> {election.startDate} - {election.endDate}</p>
            <div>
              <p className="font-medium mb-2">Categorías:</p>
              <ul className="list-disc list-inside pl-4">
                {election.categories.map(cat => (
                  <li key={cat.id}>{cat.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Agregar Partido */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => alert('Agregar partido - Por implementar')}
          className="bg-green-500 text-white py-4 px-12 rounded-[30px] font-semibold text-lg hover:bg-green-600 transition-colors shadow-[0_4px_12px_rgba(182,187,211,0.3)]"
        >
          + AGREGAR PARTIDO
        </button>
      </div>
    </div>
  );
}