import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TodayStack from './TodayStack';
import StatsScreen from '../screens/StatsScreen';
import HeaderMenu from '../components/HeaderMenu';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
export default function TabNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.muted }}>
      <Tab.Screen name="TodayTab" component={TodayStack}
        options={{ title: 'Today', headerShown: false, tabBarIcon: () => <Text>🏠</Text> }} />
      <Tab.Screen name="Stats" component={StatsScreen}
        options={{ headerLeft: () => <HeaderMenu />, tabBarIcon: () => <Text>📊</Text> }} />
    </Tab.Navigator>
  );
}

