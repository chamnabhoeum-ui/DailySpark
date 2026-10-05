import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { dayKey, streakOf, useHabits } from '../context/HabitsContext';

function Day({ k, num, on, isToday, onToggle, colors, tint }) {
  const dbl = Gesture.Tap().numberOfTaps(2).maxDelay(500).runOnJS(true)
    .onEnd((_e, success) => { if (success) onToggle(k); });
  return (
    <GestureDetector gesture={dbl}>
      <View style={[s.cell, { backgroundColor: on ? tint : colors.line, borderWidth: isToday ? 2 : 0, borderColor: colors.text }]}>
        <Text style={{ color: on ? '#fff' : colors.muted, fontSize: 12, fontWeight: '600' }}>{num}</Text>
      </View>
    </GestureDetector>
  );
}

export default function HabitDetailView({ habit }) {
  const { colors } = useTheme();
  const { toggle } = useHabits();
  if (!habit) return <View style={s.empty}><Text style={{ color: colors.muted }}>Select a habit</Text></View>;

  const tint = habit.color || colors.accent;
  const sched = habit.days || [0, 1, 2, 3, 4, 5, 6];
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    return { key: dayKey(d), num: d.getDate() };
  });
  const today = dayKey();
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 40 }}>{habit.icon}</Text>
      <Text style={[s.title, { color: colors.text }]}>{habit.name}</Text>
      <View style={[s.card, { backgroundColor: colors.surface }]}>
        <Text style={{ fontSize: 30, color: colors.text, fontWeight: '700' }}>{'\u{1F525}'} {streakOf(habit)}</Text>
        <Text style={{ color: colors.muted }}>Current streak - {habit.done.length} total check-ins</Text>
      </View>
      {habit.note ? <Text style={{ color: colors.text, marginTop: 12 }}>{'\u{1F4DD}'} {habit.note}</Text> : null}
      <Text style={{ color: colors.muted, marginTop: 6 }}>
        Repeats: {sched.length === 7 ? 'Every day' : sched.map(d => 'SMTWTFS'[d]).join(' ')}
      </Text>
      <Text style={{ color: colors.muted, marginVertical: 10 }}>
        Last 28 days. Double tap a day to mark or unmark it. Today has an outline.
      </Text>
      <View style={s.grid}>
        {days.map(d => (
          <Day key={d.key} k={d.key} num={d.num} on={habit.done.includes(d.key)} tint={tint}
            isToday={d.key === today} colors={colors} onToggle={(k) => toggle(habit.id, k)} />
        ))}
      </View>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12 },
  card: { padding: 16, borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  cell: { width: '12%', aspectRatio: 1, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
});
