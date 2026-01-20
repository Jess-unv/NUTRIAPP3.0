import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePoints } from '../context/PointsContext';

const { width } = Dimensions.get('window');

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

export default function ProfileScreen() {
  const { userPoints } = usePoints();

  // Datos fijos (Lectura)
  const user = {
    name: 'Juanito Alcachofa',
    email: 'juanito.alcachofa@email.com',
    age: '28',
    weight: '70',
    height: '175',
    goal: 'Perder peso',
    allergies: 'Ninguna',
  };

  const calculateBMI = () => {
    const h = parseFloat(user.height) / 100;
    const w = parseFloat(user.weight);
    return h > 0 ? (w / (h * h)).toFixed(1) : "0";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER FIJO */}
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>MI PERFIL</Text>
          <View style={styles.underlineSmall} />
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* SECCIÓN HERO (FOTO Y NOMBRE) - SIN SOLAPAMIENTO */}
        <View style={styles.heroSection}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={require('../../assets/usu.webp')} 
              style={styles.avatar} 
            />
          </View>
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        {/* TARJETAS DE ESTADÍSTICAS GLOBALES */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star-circle" size={32} color={COLORS.primary} />
            <Text style={styles.statVal}>{userPoints}</Text>
            <Text style={styles.statLab}>PUNTOS TOTALES</Text>
          </View>
          
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="scale-bathroom" size={32} color={COLORS.primary} />
            <Text style={styles.statVal}>{calculateBMI()}</Text>
            <Text style={styles.statLab}>MI IMC ACTUAL</Text>
          </View>
        </View>

        {/* BLOQUE DE INFORMACIÓN (SOLO LECTURA) */}
        <View style={styles.infoBox}>
          <Text style={styles.sectionTitle}>DATOS PERSONALES</Text>
          
          <InfoRow label="Edad" icon="calendar-outline" value={`${user.age} años`} />
          <InfoRow label="Peso" icon="speedometer-outline" value={`${user.weight} kg`} />
          <InfoRow label="Altura" icon="resize-outline" value={`${user.height} cm`} />
          
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>METAS Y SALUD</Text>
            <InfoRow label="Objetivo" icon="trophy-outline" value={user.goal} />
            <InfoRow label="Alergias" icon="medical-outline" value={user.allergies} />
          </View>
        </View>

        {/* CERRAR SESIÓN */}
        <View style={styles.footer}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Componente para filas de información fija
const InfoRow = ({ label, icon, value }: { label: string, icon: any, value: string }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
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
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: COLORS.primary },
  nameText: { fontSize: 24, fontWeight: '900', color: COLORS.textDark, marginTop: 15 },
  emailText: { fontSize: 14, color: COLORS.textLight, opacity: 0.7, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 15,
    marginTop: 25,
  },
  statCard: {
    backgroundColor: COLORS.white,
    width: width * 0.43,
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