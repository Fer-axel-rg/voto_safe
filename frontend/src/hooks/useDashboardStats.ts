// src/hooks/useDashboardStats.ts

import { useState, useEffect } from 'react';
import { localStorageUtils } from '@/utils/localStorage';
import type { MockUser } from '@/types/dashboard.types';
import type { Election } from '@/types/election.types'; // <-- Importar Election
import { useAuth } from './useAuth';

const MOCK_USERS_KEY = 'usuariosData';

export interface DashboardStats {
  adminName: string;
  activeElectionsCount: number;
  totalUsersCount: number;
  voterPercentage: number;
  upcomingElections: Election[]; // <-- Nuevo
  activeElections: Election[]; // <-- Nuevo
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    adminName: 'Admin',
    activeElectionsCount: 0,
    totalUsersCount: 0,
    voterPercentage: 0,
    upcomingElections: [], // <-- Nuevo
    activeElections: [], // <-- Nuevo
  });
  const [loading, setLoading] = useState(true);

  const calculateStats = () => {
    setLoading(true);
    try {
      const adminName = user?.fullName || 'Admin';

      // --- Lógica de Elecciones ---
      const elections = localStorageUtils.getElections();

      // Activas
      const activeElectionsList = elections.filter(
        (e) => e.status === 'active'
      );
      const activeElectionsCount = activeElectionsList.length;


      // Próximas (ordenadas por fecha de inicio más cercana)
      const upcomingElections = elections
        .filter((e) => e.status === 'upcoming')
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3); // Tomar solo las 3 primeras

      // --- Lógica de Usuarios (sin cambios) ---
      const usersData = localStorage.getItem(MOCK_USERS_KEY);
      const mockUsers: MockUser[] = usersData ? JSON.parse(usersData) : [];

      const totalUsersCount = mockUsers.length;
      const voterCount = mockUsers.filter(u => u.Estado === 'voto').length;

      const voterPercentage = totalUsersCount > 0
        ? (voterCount / totalUsersCount) * 100
        : 0;

      setStats({
        adminName,
        activeElectionsCount,
        totalUsersCount,
        voterPercentage,
        upcomingElections, // <-- Nuevo
        activeElections: activeElectionsList, // <-- Nuevo
      });

    } catch (error) {
      console.error("Error al calcular estadísticas del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStats();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'votosafe_elections' || event.key === MOCK_USERS_KEY) {
        calculateStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  return { stats, loading, refreshStats: calculateStats };
};