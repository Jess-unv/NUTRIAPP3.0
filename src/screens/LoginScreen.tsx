import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Modal, Animated, Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  accent: '#3CB371',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#E0E0E0',
  error: '#D32F2F',
  success: '#2E7D32'
};

const STORAGE_KEYS = {
  AUTH_TOKEN: 'nutri_u_session_token',
};

// --- COMPONENTE DE FONDO ANIMADO ---
const FloatingIcons = () => {
  const icons = ['leaf-outline', 'nutrition-outline', 'fitness-outline', 'heart-outline', 'water-outline', 'restaurant-outline'];
  return (
    <View style={StyleSheet.absoluteFill}>
      {[...Array(10)].map((_, i) => (
        <SingleFloatingIcon key={i} name={icons[i % icons.length]} delay={i * 1000} />
      ))}
    </View>
  );
};

const SingleFloatingIcon = ({ name, delay }: any) => {
  const moveAnim = useRef(new Animated.Value(0)).current;
  const randomLeft = useRef(Math.random() * width).current;
  const randomSize = useRef(20 + Math.random() * 30).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(moveAnim, {
        toValue: 1,
        duration: 15000 + Math.random() * 10000,
        easing: Easing.linear,
        useNativeDriver: true,
        delay: delay
      })
    ).start();
  }, []);

  const translateY = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [height + 50, -100]
  });

  const rotate = moveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ position: 'absolute', left: randomLeft, transform: [{ translateY }, { rotate }], opacity: 0.1 }}>
      <Ionicons name={name} size={randomSize} color={COLORS.primary} />
    </Animated.View>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function NutriULogin({ navigation }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState({ show: false, title: '', message: '' });

  // Estado del Formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    celular: '',
    password: '',
    confirmPassword: ''
  });

  const showAlert = (title: string, message: string) => {
    setModalVisible({ show: true, title, message });
  };

  const updateForm = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // MECÁNICA DE LOGIN SIMPLIFICADA
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      showAlert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    setLoading(true);
    
    // Simular tiempo de carga
    setTimeout(async () => {
      setLoading(false);
      
      // Aquí normalmente validarías con tu backend
      // Por ahora, hacemos un login básico que siempre funciona
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, 'dummy-token-123');
      
      // Navegar directamente al Dashboard
      navigation.navigate('Dashboard');
    }, 1500);
  };

  // MECÁNICA DE REGISTRO SIMPLIFICADA
  const handleRegister = () => {
    const { nombre, apellido, username, email, celular, password, confirmPassword } = form;

    if (!nombre || !apellido || !username || !email || !celular || !password) {
      showAlert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      
      // Simulación de registro exitoso
      showAlert('Registro Exitoso', 'Tu cuenta ha sido creada. Ahora inicia sesión.');
      
      // Limpiar campos de contraseña y cambiar a Login
      setForm({ ...form, password: '', confirmPassword: '' });
      setIsLogin(true);
    }, 2000);
  };

  const handleRecovery = () => {
    if (!form.email) {
      showAlert('Aviso', 'Ingresa tu correo para enviarte el enlace.');
      return;
    }
    showAlert('Enviado', 'Se ha enviado un código a tu correo.');
  };

  return (
    <View style={styles.container}>
      <FloatingIcons />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.brandName}>NUTRI U</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>{isLogin ? 'Gestión Nutricional Profesional' : 'Creación de Perfil de Usuario'}</Text>
          </View>

          <View style={styles.card}>
            {!isLogin && (
              <>
                <CustomInput icon="person-outline" placeholder="Nombre" value={form.nombre} onChangeText={(t: string) => updateForm('nombre', t)} />
                <CustomInput icon="person-outline" placeholder="Apellido" value={form.apellido} onChangeText={(t: string) => updateForm('apellido', t)} />
                <CustomInput icon="at-outline" placeholder="Nombre de usuario" value={form.username} onChangeText={(t: string) => updateForm('username', t)} />
                <CustomInput icon="call-outline" placeholder="Número celular" keyboardType="phone-pad" value={form.celular} onChangeText={(t: string) => updateForm('celular', t)} />
              </>
            )}

            <CustomInput 
              icon="mail-outline" 
              placeholder="Correo electrónico" 
              keyboardType="email-address" 
              autoCapitalize="none"
              value={form.email} 
              onChangeText={(t: string) => updateForm('email', t)} 
            />
            
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(t: string) => updateForm('password', t)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <CustomInput icon="shield-checkmark-outline" placeholder="Confirmar contraseña" secureTextEntry={true} value={form.confirmPassword} onChangeText={(t: string) => updateForm('confirmPassword', t)} />
            )}

            {isLogin && (
              <TouchableOpacity onPress={handleRecovery} style={styles.forgotBtn}>
                <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.mainBtn, loading && { opacity: 0.7 }]} 
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.mainBtnText}>{isLogin ? 'ACCEDER' : 'REGISTRARME'}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchBtn}>
              <Text style={styles.switchText}>
                {isLogin ? '¿No tiene una cuenta? ' : '¿Ya tiene cuenta? '}
                <Text style={styles.switchTextBold}>{isLogin ? 'Regístrese aquí' : 'Inicie sesión'}</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Nutri U v1.0.0 | Sistema de Autenticación Seguro</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible.show} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalVisible.title}</Text>
            <Text style={styles.modalMessage}>{modalVisible.message}</Text>
            <TouchableOpacity 
              style={styles.modalBtn} 
              onPress={() => setModalVisible({...modalVisible, show: false})}
            >
              <Text style={styles.modalBtnText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const CustomInput = ({ icon, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Ionicons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
    <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  scrollContent: { flexGrow: 1, paddingHorizontal: 30, justifyContent: 'center', paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 40 },
  brandName: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
  underline: { width: 40, height: 4, backgroundColor: COLORS.accent, marginTop: 5, borderRadius: 2 },
  subtitle: { color: COLORS.textLight, marginTop: 10, fontSize: 14, fontWeight: '300', textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 20,
    paddingVertical: 8
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: COLORS.textDark, fontSize: 15 },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotText: { color: COLORS.primary, fontSize: 13, fontWeight: '600' },
  mainBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  mainBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: COLORS.textLight, fontSize: 13 },
  switchTextBold: { color: COLORS.primary, fontWeight: '700' },
  footer: { marginTop: 40, marginBottom: 20, alignItems: 'center' },
  footerText: { color: '#BBB', fontSize: 10, letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '80%', borderRadius: 15, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textDark, marginBottom: 10 },
  modalMessage: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 20 },
  modalBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8 },
  modalBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 }
});