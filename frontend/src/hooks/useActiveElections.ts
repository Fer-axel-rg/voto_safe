// src/hooks/useActiveElections.ts
import { useState, useEffect, useCallback } from 'react';
import type { Election } from '@/types/election.types';

/**
 * Hook para cargar elecciones activas
 * @param autoLoad - Si es true, carga automáticamente al montar. Si es false, requiere llamar manualmente a loadActiveElections()
 */
export const useActiveElections = (autoLoad: boolean = false) => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ useCallback para evitar recrear la función en cada render
  const loadActiveElections = useCallback(() => {
    setLoading(true);
    
    try {
      if (import.meta.env.DEV) {
        console.log("useActiveElections: Cargando desde localStorage");
      }

      // ✅ Cargar elecciones del localStorage
      const storedElections = localStorage.getItem('elections');
      
      if (storedElections) {
        const allElections: Election[] = JSON.parse(storedElections);
        
        // ✅ Filtrar solo elecciones activas o por comenzar
        const activeElections = allElections.filter(
          election => election.status === 'active' || election.status === 'upcoming'
        );
        
        if (import.meta.env.DEV) {
          console.log(`useActiveElections: ${activeElections.length} elecciones encontradas`);
        }
        
        setElections(activeElections);
      } else {
        if (import.meta.env.DEV) {
          console.log("useActiveElections: No hay elecciones en localStorage");
        }
        setElections([]);
      }
      
    } catch (error) {
      console.error('Error al cargar elecciones:', error);
      setElections([]);
    } finally {
      setLoading(false);
    }
  }, []); // ← Sin dependencias, la función nunca cambia

  useEffect(() => {
    // ✅ Solo ejecutar si autoLoad es true
    if (autoLoad) {
      loadActiveElections();
    } else if (import.meta.env.DEV) {
      console.log("useActiveElections: Hook inicializado sin autoLoad");
    }
  }, [autoLoad, loadActiveElections]);

  return {
    elections,
    loading,
    loadActiveElections,
  };
};