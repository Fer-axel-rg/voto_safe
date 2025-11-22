import { useState, useEffect } from 'react';
import type { Election } from '@/types/election.types';

export const useActiveElections = () => {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveElections();
  }, []);

  const loadActiveElections = () => {
    setLoading(true);
    try {
      // LÓGICA SILENCIADA:
      // Aquí antes leías del localStorage. Ahora simplemente no hacemos nada
      // o devolvemos un array vacío para que la UI no se rompa.
      console.log("useActiveElections: Hook en modo espera (Backend desconectado)");
      
      setElections([]); 

    } catch (error) {
      console.error('Error (ignorado):', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    elections,
    loading,
    loadActiveElections,
  };
};