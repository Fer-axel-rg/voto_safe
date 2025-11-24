import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';

// Definimos los tipos exactos
export interface VoterStats {
  total: number;
  votaron: number;
  noVotaron: number;
  admins: number;
  users: number;
}

export interface Voter {
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

  // Función para cargar estadísticas (Memoizada)
  const loadStats = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/stats`, { 
        headers: { Authorization: token } 
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) { 
      console.error("Error cargando stats:", e); 
    }
  }, [token]);

  // Función para cargar usuarios (Memoizada y estable)
  const loadVoters = useCallback(async (searchParam: string = '') => {
    if (!token) return;
    
    setLoading(true);
    try {
      // Construcción de URL con búsqueda
      const url = searchParam 
        ? `${API_BASE}?search=${encodeURIComponent(searchParam)}` 
        : API_BASE;

      const res = await fetch(url, { 
        headers: { Authorization: token } 
      });
      
      if (!res.ok) throw new Error('Error al cargar votantes');
      
      const data = await res.json();
      setVoters(data);
      setError(null);
      
      // Opcional: Actualizar estadísticas cada vez que se hace una búsqueda exitosa
      // loadStats(); 
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [token]); // Dependencia solo del token para mantener la función estable

  // NOTA: Se ha eliminado el useEffect que cargaba datos automáticamente.
  // Ahora la carga depende exclusivamente del useEffect en 'VotersPage.tsx'.

  return {
    voters,
    stats,
    loading,
    error,
    searchVoters: loadVoters, // Esta función es estable gracias a useCallback
    refresh: () => { 
      loadStats(); 
      loadVoters(); 
    },
    loadStats // Exponemos loadStats por si quieres llamarlo individualmente
  };
};