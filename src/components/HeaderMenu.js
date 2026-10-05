import React from 'react';
import { Pressable, Text } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function HeaderMenu() {
  const nav = useNavigation(); const { colors } = useTheme();
  return (
    <Pressable onPress={() => nav.dispatch(DrawerActions.openDrawer())} hitSlop={10} style={{ marginRight: 14 }}>
      <Text style={{ fontSize: 24, color: colors.text }}>☰</Text>
    </Pressable>
  );
}
