import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { PointsProvider } from './src/context/PointsContext';
import { ProfileImageProvider } from './src/context/ProfileImageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Pantallas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import PointsScreen from './src/screens/PointsScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MyDietScreen from './src/screens/MyDietScreen';
import MyRoutinesScreen from './src/screens/MyRoutinesScreen';
import CaloriesScreen from './src/screens/CaloriesScreen';
import FoodTrackingScreen from './src/screens/FoodTrackingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PhotoSelectionScreen from './src/screens/PhotoSelectionScreen';

const Stack = createStackNavigator();

// Componente para manejar la navegación basada en autenticación
const AppNavigator = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {session ? (
          // Usuario autenticado
          <>
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Points" component={PointsScreen} />
            <Stack.Screen name="Schedule" component={ScheduleScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="MyDiet" component={MyDietScreen} />
            <Stack.Screen name="MyRoutines" component={MyRoutinesScreen} />
            <Stack.Screen name="Calories" component={CaloriesScreen} />
            <Stack.Screen name="FoodTracking" component={FoodTrackingScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PhotoSelection" component={PhotoSelectionScreen} />
          </>
        ) : (
          // Usuario no autenticado
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* Puedes agregar otras pantallas públicas aquí si es necesario */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PointsProvider>
        <ProfileImageProvider>
          <AppNavigator />
        </ProfileImageProvider>
      </PointsProvider>
    </AuthProvider>
  );
}