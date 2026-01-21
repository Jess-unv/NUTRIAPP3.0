import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#D1E8D5',
  accent: '#3CB371',
  error: '#FF6B6B'
};

export default function ProfileScreen({ navigation }: any) {
  const { user, loading } = useUser();
  const { signOut } = useAuth();
  const [bmi, setBmi] = useState<string>('0');

  useEffect(() => {
    if (user?.peso && user?.altura) {
      const h = parseFloat(user.altura) / 100;
      const w = parseFloat(user.peso);
      const calculatedBMI = h > 0 ? (w / (h * h)).toFixed(1) : "0";
      setBmi(calculatedBMI);
    }
  }, [user]);

  const handleLogout = async () => {
    await signOut();
  };

  const InfoRow = ({ label, icon, value }: { label: string, icon: any, value: string }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </View>
      <Text style={styles.rowValue}>{value || 'No registrado'}</Text>
    </View>
  );

  const calculateAge = (fechaNacimiento: string) => {
  if (!fechaNacimiento) return '';
  const birthDate = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} años`;
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={50} color={COLORS.error} />
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.retryText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>MI PERFIL</Text>
          <View style={styles.underlineSmall} />
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={user.foto_perfil === 'default_avatar.png' || user.foto_perfil === 'usu.webp'
                ? require('../../assets/usu.webp') 
                : { uri: user.foto_perfil }}
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.nameText}>
            {user.nombre} {user.apellido}
          </Text>
          <Text style={styles.emailText}>{user.correo}</Text>
          <View style={styles.userBadge}>
            <Ionicons name="person-circle-outline" size={16} color={COLORS.primary} />
            <Text style={styles.userBadgeText}>PACIENTE</Text>
          </View>
        </View>

        {/* ESTADÍSTICAS - DISEÑO ORIGINAL EXACTO */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star-circle" size={32} color={COLORS.primary} />
            <Text style={styles.statVal}>{user.puntos_totales || 0}</Text>
            <Text style={styles.statLab}>PUNTOS TOTALES</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="scale-bathroom" size={32} color={COLORS.primary} />
            <Text style={styles.statVal}>{bmi}</Text>
            <Text style={styles.statLab}>MI IMC ACTUAL</Text>
          </View>
        </View>

        {/* INFORMACIÓN PERSONAL - DISEÑO ORIGINAL EXACTO */}
        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
          
          <InfoRow label="Nombre de usuario" icon="at-outline" value={user.nombre_usuario} />
          <InfoRow label="Teléfono" icon="call-outline" value={user.numero_celular} />
          <InfoRow label="Peso" icon="speedometer-outline" value={user.peso ? `${user.peso} kg` : ''} />
          <InfoRow label="Altura" icon="resize-outline" value={user.altura ? `${user.altura} cm` : ''} />
          <InfoRow label="Edad" icon="calendar-outline" value={calculateAge(user.fecha_nacimiento)} />
          <InfoRow label="Género" icon="person-outline" value={user.genero === 'masculino' ? 'Masculino' : user.genero === 'femenino' ? 'Femenino' : 'Otro'} />
          
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>METAS Y SALUD</Text>
            <InfoRow label="Objetivo" icon="trophy-outline" value={user.objetivo || 'Ninguna'} />
            <InfoRow label="Alergias" icon="medical-outline" value={user.alergias || 'Ninguna'} />
          </View>
        </View>

        {/* CERRAR SESIÓN - DISEÑO ORIGINAL EXACTO */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.secondary 
  },
  loadingText: { marginTop: 10, color: COLORS.textLight },
  errorText: { marginTop: 10, color: COLORS.error, fontWeight: '600' },
  retryButton: { marginTop: 20, padding: 15, backgroundColor: COLORS.primary, borderRadius: 10 },
  retryText: { color: COLORS.white, fontWeight: 'bold' },
  
  header: {
    height: 70,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandContainer: { alignItems: 'center' },
  brandName: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
  underlineSmall: { width: 25, height: 3, backgroundColor: COLORS.accent, borderRadius: 2, marginTop: 2 },
  
  scroll: { flex: 1, backgroundColor: COLORS.secondary },
  
  heroSection: {
    backgroundColor: COLORS.white,
    paddingVertical: 35,
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopWidth: 0,
  },
  avatarWrapper: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4, 
    borderColor: COLORS.primary 
  },
  nameText: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: COLORS.textDark, 
    marginTop: 15 
  },
  emailText: { 
    fontSize: 14, 
    color: COLORS.textLight, 
    opacity: 0.7, 
    fontWeight: '600', 
    marginTop: 2 
  },
  userBadge: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary, 
    paddingHorizontal: 15, 
    paddingVertical: 6, 
    borderRadius: 20,
    marginTop: 10,
  },
  userBadgeText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: COLORS.primary,
    marginLeft: 5
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
    marginTop: 25,
  },
  statCard: {
    backgroundColor: COLORS.white,
    width: '43%',
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  statVal: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, marginVertical: 4 },
  statLab: { fontSize: 9, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },

  infoBox: {
    margin: 20,
    padding: 25,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: COLORS.primary, marginBottom: 10, letterSpacing: 1.5 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  rowLabel: { marginLeft: 12, fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  rowValue: { fontSize: 14, fontWeight: '800', color: COLORS.textDark },

  footer: { marginTop: 10, alignItems: 'center' },
  logoutText: { color: COLORS.error, fontWeight: '900', fontSize: 15, opacity: 0.8 },
});