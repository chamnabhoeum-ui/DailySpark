import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { disableReminder, enableReminder, sendTest } from '../notifications';

const HOURS = [8, 12, 18, 20];
const label = (h) => (h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`);
const DENIED = 'Notifications are not allowed (or not supported here). Turn them on in your phone settings and test on a real phone.';

export default function SettingsScreen() {
  const { colors, mode, setMode } = useTheme();
  const [on, setOn] = useState(false);
  const [hour, setHour] = useState(20);

  useEffect(() => {
    AsyncStorage.getItem('reminder').then(v => { if (v) { const r = JSON.parse(v); setOn(r.on); setHour(r.hour); } });
  }, []);
  const save = (o, h) => AsyncStorage.setItem('reminder', JSON.stringify({ on: o, hour: h }));

  const toggle = async (value) => {
    if (value) {
      const ok = await enableReminder(hour);
      if (!ok) return Alert.alert('Notifications off', DENIED);
    } else await disableReminder();
    setOn(value); save(value, hour);
  };
  const pickHour = async (h) => {
    setHour(h); save(on, h);
    if (on) await enableReminder(h);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: colors.muted, marginBottom: 8 }}>Appearance</Text>
      <View style={[s.seg, { backgroundColor: colors.line }]}>
        {['light', 'dark', 'system'].map(m => (
          <Pressable key={m} onPress={() => setMode(m)} style={[s.opt, mode === m && { backgroundColor: colors.accent }]}>
            <Text style={{ color: mode === m ? '#fff' : colors.text, fontWeight: '600', textTransform: 'capitalize' }}>{m}</Text>
          </Pressable>))}
      </View>

      <Text style={{ color: colors.muted, marginTop: 24, marginBottom: 8 }}>Reminders</Text>
      <View style={[s.card, { backgroundColor: colors.surface }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Daily streak reminder</Text>
          <Text style={{ color: colors.muted }}>A notification to keep your streak going</Text>
        </View>
        <Switch value={on} onValueChange={toggle} trackColor={{ true: colors.accent }} />
      </View>
      {on && (
        <View style={s.chips}>
          {HOURS.map(h => (
            <Pressable key={h} onPress={() => pickHour(h)}
              style={[s.chip, { backgroundColor: hour === h ? colors.accent : colors.line }]}>
              <Text style={{ color: hour === h ? '#fff' : colors.text, fontWeight: '600' }}>{label(h)}</Text>
            </Pressable>))}
        </View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  seg: { flexDirection: 'row', borderRadius: 10, padding: 3 },
  opt: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 8 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, gap: 10 },
  chips: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16 },
  test: { marginTop: 20, padding: 12, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
});
