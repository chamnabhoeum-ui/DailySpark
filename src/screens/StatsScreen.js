import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { dayKey, useHabits } from '../context/HabitsContext';

export default function StatsScreen() {
  const { colors } = useTheme(); const { habits } = useHabits();
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
  const counts = days.map(d => habits.filter(h => h.done.includes(dayKey(d))).length);
  const max = Math.max(1, habits.length);
  return (
    <View style={{ padding: 16 }}>
      <Text style={[s.h, { color: colors.text }]}>This week</Text>
      <View style={s.bars}>
        {counts.map((c, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ width: '70%', height: Math.max(4, (c / max) * 120), backgroundColor: colors.accent, borderRadius: 6 }} />
            <Text style={{ color: colors.muted, marginTop: 4 }}>{'SMTWTFS'[days[i].getDay()]}</Text>
          </View>))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({ h: { fontSize: 20, fontWeight: '700' }, bars: { flexDirection: 'row', alignItems: 'flex-end', height: 160, marginTop: 20 } });
