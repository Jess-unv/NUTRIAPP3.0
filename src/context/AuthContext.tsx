import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (userData: {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    celular: string;
    password: string;
    peso?: number;
    altura?: number;
    objetivo?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      if (!email.trim() || !password.trim()) {
        return { 
          success: false, 
          error: 'Por favor, ingresa tu correo y contraseña.' 
        };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        let errorMessage = 'Error al iniciar sesión';
        
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Correo o contraseña incorrectos.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor verifica tu correo electrónico.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Correo electrónico inválido.';
        } else if (error.message.includes('Network')) {
          errorMessage = 'Error de conexión. Verifica tu internet.';
        } else {
          errorMessage = error.message;
        }
        
        return { success: false, error: errorMessage };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      return { 
        success: false, 
        error: 'Error inesperado. Por favor intenta nuevamente.' 
      };
    }
  };

  const signUp = async (userData: {
    nombre: string;
    apellido: string;
    username: string;
    email: string;
    celular: string;
    password: string;
    peso?: number;
    altura?: number;
    objetivo?: string;
    fecha_nacimiento: string; // NUEVO
    genero: string; // NUEVO
  }) => {
    try {
      // Validaciones
      if (!userData.nombre.trim() || !userData.apellido.trim() || 
          !userData.username.trim() || !userData.email.trim() || 
          !userData.password.trim()) {
        return { 
          success: false, 
          error: 'Todos los campos son obligatorios.' 
        };
      }

      if (userData.password.length < 6) {
        return { 
          success: false, 
          error: 'La contraseña debe tener al menos 6 caracteres.' 
        };
      }

      // 1. Registrar en Auth de Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        options: {
          data: {
            nombre: userData.nombre.trim(),
            apellido: userData.apellido.trim(),
            username: userData.username.trim(),
            celular: userData.celular.trim(),
          },
        },
      });

      if (authError) {
        let errorMessage = 'Error al registrarse';
        
        if (authError.message.includes('already registered')) {
          errorMessage = 'Este correo ya está registrado.';
        } else if (authError.message.includes('Invalid email')) {
          errorMessage = 'Correo electrónico inválido.';
        } else {
          errorMessage = authError.message;
        }
        
        return { success: false, error: errorMessage };
      }

      // 2. Insertar en tabla usuarios (SIEMPRE como paciente)
      const usuarioData: any = {
        id_auth_user: authData.user?.id,
        tipo_usuario: 'paciente',
        nombre: userData.nombre.trim(),
        apellido: userData.apellido.trim(),
        nombre_usuario: userData.username.trim(),
        correo: userData.email.trim().toLowerCase(),
        numero_celular: userData.celular.trim(),
        foto_perfil: 'usu.webp',
        fecha_nacimiento: userData.fecha_nacimiento,
        genero: userData.genero,
      };

      // Agregar campos opcionales
      if (userData.peso) usuarioData.peso = userData.peso;
      if (userData.altura) usuarioData.altura = userData.altura;
      if (userData.objetivo) usuarioData.objetivo = userData.objetivo;

      const { error: dbError } = await supabase
        .from('usuarios')
        .insert(usuarioData);

      if (dbError) {
        console.error('Error al insertar paciente:', dbError);
        
        // Revertir creación en Auth
        if (authData.user?.id) {
          await supabase.auth.admin.deleteUser(authData.user.id);
        }
        
        let errorMessage = 'Error al crear cuenta';
        if (dbError.code === '23505') {
          if (dbError.message.includes('nombre_usuario')) {
            errorMessage = 'Este nombre de usuario ya está en uso.';
          } else if (dbError.message.includes('correo')) {
            errorMessage = 'Este correo ya está registrado.';
          }
        }
        
        return { success: false, error: errorMessage };
      }

      // 3. Crear registro en puntos_usuario
      const { data: newUser } = await supabase
        .from('usuarios')
        .select('id_usuario')
        .eq('correo', userData.email.trim().toLowerCase())
        .single();

      if (newUser) {
        await supabase.from('puntos_usuario').insert({
          id_usuario: newUser.id_usuario,
          puntos_totales: 0,
          puntos_hoy: 0,
        });
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error inesperado al registrarse:', error);
      return { 
        success: false, 
        error: 'Error inesperado. Por favor intenta nuevamente.' 
      };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email.trim()) {
        return { 
          success: false, 
          error: 'Por favor ingresa tu correo electrónico.' 
        };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: 'nutriu://reset-password',
      });

      if (error) {
        return { success: false, error: 'Error al enviar enlace de recuperación' };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      return { 
        success: false, 
        error: 'Error inesperado. Por favor intenta nuevamente.' 
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};