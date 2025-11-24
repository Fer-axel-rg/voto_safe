// src/router/AppRouter.tsx

import { Navigate, Outlet } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import DashboardPage from "@/pages/admin/Dashboard/DashboardPage";
import VotersPage from "@/pages/admin/Voters/VotersPage";
import StatisticsPage from "@/pages/admin/Statistics/StatisticsPage";
import ElectionsPage from "@/pages/admin/Elections/ElectionsPage";
import PartiesPage from "@/pages/admin/Parties/PartiesPage";
import PartyDetailPage from "@/pages/admin/Parties/PartyDetailPage"; // ✅ AGREGADO

import LandingPage from "./../pages/LandingPage";
import ElectionSelectorPage from "./../pages/ElectionSelectorPage";
import UserDashbord from "./../pages/userDashbord";

// Rutas exportadas para fácil acceso
export const ROUTES = {
  LANDING: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin/dashboard",
    ELECTIONS: "/admin/elections",
    BALLOTS: "/admin/ballots",
    BALLOT_DETAIL: "/admin/ballots/:electionId",
    VOTERS: "/admin/voters",
    PARTIES: "/admin/parties",
    PARTY_DETAIL: "/admin/parties/:electionId", // ✅ YA EXISTE
    STATISTICS: "/admin/statistics/:id_dashbord",
  },
  USER: {
    ROOT: "/user",
    BALLOTS: "/user/ballots",
    DASHBOARD: "/user/dashboard/:electionId",
  },
} as const;

// eslint-disable-next-line react-refresh/only-export-components
export const routes = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "elections", element: <ElectionsPage /> },
      { path: "voters", element: <VotersPage /> },
      { path: "parties", element: <PartiesPage /> },
      { path: "parties/:electionId", element: <PartyDetailPage /> }, // ✅ AGREGADO
      { path: "statistics/:id_dashbord", element: <StatisticsPage /> },
      { path: "statistics", element: <StatisticsPage /> },
    ],
  },
  {
    path: "/user",
    element: <Outlet />,
    children: [
      { index: true, element: <ElectionSelectorPage /> },
      { path: "ballots", element: <ElectionSelectorPage /> },
      { path: "dashboard/:electionId", element: <UserDashbord /> },
    ],
  },
];