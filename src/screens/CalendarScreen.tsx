import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Paleta Nutri U
const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  accent: '#3CB371',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#D1E8D5',
  error: '#FF6B6B'
};

export default function CalendarScreen({ navigation, route }: any) {
  const { doctorName } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const currentMonth = { month: 'Enero', year: '2026', days: 31, startDay: 4 }; 
  const occupiedDays = [13, 14, 20, 25, 29];
  const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  
  const generateCalendarDays = () => {
    const days = [];
    // Días vacíos al inicio del mes
    for (let i = 0; i < currentMonth.startDay; i++) {
      days.push({ day: '', empty: true, occupied: false });
    }
    // Días del mes
    for (let i = 1; i <= currentMonth.days; i++) {
      days.push({ day: i, empty: false, occupied: occupiedDays.includes(i) });
    }
    return days;
  };

  const scheduleAppointment = () => {
    if (!selectedDate) {
      Alert.alert('Atención', 'Por favor selecciona un día disponible.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmAppointment = () => {
    setShowConfirmation(false);
    setTimeout(() => { navigation.navigate('Dashboard'); }, 300);
  };

  const calendarDays = generateCalendarDays();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER UNIFICADO */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>CALENDARIO</Text>
          <View style={styles.underlineSmall} />
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.doctorInfoCard}>
          <Ionicons name="medical" size={20} color={COLORS.primary} />
          <Text style={styles.doctorText}>Cita con: <Text style={styles.bold}>{doctorName}</Text></Text>
        </View>

        <View style={styles.calendarCard}>
          <Text style={styles.monthTitle}>{currentMonth.month} {currentMonth.year}</Text>
          
          <View style={styles.weekDaysContainer}>
            {daysOfWeek.map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayButton,
                  item.empty && styles.emptyDay,
                  item.occupied && styles.occupiedDay,
                  // Solo se aplica el verde si el día NO está vacío y es el seleccionado
                  !item.empty && selectedDate === item.day.toString() && styles.selectedDay
                ]}
                onPress={() => !item.empty && !item.occupied && setSelectedDate(item.day.toString())}
                disabled={item.empty || item.occupied}
              >
                {!item.empty && (
                  <>
                    <Text style={[
                      styles.dayText,
                      item.occupied && styles.occupiedDayText,
                      selectedDate === item.day.toString() && styles.selectedDayText
                    ]}>
                      {item.day}
                    </Text>
                    {item.occupied && <View style={styles.occupiedDot} />}
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.legend}>
           <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: COLORS.primary}]} /><Text style={styles.legendText}>Disponible</Text></View>
           <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#E2E8F0'}]} /><Text style={styles.legendText}>Ocupado</Text></View>
        </View>

        <TouchableOpacity 
          style={[styles.mainButton, !selectedDate && styles.disabledButton]} 
          onPress={scheduleAppointment}
          disabled={!selectedDate}
        >
          <Text style={styles.mainButtonText}>CONFIRMAR CITA</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE CONFIRMACIÓN (SIN IMÁGENES) */}
      <Modal visible={showConfirmation} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.primary} />
            </View>
            <Text style={styles.modalTitle}>¡Cita Confirmada!</Text>
            <Text style={styles.modalText}>
              Tu cita con <Text style={styles.bold}>{doctorName}</Text> ha sido registrada correctamente.
            </Text>
            <View style={styles.modalInfoPill}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              <Text style={styles.modalInfoText}>{selectedDate} de {currentMonth.month}, 2026</Text>
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={confirmAppointment}>
              <Text style={styles.modalButtonText}>ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerIcon: { padding: 5 },
  brandContainer: { alignItems: 'center' },
  brandName: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5 },
  underlineSmall: { width: 20, height: 3, backgroundColor: COLORS.accent, borderRadius: 2, marginTop: 2 },
  placeholder: { width: 40 },

  scrollContent: { padding: 20 },
  doctorInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 20
  },
  doctorText: { marginLeft: 10, fontSize: 14, color: COLORS.textDark, fontWeight: '600' },
  bold: { fontWeight: '900', color: COLORS.primary },

  calendarCard: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: 20
  },
  monthTitle: { fontSize: 20, fontWeight: '900', color: COLORS.primary, textAlign: 'center', marginBottom: 20 },
  weekDaysContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  weekDayText: { width: '14%', textAlign: 'center', fontSize: 12, fontWeight: '900', color: COLORS.textLight },
  
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayButton: {
    width: '14.28%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 12,
  },
  emptyDay: { backgroundColor: 'transparent' }, // Los cuadros de Dom a Mié ahora son invisibles
  occupiedDay: { backgroundColor: '#F1F5F9', opacity: 0.6 },
  selectedDay: { backgroundColor: COLORS.primary },
  dayText: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
  occupiedDayText: { color: '#94A3B8', textDecorationLine: 'line-through' },
  selectedDayText: { color: COLORS.white, fontWeight: '900' },
  occupiedDot: { position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.error },

  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  legendText: { fontSize: 11, fontWeight: '700', color: COLORS.textLight },

  mainButton: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 18, alignItems: 'center' },
  disabledButton: { backgroundColor: '#CBD5E1' },
  mainButtonText: { color: COLORS.white, fontWeight: '900', fontSize: 16, letterSpacing: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(26, 48, 38, 0.8)', justifyContent: 'center', alignItems: 'center', padding: 30 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 30, padding: 30, width: '100%', alignItems: 'center', borderWidth: 3, borderColor: COLORS.primary },
  successIconContainer: { marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 10 },
  modalText: { textAlign: 'center', fontSize: 16, color: COLORS.textLight, lineHeight: 22, marginBottom: 20 },
  modalInfoPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  modalInfoText: { marginLeft: 10, color: COLORS.primary, fontWeight: '800', fontSize: 15 },
  modalButton: { backgroundColor: COLORS.primary, width: '100%', padding: 18, borderRadius: 15, alignItems: 'center' },
  modalButtonText: { color: COLORS.white, fontWeight: '900', fontSize: 14 }
});