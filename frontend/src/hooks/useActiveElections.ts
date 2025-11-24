import { useState, useEffect, useCallback } from 'react';
import type { Election } from '@/types/election.types';
import { useAuth } from './useAuth';

const API_URL = 'http://localhost:8080/api/v1/elections';

export const useActiveElections = () => {
  const { token } = useAuth();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActiveElections = useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar elecciones');

      const dataRaw = await response.json();

      // 1. TRADUCCIÓN (Backend -> Frontend)
      const mappedElections: Election[] = dataRaw.map((item: any) => ({
        id: item.idEleccion,
        name: item.nombre,
        type: item.tipoEleccion,
        description: item.descripcion || "", 
        startDate: item.fechaInicio,
        endDate: item.fechaFin,
        status: item.estado,
        
        // 👇 AQUÍ ESTABA EL ERROR (Antes era []) 👇
        // Ahora mapeamos la lista 'categorias' que viene de Java
        categories: item.categorias ? item.categorias.map((cat: any) => ({
            id: cat.idCategoria,
            name: cat.nombre
        })) : [],
        
        allowNullVote: false,
        autoSendVote: false,
      }));

      // 2. FILTRADO
      const activeOrUpcoming = mappedElections.filter(
        (e) => e.status === 'active' || e.status === 'upcoming'
      );

      // 3. ORDENAMIENTO
      activeOrUpcoming.sort((a, b) => {
         if (a.status === 'active' && b.status !== 'active') return -1;
         if (a.status !== 'active' && b.status === 'active') return 1;
         return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });

      setElections(activeOrUpcoming);

    } catch (error) {
      console.error('Error cargando elecciones:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadActiveElections();
  }, [loadActiveElections]);

  return {
    elections,
    loading,
    loadActiveElections,
  };
};