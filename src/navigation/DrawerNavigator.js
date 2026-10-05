import React from 'react';
import { useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();
export default function DrawerNavigator() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  return (
    <Drawer.Navigator screenOptions={{
      drawerType: width >= 700 ? 'permanent' : 'front', // ADAPTIVE: permanent drawer on tablets
      drawerActiveTintColor: colors.accent, drawerStyle: { backgroundColor: colors.surface },
    }}>
      <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false, title: '🔁 DailySpark' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
