import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView,
  Image, Modal, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Alert
} from 'react-native';
import { usePoints } from '../context/PointsContext';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  accent: '#3CB371',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#D1E8D5',
  kcalBar: '#FF7043',
  ptsBar: '#42A5F5',
  disabled: '#E0E0E0'
};

const DIET_PLAN = [
  { id: '1', name: 'Huevo con Espinaca', category: 'Desayuno', max: 150, unit: 'g', kcalPerUnit: 1.5, pts: 2, nutrient: 'Proteína', uri: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300' },
  { id: '2', name: 'Avena con Frutos', category: 'Desayuno', max: 200, unit: 'g', kcalPerUnit: 0.7, pts: 2, nutrient: 'Fibra', uri: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=300' },
  { id: '3', name: 'Yogurt Griego Natural', category: 'Desayuno', max: 150, unit: 'g', kcalPerUnit: 0.6, pts: 1, nutrient: 'Probióticos', uri: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300' },
  { id: '4', name: 'Manzana Verde', category: 'Intermedio 1', max: 2, unit: 'pz', kcalPerUnit: 52, pts: 1, nutrient: 'Fibra', uri: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=300' },
  { id: '5', name: 'Plátano Dominico', category: 'Intermedio 1', max: 1, unit: 'pz', kcalPerUnit: 90, pts: 1, nutrient: 'Potasio', uri: 'https://images.unsplash.com/photo-1571771894821-ad9958a35c47?w=300' },
  { id: '6', name: 'Nueces de Castilla', category: 'Intermedio 1', max: 30, unit: 'g', kcalPerUnit: 6.5, pts: 1, nutrient: 'Grasas Omega', uri: 'https://images.unsplash.com/photo-1543208918-0570b8849320?w=300' },
  { id: '7', name: 'Salmón a la Plancha', category: 'Comida', max: 180, unit: 'g', kcalPerUnit: 2.0, pts: 3, nutrient: 'Omega 3', uri: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300' },
  { id: '8', name: 'Pechuga de Pollo', category: 'Comida', max: 200, unit: 'g', kcalPerUnit: 1.6, pts: 3, nutrient: 'Proteína Magra', uri: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300' },
  { id: '9', name: 'Ensalada Mixta', category: 'Comida', max: 300, unit: 'g', kcalPerUnit: 0.2, pts: 1, nutrient: 'Vitaminas', uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300' },
  { id: '10', name: 'Barrita de Cereal', category: 'Intermedio 2', max: 1, unit: 'pz', kcalPerUnit: 120, pts: 1, nutrient: 'Energía', uri: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300' },
  { id: '11', name: 'Gelatina Light', category: 'Intermedio 2', max: 120, unit: 'g', kcalPerUnit: 0.1, pts: 1, nutrient: 'Hidratación', uri: 'https://images.unsplash.com/photo-1559154619-38b814df3568?w=300' },
  { id: '12', name: 'Tacos de Lechuga', category: 'Cena', max: 3, unit: 'pz', kcalPerUnit: 45, pts: 2, nutrient: 'Proteína Ligera', uri: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=300' },
  { id: '13', name: 'Té de Manzanilla', category: 'Cena', max: 1, unit: 'pz', kcalPerUnit: 2, pts: 0, nutrient: 'Digestión', uri: 'https://images.unsplash.com/photo-1544787210-2211d6e90920?w=300' },
];

const SCHEDULES = ['Desayuno', 'Intermedio 1', 'Comida', 'Intermedio 2', 'Cena'];
const CALORIE_GOAL = 2000;
const POINTS_GOAL = 20;

export default function NutriUApp({ navigation }: any) {
  const { todayPoints, addPoints, addFoodToHistory, foodHistory } = usePoints();
  const [viewMode, setViewMode] = useState('registro');
  const [activeCat, setActiveCat] = useState('Desayuno');
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [historyPeriod, setHistoryPeriod] = useState('Hoy');

  const stats = useMemo(() => {
    const totalKcal = foodHistory.reduce((acc, curr) => acc + (curr.kcal || 0), 0);
    return {
      totalKcal,
      kcalProgress: (totalKcal / CALORIE_GOAL) * 100,
      pointsProgress: (todayPoints / POINTS_GOAL) * 100,
      remainingKcal: Math.max(CALORIE_GOAL - totalKcal, 0)
    };
  }, [foodHistory, todayPoints]);

  const handleAmountChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '');
    if (cleanText === '') { setAmount(''); return; }
    const numericValue = parseInt(cleanText);
    if (numericValue > selectedFood?.max) {
      setAmount(selectedFood.max.toString());
    } else {
      setAmount(numericValue.toString());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>REGISTRO</Text>
          <View style={styles.underlineSmall} />
        </View>
        <View style={styles.pointsPill}>
          <Text style={styles.pointsVal}>{todayPoints} PTS</Text>
        </View>
      </View>

      <View style={styles.navBar}>
        {['registro', 'historial', 'progreso'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setViewMode(tab)} 
            style={[styles.navItem, viewMode === tab && styles.navItemActive]}
          >
            <Text style={[styles.navText, viewMode === tab && styles.navTextActive]}>{tab.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'registro' && (
        <>
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {SCHEDULES.map(cat => (
                <TouchableOpacity key={cat} onPress={() => setActiveCat(cat)} style={[styles.catChip, activeCat === cat && styles.catChipActive]}>
                  <Text style={[styles.catChipText, activeCat === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <FlatList
            data={DIET_PLAN.filter(f => f.category === activeCat)}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => {
              const isAlreadyRegistered = foodHistory.some(h => h.food.id === item.id);
              return (
                <TouchableOpacity 
                  style={[styles.foodCard, isAlreadyRegistered && { opacity: 0.6, backgroundColor: COLORS.disabled }]} 
                  onPress={() => {
                    if (!isAlreadyRegistered) {
                      setSelectedFood(item); 
                      setAmount('');
                    } else {
                      Alert.alert("Bloqueado", "Este alimento ya ha sido registrado hoy.");
                    }
                  }}
                  disabled={isAlreadyRegistered}
                >
                  <Image source={{ uri: item.uri }} style={styles.foodImg} />
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={[styles.nutrientText, isAlreadyRegistered && { color: COLORS.textLight }]}>
                      {isAlreadyRegistered ? 'Consumido' : `Máx: ${item.max} ${item.unit}`}
                    </Text>
                  </View>
                  {isAlreadyRegistered ? (
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                  ) : (
                    <View style={styles.ptsBadge}><Text style={styles.ptsText}>+{item.pts} pts</Text></View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      {viewMode === 'historial' && (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ padding: 20 }}>
            <View style={styles.periodSelector}>
              {['Hoy', 'Semana', 'Mes'].map(p => (
                <TouchableOpacity key={p} onPress={() => setHistoryPeriod(p)} style={[styles.periodBtn, historyPeriod === p && styles.periodBtnActive]}>
                  <Text style={[styles.periodBtnText, historyPeriod === p && styles.periodBtnTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {historyPeriod === 'Hoy' ? (
              SCHEDULES.map(sched => {
                const meals = foodHistory.filter(h => h.food?.category === sched);
                if (meals.length === 0) return null;
                return (
                  <View key={sched} style={styles.hGroup}>
                    <Text style={styles.hGroupTitle}>{sched.toUpperCase()}</Text>
                    {meals.map((h, i) => (
                      <View key={i} style={styles.hItem}>
                        <View style={{flex: 1}}>
                          <Text style={styles.hName}>{h.food?.name}</Text>
                          <Text style={styles.hSub}>{h.grams}{h.food?.unit} • {h.kcal.toFixed(0)} kcal</Text>
                        </View>
                        <Text style={styles.hPointsText}>+{h.points} pts</Text>
                      </View>
                    ))}
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="stats-chart-outline" size={50} color={COLORS.border} />
                <Text style={styles.emptyText}>Sin registros en {historyPeriod}.</Text>
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.bottomExportBtn} onPress={() => Alert.alert("Exportar", "Generando documento...")}>
            <Text style={styles.exportBtnText}>EXPORTAR DATOS</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewMode === 'progreso' && (
        <ScrollView style={{ padding: 20 }}>
          <View style={styles.graphCard}>
            <Text style={styles.graphLabel}>CALORÍAS DIARIAS</Text>
            <View style={styles.mainGraphContainer}>
               <View style={styles.barContainer}>
                  <View style={[styles.barValue, { height: `${Math.min(stats.kcalProgress, 100)}%`, backgroundColor: COLORS.kcalBar }]} />
               </View>
               <View style={styles.graphInfo}>
                  <Text style={styles.infoVal}>{stats.totalKcal.toFixed(0)} kcal</Text>
                  <Text style={styles.infoSub}>Consumo Actual</Text>
                  {/* AQUÍ ESTABA EL ERROR: Cambiado div por View */}
                  <View style={styles.divider} /> 
                  <Text style={styles.infoVal}>{CALORIE_GOAL} kcal</Text>
                  <Text style={styles.infoSub}>Meta Diaria</Text>
               </View>
            </View>
            <View style={styles.pointsGraphRow}>
               <View style={{flex: 1}}>
                  <Text style={styles.graphLabel}>PUNTOS ACUMULADOS</Text>
                  <View style={styles.horizontalBarBg}>
                     <View style={[styles.horizontalBarFill, { width: `${Math.min(stats.pointsProgress, 100)}%`, backgroundColor: COLORS.ptsBar }]} />
                  </View>
               </View>
               <View style={styles.ptsCircle}>
                  <Text style={styles.ptsCircleText}>{todayPoints}</Text>
               </View>
            </View>
            <View style={styles.comparisonNote}>
               <Text style={styles.noteText}>Te faltan {stats.remainingKcal.toFixed(0)} kcal para alcanzar tu límite diario.</Text>
            </View>
          </View>
        </ScrollView>
      )}

      <Modal transparent visible={!!selectedFood} animationType="slide">
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{width: '100%'}}>
            <View style={styles.sheet}>
              <Text style={styles.sheetName}>{selectedFood?.name}</Text>
              <Text style={styles.sheetLimit}>LÍMITE PERMITIDO: {selectedFood?.max} {selectedFood?.unit}</Text>
              <View style={styles.inputArea}>
                <TextInput 
                  style={styles.inputMassive} 
                  keyboardType="numeric" 
                  value={amount} 
                  onChangeText={handleAmountChange} 
                  placeholder="0"
                  autoFocus
                />
                <Text style={styles.unitSmall}>{selectedFood?.unit.toUpperCase()}</Text>
              </View>
              <View style={styles.kcalPreviewBox}>
                 <Text style={styles.kcalPreviewText}>Cálculo: {(Number(amount) * (selectedFood?.kcalPerUnit || 0)).toFixed(0)} kcal</Text>
              </View>
              <TouchableOpacity 
                style={[styles.btnConfirm, !amount && { backgroundColor: COLORS.border }]} 
                disabled={!amount}
                onPress={() => {
                  const calculatedKcal = parseInt(amount) * selectedFood.kcalPerUnit;
                  addPoints(selectedFood.pts);
                  addFoodToHistory({ id: Date.now(), food: selectedFood, grams: parseInt(amount), points: selectedFood.pts, kcal: calculatedKcal });
                  setSelectedFood(null);
                }}>
                <Text style={styles.btnText}>CONFIRMAR REGISTRO</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedFood(null)} style={styles.btnCancel}>
                <Text style={styles.btnCancelText}>CERRAR</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  brandName: { fontSize: 22, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  underlineSmall: { width: 30, height: 4, backgroundColor: COLORS.accent, borderRadius: 2, marginTop: 2 },
  pointsPill: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  pointsVal: { fontWeight: '900', color: COLORS.white, fontSize: 13 },
  navBar: { flexDirection: 'row', marginHorizontal: 20, marginTop: 20, backgroundColor: COLORS.white, borderRadius: 15, padding: 5, elevation: 2 },
  navItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  navItemActive: { backgroundColor: COLORS.primary },
  navText: { fontWeight: '800', color: COLORS.textLight, fontSize: 10 },
  navTextActive: { color: COLORS.white },
  filterBar: { marginTop: 15 },
  catChip: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 11, fontWeight: '800', color: COLORS.primary },
  catChipTextActive: { color: COLORS.white },
  foodCard: { flexDirection: 'row', backgroundColor: COLORS.white, marginHorizontal: 20, padding: 15, borderRadius: 20, marginBottom: 12, alignItems: 'center', elevation: 1 },
  foodImg: { width: 55, height: 55, borderRadius: 12 },
  foodName: { fontSize: 16, fontWeight: '800', color: COLORS.textDark },
  nutrientText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  ptsBadge: { backgroundColor: COLORS.secondary, padding: 8, borderRadius: 10 },
  ptsText: { fontWeight: '900', color: COLORS.primary },
  periodSelector: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 12, padding: 4, marginBottom: 20 },
  periodBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  periodBtnActive: { backgroundColor: COLORS.primary },
  periodBtnText: { fontSize: 11, fontWeight: '700', color: COLORS.textLight },
  periodBtnTextActive: { color: COLORS.white },
  hGroup: { marginBottom: 20 },
  hGroupTitle: { fontSize: 11, fontWeight: '900', color: COLORS.primary, marginBottom: 8, letterSpacing: 1 },
  hItem: { flexDirection: 'row', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 6 },
  hName: { fontWeight: '800', fontSize: 14 },
  hSub: { fontSize: 11, color: COLORS.textLight },
  hPointsText: { fontWeight: '900', color: COLORS.primary },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: COLORS.textLight, marginTop: 10, fontWeight: '600' },
  bottomExportBtn: { backgroundColor: COLORS.primary, padding: 18, alignItems: 'center', margin: 20, borderRadius: 15 },
  exportBtnText: { color: COLORS.white, fontWeight: '900', letterSpacing: 1 },
  graphCard: { backgroundColor: COLORS.white, padding: 25, borderRadius: 30, elevation: 3 },
  graphLabel: { fontSize: 12, fontWeight: '900', color: COLORS.textLight, marginBottom: 15, letterSpacing: 1 },
  mainGraphContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  barContainer: { width: 40, height: 150, backgroundColor: COLORS.secondary, borderRadius: 20, overflow: 'hidden', justifyContent: 'flex-end' },
  barValue: { width: '100%', borderRadius: 20 },
  graphInfo: { flex: 1, marginLeft: 30 },
  infoVal: { fontSize: 24, fontWeight: '900', color: COLORS.textDark },
  infoSub: { fontSize: 11, color: COLORS.textLight, fontWeight: '700', marginBottom: 10 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  pointsGraphRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  horizontalBarBg: { height: 12, backgroundColor: COLORS.secondary, borderRadius: 6, marginTop: 8 },
  horizontalBarFill: { height: '100%', borderRadius: 6 },
  ptsCircle: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 25, marginLeft: 20, justifyContent: 'center', alignItems: 'center' },
  ptsCircleText: { color: COLORS.white, fontWeight: '900', fontSize: 18 },
  comparisonNote: { marginTop: 25, padding: 15, backgroundColor: COLORS.secondary, borderRadius: 12 },
  noteText: { fontSize: 12, color: COLORS.primary, fontWeight: '800', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, alignItems: 'center' },
  sheetName: { fontSize: 22, fontWeight: '900', color: COLORS.textDark },
  sheetLimit: { fontSize: 12, color: COLORS.primary, fontWeight: '800', marginTop: 5 },
  inputArea: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 30 },
  inputMassive: { fontSize: 70, fontWeight: '900', color: COLORS.primary },
  unitSmall: { fontSize: 20, fontWeight: '700', marginLeft: 10, color: COLORS.textLight },
  kcalPreviewBox: { marginBottom: 20, padding: 10, backgroundColor: COLORS.secondary, borderRadius: 10 },
  kcalPreviewText: { fontWeight: '900', color: COLORS.primary },
  btnConfirm: { width: '100%', backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: COLORS.white, fontWeight: '900' },
  btnCancel: { marginTop: 15 },
  btnCancelText: { color: COLORS.textLight, fontWeight: '700' }
});