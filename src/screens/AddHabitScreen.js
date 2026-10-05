import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useHabits } from '../context/HabitsContext';

const ICONS = ['🏃', '📖', '💧', '🧘', '🤸', '🥗'];
export default function AddHabitScreen({ navigation }) {
  const { colors } = useTheme(); const { add } = useHabits();
  const [name, setName] = useState(''); const [icon, setIcon] = useState(ICONS[0]);
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput value={name} onChangeText={setName} placeholder="Habit name" placeholderTextColor={colors.muted}
        style={[s.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.line }]} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {ICONS.map(i => (
          <Pressable key={i} onPress={() => setIcon(i)}
            style={[s.icon, { borderColor: icon === i ? colors.accent : colors.line, backgroundColor: colors.surface }]}>
            <Text style={{ fontSize: 22 }}>{i}</Text>
          </Pressable>))}
      </View>
      <Pressable disabled={!name.trim()} onPress={() => { add(name.trim(), icon); navigation.goBack(); }}
        style={({ pressed }) => [s.btn, { backgroundColor: colors.accent, opacity: !name.trim() ? 0.4 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Save Habit</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  icon: { padding: 8, borderRadius: 10, borderWidth: 2 },
  btn: { padding: 14, borderRadius: 12, alignItems: 'center' },
});
