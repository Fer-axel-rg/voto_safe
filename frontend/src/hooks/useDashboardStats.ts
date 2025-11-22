import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { DashboardStats } from '@/types/dashboard.types';

const API_URL = 'http://localhost:8080/api/v1/dashboard/summary';

// Estado inicial vacío para que no rompa la UI mientras carga
const INITIAL_STATS: DashboardStats = {
  adminName: 'Cargando...',
  activeElectionsCount: 0,
  totalUsersCount: 0,
  voterPercentage: 0,
  upcomingElections: [],
  activeElections: [],
};

export const useDashboardStats = () => {
  const { token, logout } = useAuth(); // Necesitamos el token del usuario logueado
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    // Si no hay token, no intentamos llamar (probablemente no está logueado)
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token // IMPORTANTE: Enviamos el token a Java
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Si el token venció o es inválido
        logout();
        throw new Error("Sesión expirada");
      }

      if (!response.ok) {
        throw new Error('Error al cargar datos del dashboard');
      }

      const data: DashboardStats = await response.json();
      setStats(data);
      setError(null);

    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refreshStats: fetchStats };
};