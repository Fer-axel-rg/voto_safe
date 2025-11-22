// src/types/dashboard.types.ts

// src/types/dashboard.types.ts

// Un resumen ligero de la elección para el dashboard
export interface ElectionSummary {
  id: string;
  name: string;
  status: 'active' | 'upcoming' | 'finished';
  startDate: string;
  endDate: string;
}

// Lo que Java te envía en /summary
export interface DashboardStats {
  adminName: string;
  activeElectionsCount: number;
  totalUsersCount: number;
  voterPercentage: number;
  upcomingElections: ElectionSummary[];
  activeElections: ElectionSummary[];
}