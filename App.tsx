import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { PointsProvider } from './src/context/PointsContext';
import { ProfileImageProvider } from './src/context/ProfileImageContext';

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

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        // Esta opción quita la barra superior de TODAS las pantallas
        screenOptions={{
          headerShown: false, 
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PointsProvider>
      <ProfileImageProvider>
        <AppNavigator />
      </ProfileImageProvider>
    </PointsProvider>
  );
}