import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { Election } from '../types/election.types';

// --- Interfaces que coinciden con los DTOs de Java ---

export interface PartyResult {
  partyName: string;
  partyLogo: string;
  votes: number;
  percentage: number;
  color: string;
}

export interface ElectionResults {
  electionName: string;
  totalVotes: number;
  totalVoters: number;
  participationPercentage: number;
  results: PartyResult[];
  winningCandidate: string;
  state: string;
}

const API_BASE = 'http://localhost:8080/api/v1';

export const useStatistics = (electionId?: string) => {
  const { token } = useAuth();
  
  const [results, setResults] = useState<ElectionResults | null>(null);
  const [electionsList, setElectionsList] = useState<Election[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Obtener lista de elecciones (para el selector del header)
  const loadElectionsList = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/elections`, { headers: { Authorization: token } });
      if (res.ok) {
        const data = await res.json();
        // Mapeo simple para el selector
        const mapped = data.map((e: any) => ({
            id: e.idEleccion,
            name: e.nombre,
            status: e.estado,
            type: e.tipoEleccion
        }));
        setElectionsList(mapped);
      }
    } catch (e) { console.error("Error cargando lista elecciones", e); }
  }, [token]);

  // 2. Obtener estadísticas de la elección seleccionada
  const loadResults = useCallback(async () => {
    if (!electionId || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/statistics/${electionId}`, {
        headers: { Authorization: token }
      });
      
      if (res.ok) {
        const data: ElectionResults = await res.json();
        setResults(data);
        setError(null);
      } else {
        setError("No se pudieron cargar los resultados.");
      }
    } catch (e: any) {
      console.error("Error cargando stats:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [electionId, token]);

  // Cargar lista al inicio
  useEffect(() => {
    loadElectionsList();
  }, [loadElectionsList]);

  // Cargar resultados cuando cambia la elección
  useEffect(() => {
    loadResults();
    
    // Polling: Actualizar automáticamente cada 10 segundos para ver votos en tiempo real
    const interval = setInterval(loadResults, 10000);
    return () => clearInterval(interval);

  }, [loadResults]);

  return { results, electionsList, loading, error };
};