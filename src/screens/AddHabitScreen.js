import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ALL, useHabits } from '../context/HabitsContext';

const ICONS = ['\u{1F3C3}', '\u{1F4D6}', '\u{1F4A7}', '\u{1F9D8}', '\u{1F938}', '\u{1F957}', '\u{1F634}', '\u{1F4BB}', '\u{1F3B8}', '\u{1F9F9}'];
const COLORS = ['#0F9D7A', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
const NAMES = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const PRESETS = [['Every day', ALL], ['Weekdays', [1, 2, 3, 4, 5]], ['Weekends', [0, 6]]];
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));

export default function AddHabitScreen({ navigation }) {
  const { colors } = useTheme(); const { add } = useHabits();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [days, setDays] = useState(ALL);
  const [note, setNote] = useState('');
  const toggleDay = (d) => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);
  const ok = name.trim() && days.length > 0;
  const Label = ({ t }) => <Text style={{ color: colors.muted, marginTop: 16, marginBottom: 6 }}>{t}</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <View style={[s.preview, { backgroundColor: colors.surface }]}>
        <View style={[s.bubble, { backgroundColor: color + '33' }]}><Text style={{ fontSize: 26 }}>{icon}</Text></View>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{name.trim() || 'New habit'}</Text>
      </View>

      <Label t="Name" />
      <TextInput value={name} onChangeText={setName} placeholder="e.g. Stretch 10 min" placeholderTextColor={colors.muted}
        style={[s.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.line }]} />

      <Label t="Icon" />
      <View style={s.wrap}>
        {ICONS.map((i, n) => (
          <Pressable key={n} onPress={() => setIcon(i)}
            style={[s.icon, { borderColor: icon === i ? color : colors.line, backgroundColor: colors.surface }]}>
            <Text style={{ fontSize: 22 }}>{i}</Text>
          </Pressable>))}
      </View>

      <Label t="Color" />
      <View style={s.wrap}>
        {COLORS.map(c => (
          <Pressable key={c} onPress={() => setColor(c)}
            style={[s.dot, { backgroundColor: c, borderWidth: color === c ? 3 : 0, borderColor: colors.text }]} />))}
      </View>

      <Label t="Repeat" />
      <View style={s.wrap}>
        {PRESETS.map(([t, d]) => (
          <Pressable key={t} onPress={() => setDays(d)}
            style={[s.chip, { backgroundColor: same(days, d) ? color : colors.line }]}>
            <Text style={{ color: same(days, d) ? '#fff' : colors.text, fontWeight: '600' }}>{t}</Text>
          </Pressable>))}
      </View>
      <View style={[s.wrap, { marginTop: 8 }]}>
        {NAMES.map((n, d) => (
          <Pressable key={d} onPress={() => toggleDay(d)}
            style={[s.day, { backgroundColor: days.includes(d) ? color : colors.line }]}>
            <Text style={{ color: days.includes(d) ? '#fff' : colors.text, fontWeight: '700' }}>{n}</Text>
          </Pressable>))}
      </View>

      <Label t="Note (optional)" />
      <TextInput value={note} onChangeText={setNote} placeholder="Why this habit matters" placeholderTextColor={colors.muted}
        multiline style={[s.input, { height: 80, textAlignVertical: 'top', backgroundColor: colors.surface, color: colors.text, borderColor: colors.line }]} />

      <Pressable disabled={!ok}
        onPress={() => { add(name.trim(), icon, { color, days, note: note.trim() }); navigation.goBack(); }}
        style={({ pressed }) => [s.btn, { backgroundColor: color, opacity: !ok ? 0.4 : pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Save Habit</Text>
      </Pressable>
    </ScrollView>
  );
}
const s = StyleSheet.create({
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  bubble: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  input: { borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  icon: { padding: 8, borderRadius: 10, borderWidth: 2 },
  dot: { width: 34, height: 34, borderRadius: 17 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16 },
  day: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  btn: { marginTop: 24, padding: 14, borderRadius: 12, alignItems: 'center' },
});
