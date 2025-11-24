import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { Election } from '../types/election.types';

const API_URL = 'http://localhost:8080/api/v1/elections';

export const useElections = () => {
  const { token } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. LEER (GET) ---
  const fetchElections = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': token }
      });
      
      if (!response.ok) throw new Error('Error cargando elecciones');
      
      const dataRaw = await response.json();

      // TRADUCCIÓN: Backend -> Frontend
      const dataMapped: Election[] = dataRaw.map((item: any) => ({
        id: item.idEleccion,
        name: item.nombre,
        type: item.tipoEleccion,
        description: item.descripcion,
        startDate: item.fechaInicio,
        endDate: item.fechaFin,
        status: item.estado,
        
        // MAPEO DE CATEGORÍAS (Java: categorias -> React: categories)
        categories: item.categorias ? item.categorias.map((cat: any) => ({
            id: cat.idCategoria,
            name: cat.nombre
        })) : [],
        
        allowNullVote: false,
        autoSendVote: false
      }));

      setElections(dataMapped);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // --- 2. CREAR (POST) ---
  const createElection = async (newElection: Partial<Election>) => {
    setLoading(true);
    try {
      // TRADUCCIÓN: Frontend -> Backend
      const payload = {
        nombre: newElection.name,
        tipoEleccion: newElection.type,
        descripcion: "Creada desde el panel",
        fechaInicio: newElection.startDate,
        fechaFin: newElection.endDate,
        estado: newElection.status || 'upcoming',
        
        // MAPEO DE CATEGORÍAS (React: categories -> Java: categorias)
        categorias: newElection.categories?.map(cat => ({
            idCategoria: cat.id.length < 10 ? null : cat.id, // Si es ID temporal corto, enviamos null para que Java genere UUID
            nombre: cat.name,
            descripcion: "Categoría general"
        })) || []
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al crear');
      await fetchElections();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // --- 3. ACTUALIZAR (PUT) ---
  const updateElection = async (id: string, updatedElection: Election) => {
    setLoading(true);
    try {
      const payload = {
        idEleccion: id,
        nombre: updatedElection.name,
        tipoEleccion: updatedElection.type,
        descripcion: updatedElection.description,
        fechaInicio: updatedElection.startDate,
        fechaFin: updatedElection.endDate,
        estado: updatedElection.status,

        // MAPEO DE CATEGORÍAS
        categorias: updatedElection.categories?.map(cat => ({
            idCategoria: cat.id.length > 30 ? cat.id : null, // Validar si es UUID real
            nombre: cat.name,
            descripcion: "Categoría actualizada"
        })) || []
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al actualizar');
      await fetchElections();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. ELIMINAR (DELETE) ---
  const deleteElection = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta elección y sus categorías?")) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token || '' }
      });
      if (!response.ok) throw new Error('Error al eliminar');
      await fetchElections();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    elections,
    loading,
    error,
    createElection,
    updateElection,
    deleteElection,
    refreshElections: fetchElections
  };
};