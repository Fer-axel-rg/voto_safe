// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import type {  AuthState, LoginCredentials, RegisterData } from '@/types/auth.types';

// URL de tu Backend (Asegúrate que coincida con tu Spring Boot)
const API_URL = 'http://localhost:8080/api/v1/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Nuevo: Para saber si estamos verificando sesión
  });

  // 1. AL CARGAR: Verificar si hay sesión guardada (Token)
  useEffect(() => {
    const checkSession = () => {
      const storedToken = localStorage.getItem('votosafe_token');
      const storedUser = localStorage.getItem('votosafe_user');

      if (storedToken && storedUser) {
        setAuthState({
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  // 2. LOGIN (Conectado a Java)
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials), // Enviamos DNI y Password
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      // ÉXITO: Java nos devolvió el Token y el Usuario
      const { token, user } = data;

      // Guardamos en LocalStorage (Persistencia)
      localStorage.setItem('votosafe_token', token);
      localStorage.setItem('votosafe_user', JSON.stringify(user));

      // Actualizamos el Estado de React
      setAuthState({
        user: user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true, message: 'Bienvenido' };

    } catch (error: any) {
      console.error(error);
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  // 3. REGISTRO (Conectado a Java)
  const register = async (userData: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar');
      }

      return { success: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' };

    } catch (error: any) {
      return { success: false, message: error.message || 'Error de conexión' };
    }
  };

  // 4. LOGOUT (Limpieza local)
  const logout = () => {
    localStorage.removeItem('votosafe_token');
    localStorage.removeItem('votosafe_user');
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  // 5. HELPER PARA ADMIN
  const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
  };

  // Helper para obtener el token actual (útil para otros hooks)
  const token = localStorage.getItem('votosafe_token');

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    token, // Exportamos el token para que useDashboardStats lo pueda usar
    login,
    register,
    logout,
    isAdmin,
  };
};