import React, { useState, useRef, useMemo } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, Animated, 
  Modal, ScrollView, Dimensions, Vibration, SafeAreaView, StatusBar 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// Importamos tu contexto real
import { usePoints } from '../context/PointsContext'; 

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.65;

const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  accent: '#3CB371',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#D1E8D5',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

const TROPHIES = [
  { id: 1, name: "Manzana de Cobre", pointsRequired: 100, color: COLORS.bronze, level: "Principiante", image: require('../../assets/premiocobre.png') },
  { id: 2, name: "Manzana de Plata", pointsRequired: 1000, color: COLORS.silver, level: "Intermedio", image: require('../../assets/premioplata.png') },
  { id: 3, name: "Manzana de Oro", pointsRequired: 5000, color: COLORS.gold, level: "Avanzado", image: require('../../assets/premiooro.png') },
  { id: 4, name: "Manzana de Diamante", pointsRequired: 10000, color: '#3498DB', level: "Leyenda", image: require('../../assets/premioplata.png') }
];

export default function PointsScreen({ navigation }: any) {
  // USANDO TU CONTEXTO REAL
  const { userPoints } = usePoints(); 
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const state = useMemo(() => {
    // Determinamos qué trofeos ha alcanzado el usuario basándonos en userPoints del contexto
    const list = TROPHIES.map(t => ({ ...t, achieved: userPoints >= t.pointsRequired }));
    const current = list[currentIdx];
    
    // El mejor trofeo alcanzado para mostrar en el modal
    const best = [...list].reverse().find(t => t.achieved) || list[0];
    
    // Lógica de progreso
    const prevPoints = currentIdx === 0 ? 0 : list[currentIdx - 1].pointsRequired;
    const diff = current.pointsRequired - prevPoints;
    const progress = Math.max(0, Math.min(1, (userPoints - prevPoints) / diff));
    const percentage = Math.round(progress * 100);
    
    return { list, current, best, progress, percentage };
  }, [userPoints, currentIdx]);

  const triggerShake = () => {
    Vibration.vibrate(80);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleNavigate = (dir: 'next' | 'prev') => {
    const next = dir === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (next >= 0 && next < TROPHIES.length) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
      ]).start();
      setCurrentIdx(next);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>MIS LOGROS</Text>
          <View style={styles.underlineSmall} />
        </View>
        <View style={styles.pointsBadgeHeader}>
          <Text style={styles.pointsBadgeText}>{userPoints} PTS TOTALES</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.progressSection}>
          <View style={[styles.circleBase, { borderColor: state.current.achieved ? COLORS.primary : COLORS.border }]}>
            <View style={styles.circleInner}>
              <Text style={styles.circlePercent}>{state.percentage}%</Text>
              <Text style={styles.circleSub}>DEL NIVEL</Text>
            </View>
          </View>
        </View>

        <View style={styles.carouselContainer}>
          <TouchableOpacity onPress={() => handleNavigate('prev')} disabled={currentIdx === 0}>
            <Ionicons name="chevron-back" size={35} color={currentIdx === 0 ? '#E2E8F0' : COLORS.primary} />
          </TouchableOpacity>

          <Animated.View style={[styles.trophyCard, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={!state.current.achieved ? triggerShake : undefined}
              style={styles.imageBox}
            >
              <Image 
                source={state.current.image} 
                style={[styles.trophyImg, !state.current.achieved && { tintColor: '#000', opacity: 0.1 }]} 
              />
              {!state.current.achieved && (
                <Animated.View style={[styles.lockContainer, { transform: [{ translateX: shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-5, 5] }) }] }]}>
                  <View style={styles.lockCircle}>
                    <Ionicons name="lock-closed" size={30} color={COLORS.white} />
                  </View>
                  <Text style={styles.lockText}>Faltan {state.current.pointsRequired - userPoints} pts</Text>
                </Animated.View>
              )}
            </TouchableOpacity>

            <Text style={styles.trophyName}>{state.current.name.toUpperCase()}</Text>
            <View style={[styles.levelBadge, { backgroundColor: state.current.color }]}>
              <Text style={styles.levelBadgeText}>{state.current.level}</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${state.percentage}%`, backgroundColor: COLORS.primary }]} />
              </View>
              <Text style={styles.progressLabel}>{userPoints} / {state.current.pointsRequired} Puntos</Text>
            </View>
          </Animated.View>

          <TouchableOpacity onPress={() => handleNavigate('next')} disabled={currentIdx === TROPHIES.length - 1}>
            <Ionicons name="chevron-forward" size={35} color={currentIdx === TROPHIES.length - 1 ? '#E2E8F0' : COLORS.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.rewardsButton} onPress={() => setShowModal(true)}>
          <MaterialCommunityIcons name="wallet-giftcard" size={22} color={COLORS.white} />
          <Text style={styles.rewardsButtonText}>ESTADO DE RANGO</Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={28} color={COLORS.textDark} />
            </TouchableOpacity>
            
            <View style={styles.modalIconCircle}>
              <Image source={state.best.image} style={styles.modalTrophyImg} />
            </View>
            
            <Text style={styles.modalTitle}>Rango Actual Alcanzado</Text>
            <Text style={[styles.modalLevelName, { color: COLORS.primary }]}>{state.best.level}</Text>
            
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Puntos en tu cuenta:</Text>
              <Text style={styles.statValue}>{userPoints} Puntos Nutri U</Text>
            </View>

            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseButtonText}>CONTINUAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerIcon: { padding: 5 },
  brandContainer: { alignItems: 'center' },
  brandName: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5 },
  underlineSmall: { width: 20, height: 3, backgroundColor: COLORS.accent, borderRadius: 2, marginTop: 2 },
  pointsBadgeHeader: { backgroundColor: COLORS.secondary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  pointsBadgeText: { fontSize: 11, fontWeight: '900', color: COLORS.primary },
  scrollContent: { padding: 20, alignItems: 'center' },
  progressSection: { marginVertical: 20 },
  circleBase: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE/2, borderWidth: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, elevation: 5 },
  circleInner: { alignItems: 'center' },
  circlePercent: { fontSize: 50, fontWeight: '900', color: COLORS.textDark },
  circleSub: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
  carouselContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-between', marginVertical: 20 },
  trophyCard: { width: width * 0.7, backgroundColor: COLORS.white, borderRadius: 25, padding: 25, alignItems: 'center', borderWidth: 2, borderColor: COLORS.border, elevation: 3 },
  imageBox: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  trophyImg: { width: '100%', height: '100%', resizeMode: 'contain' },
  lockContainer: { position: 'absolute', alignItems: 'center' },
  lockCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  lockText: { marginTop: 10, fontWeight: '900', color: COLORS.textLight, fontSize: 12, backgroundColor: COLORS.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  trophyName: { fontSize: 15, fontWeight: '900', color: COLORS.textDark, textAlign: 'center' },
  levelBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 8 },
  levelBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '900' },
  progressBarContainer: { width: '100%', marginTop: 20 },
  progressBarBg: { height: 8, backgroundColor: COLORS.secondary, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressLabel: { fontSize: 11, color: COLORS.textLight, textAlign: 'center', marginTop: 8, fontWeight: '800' },
  rewardsButton: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: 30, paddingVertical: 18, borderRadius: 18, marginTop: 20, alignItems: 'center', width: '100%', justifyContent: 'center' },
  rewardsButtonText: { color: COLORS.white, fontWeight: '900', marginLeft: 10, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 48, 38, 0.85)', justifyContent: 'center', padding: 25 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 30, padding: 30, alignItems: 'center', borderWidth: 3, borderColor: COLORS.primary },
  closeBtn: { position: 'absolute', right: 20, top: 20 },
  modalIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  modalTrophyImg: { width: 80, height: 80, resizeMode: 'contain' },
  modalTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textLight, textTransform: 'uppercase' },
  modalLevelName: { fontSize: 26, fontWeight: '900', marginTop: 5 },
  statBox: { marginTop: 25, padding: 20, backgroundColor: COLORS.secondary, borderRadius: 20, width: '100%', alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: COLORS.primary },
  statLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textLight },
  statValue: { fontSize: 18, fontWeight: '900', color: COLORS.primary, marginTop: 5 },
  modalCloseButton: { backgroundColor: COLORS.primary, width: '100%', padding: 18, borderRadius: 15, marginTop: 25, alignItems: 'center' },
  modalCloseButtonText: { color: COLORS.white, fontWeight: '900', fontSize: 14 }
});