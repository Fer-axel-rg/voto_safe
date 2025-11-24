import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { DashboardStats } from '@/types/dashboard.types';

const API_URL = 'http://localhost:8080/api/v1/dashboard/summary';

const INITIAL_STATS: DashboardStats = {
  adminName: 'Cargando...',
  activeElectionsCount: 0,
  totalUsersCount: 0,
  voterPercentage: 0,
  upcomingElections: [],
  activeElections: [],
};

export const useDashboardStats = () => {
  const { token, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ⚠️ CLAVE: Usamos useCallback para que la función sea estable
  const fetchStats = useCallback(async () => {
    if (!token) {
        setLoading(false);
        return;
    }

    // Evitamos llamar si ya estamos cargando (opcional, pero buena práctica)
    // setLoading(true); // <-- A VECES ESTO CAUSA EL BUCLE SI ESTÁ MAL PUESTO

    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token 
        }
      });

      if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error("Sesión expirada");
      }

      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }

      const data: DashboardStats = await response.json();
      
      // Solo actualizamos si los datos son diferentes (o simplemente confiamos en React)
      setStats(data);
      setError(null);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]); // Solo se recrea si cambia el token

  // ⚠️ CLAVE 2: El useEffect solo depende de fetchStats
  useEffect(() => {
    let isMounted = true;

    if(isMounted) {
        fetchStats();
    }

    return () => { isMounted = false; };
  }, []); 

  return { stats, loading, error, refreshStats: fetchStats };
};