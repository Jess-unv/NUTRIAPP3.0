import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, StatusBar, TextInput, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#2E8B57',
  secondary: '#F0FFF4',
  accent: '#3CB371',
  textDark: '#1A3026',
  textLight: '#4A4A4A',
  white: '#FFFFFF',
  border: '#D1E8D5',
  danger: '#FF6B6B'
};

export default function MyRoutinesScreen({ navigation }: any) {
  // RF-3: Estado para gestionar el registro de ejercicios
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Sentadillas', sets: '3', reps: '15', duration: '5 min' },
  ]);

  // Estados para el formulario de registro
  const [newName, setNewName] = useState('');
  const [newSets, setNewSets] = useState('');
  const [newReps, setNewReps] = useState('');
  const [newDuration, setNewDuration] = useState('');

  // Función para registrar rutina/ejercicio (RF-3)
  const handleAddExercise = () => {
    if (!newName || !newSets || !newReps) {
      Alert.alert('Atención', 'Por favor completa el nombre, series y repeticiones.');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newName,
      sets: newSets,
      reps: newReps,
      duration: newDuration || 'N/A',
    };

    setExercises([...exercises, newItem]);
    // Limpiar formulario
    setNewName(''); setNewSets(''); setNewReps(''); setNewDuration('');
  };

  const deleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>MI REGISTRO</Text>
          <View style={styles.underlineSmall} />
        </View>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heroSection}>
            <Text style={styles.mainTitle}>Gestión de Rutina</Text>
            <Text style={styles.subtitle}>Crea y organiza tus ejercicios diarios</Text>
          </View>

          {/* FORMULARIO DE REGISTRO (Implementación RF-3) */}
          <View style={styles.registrationCard}>
            <Text style={styles.cardHeaderTitle}>Nuevo Ejercicio</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Nombre del ejercicio (ej. Flexiones)" 
              value={newName}
              onChangeText={setNewName}
            />
            
            <View style={styles.rowInputs}>
              <TextInput 
                style={[styles.input, { flex: 1, marginRight: 10 }]} 
                placeholder="Series (ej. 3)" 
                keyboardType="numeric"
                value={newSets}
                onChangeText={setNewSets}
              />
              <TextInput 
                style={[styles.input, { flex: 1 }]} 
                placeholder="Reps (ej. 12)" 
                keyboardType="numeric"
                value={newReps}
                onChangeText={setNewReps}
              />
            </View>

            <TextInput 
              style={styles.input} 
              placeholder="Duración estimada (opcional, ej. 10 min)" 
              value={newDuration}
              onChangeText={setNewDuration}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
              <Ionicons name="add-circle" size={20} color={COLORS.white} />
              <Text style={styles.addButtonText}>REGISTRAR EJERCICIO</Text>
            </TouchableOpacity>
          </View>

          {/* LISTA DE EJERCICIOS REGISTRADOS */}
          <Text style={styles.sectionHeader}>MI RUTINA ACTUAL</Text>
          
          {exercises.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No hay ejercicios registrados hoy.</Text>
            </View>
          ) : (
            exercises.map((item) => (
              <View key={item.id} style={styles.exerciseCard}>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{item.name}</Text>
                  <Text style={styles.exerciseDetails}>
                    {item.sets} Series × {item.reps} Reps • {item.duration}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteExercise(item.id)}>
                  <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))
          )}

          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerIcon: { padding: 5 },
  brandContainer: { alignItems: 'center' },
  brandName: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5 },
  underlineSmall: { width: 20, height: 3, backgroundColor: COLORS.accent, borderRadius: 2, marginTop: 2 },
  placeholder: { width: 40 },

  scrollView: { flex: 1, paddingHorizontal: 20 },
  heroSection: { marginVertical: 20 },
  mainTitle: { fontSize: 24, fontWeight: '900', color: COLORS.textDark },
  subtitle: { fontSize: 13, color: COLORS.textLight, fontWeight: '600' },

  registrationCard: {
    backgroundColor: COLORS.white,
    padding: 20, borderRadius: 25,
    borderWidth: 2, borderColor: COLORS.border,
    marginBottom: 25, elevation: 3
  },
  cardHeaderTitle: { fontSize: 16, fontWeight: '900', color: COLORS.primary, marginBottom: 15 },
  input: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 15, paddingVertical: 12,
    borderRadius: 12, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
    fontSize: 14, color: COLORS.textDark, fontWeight: '600'
  },
  rowInputs: { flexDirection: 'row' },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 15, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 5
  },
  addButtonText: { color: COLORS.white, fontWeight: '900', marginLeft: 8, fontSize: 14 },

  sectionHeader: { fontSize: 12, fontWeight: '900', color: COLORS.primary, letterSpacing: 2, marginBottom: 15 },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 18, borderRadius: 20,
    alignItems: 'center', marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 16, fontWeight: '900', color: COLORS.textDark },
  exerciseDetails: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 2 },
  
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.textLight, fontWeight: '600', fontStyle: 'italic' },
  spacer: { height: 40 }
});