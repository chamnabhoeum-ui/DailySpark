import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TodayScreen from '../screens/TodayScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import AddHabitScreen from '../screens/AddHabitScreen';
import HeaderMenu from '../components/HeaderMenu';

const Stack = createNativeStackNavigator();
export default function TodayStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Today" component={TodayScreen} options={{ headerLeft: () => <HeaderMenu /> }} />
      <Stack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ title: 'Habit' }} />
      <Stack.Screen name="AddHabit" component={AddHabitScreen} options={{ title: 'New Habit', presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
