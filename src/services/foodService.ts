import { supabase } from '../lib/supabase';

export const foodService = {
  // Registrar alimento consumido
  registerFood: async (userId: number, foodData: {
    id_alimento: number;
    porciones: number;
    calorias_totales: number;
    fecha: string;
  }) => {
    const { data, error } = await supabase
      .from('registro_alimentos')
      .insert({
        id_usuario: userId,
        ...foodData,
      })
      .select()
      .single();

    return { data, error };
  },

  // Obtener historial de alimentos
  getFoodHistory: async (userId: number, startDate?: string, endDate?: string) => {
    let query = supabase
      .from('registro_alimentos')
      .select(`
        *,
        alimentos (*)
      `)
      .eq('id_usuario', userId)
      .order('fecha', { ascending: false });

    if (startDate && endDate) {
      query = query.gte('fecha', startDate).lte('fecha', endDate);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Obtener alimentos disponibles
  getAvailableFoods: async () => {
    const { data, error } = await supabase
      .from('alimentos')
      .select('*')
      .order('nombre');

    return { data, error };
  },
};