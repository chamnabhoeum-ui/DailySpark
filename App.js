import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { HabitsProvider } from './src/context/HabitsContext';
import DrawerNavigator from './src/navigation/DrawerNavigator';

function Root() {
  const { colors, isDark } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: colors.bg, card: colors.surface,
    text: colors.text, border: colors.line, primary: colors.accent } };
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <DrawerNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider><HabitsProvider><Root /></HabitsProvider></ThemeProvider>
    </GestureHandlerRootView>
  );
}

import './src/notifications';
