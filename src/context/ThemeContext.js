import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from '../theme/colors';

const Ctx = createContext();
export const useTheme = () => useContext(Ctx);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState('system'); // 'light' | 'dark' | 'system'
  useEffect(() => { AsyncStorage.getItem('mode').then(m => m && setModeState(m)); }, []);
  const setMode = (m) => { setModeState(m); AsyncStorage.setItem('mode', m); };
  const isDark = mode === 'system' ? system === 'dark' : mode === 'dark';
  return <Ctx.Provider value={{ mode, setMode, isDark, colors: isDark ? dark : light }}>{children}</Ctx.Provider>;
}
