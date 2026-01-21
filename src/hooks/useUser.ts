import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export const useUser = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // 1. Obtener datos del paciente desde tabla usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("correo", user?.email)
        .eq("tipo_usuario", "paciente")
        .single();

      if (usuarioError) {
        console.error("Error al cargar datos del paciente:", usuarioError);
        setUserData(null);
        setLoading(false);
        return;
      }

      // 2. Obtener puntos del paciente
      const { data: puntosData } = await supabase
        .from("puntos_usuario")
        .select("*")
        .eq("id_usuario", usuarioData.id_usuario)
        .single();

      // 3. Combinar datos
      setUserData({
        ...usuarioData,
        puntos_totales: puntosData?.puntos_totales || 0,
        puntos_hoy: puntosData?.puntos_hoy || 0,
        nivel: puntosData?.nivel || "principiante",
      });
    } catch (error) {
      console.error("Error al cargar datos del paciente:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) throw new Error("No hay usuario autenticado");

      // Obtener id_usuario actual
      const { data: currentUser } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("correo", user.email)
        .single();

      if (!currentUser) throw new Error("Paciente no encontrado");

      const { error } = await supabase
        .from("usuarios")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id_usuario", currentUser.id_usuario);

      if (error) throw error;

      await fetchUserData();
      return { success: true };
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    user: userData,
    loading,
    updateProfile,
    refreshUserData: fetchUserData,
  };
};
