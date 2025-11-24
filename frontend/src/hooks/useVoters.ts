import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

// Definimos los tipos exactos que vienen de Java
export interface VoterStats {
  total: number;
  votaron: number;
  noVotaron: number;
  admins: number;
  users: number;
}

export interface Voter{
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  tipo: string;       // 'admin' | 'user'
  departamento: string;
  estado: string;     // 'voto' | 'no voto'
  eleccion: string;
}

const API_BASE = 'http://localhost:8080/api/v1/users';

export const useVoters = () => {
  const { token } = useAuth();
  
  // Estados
  const [voters, setVoters] = useState<Voter[]>([]);
  const [stats, setStats] = useState<VoterStats>({ total: 0, votaron: 0, noVotaron: 0, admins: 0, users: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`, { headers: { Authorization: token || '' } });
      if (res.ok) setStats(await res.json());
    } catch (e) { console.error("Error stats:", e); }
  }, [token]);

  // Función para cargar usuarios (con búsqueda)
  const loadVoters = useCallback(async (searchParam: string = '') => {
    setLoading(true);
    try {
      const url = searchParam 
        ? `${API_BASE}?search=${encodeURIComponent(searchParam)}` 
        : API_BASE;

      const res = await fetch(url, { headers: { Authorization: token || '' } });
      if (!res.ok) throw new Error('Error al cargar votantes');
      
      const data = await res.json();
      setVoters(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Cargar al inicio
  useEffect(() => {
    if (token) {
      loadStats();
      loadVoters();
    }
  }, [token, loadStats, loadVoters]);

  return {
    voters,
    stats,
    loading,
    error,
    searchVoters: loadVoters, // Exponemos la función para buscar manualmente
    refresh: () => { loadStats(); loadVoters(); }
  };
};
