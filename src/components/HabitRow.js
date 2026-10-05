import React, { useRef } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '../context/ThemeContext';
import { dayKey, streakOf, useHabits } from '../context/HabitsContext';

export default function HabitRow({ habit, onPress, selected }) {
  const { colors } = useTheme();
  const { toggle, remove } = useHabits();
  const ref = useRef(null);
  const scale = useRef(new Animated.Value(1)).current;
  const done = habit.done.includes(dayKey());
  const tint = habit.color || colors.accent;

  const bounce = () => Animated.sequence([
    Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 40 }),
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
  ]).start();
  const complete = () => { toggle(habit.id); bounce(); ref.current?.close(); };

  return (
    <Swipeable
      ref={ref}
      onSwipeableLeftOpen={complete}
      renderLeftActions={() => <View style={[s.act, { backgroundColor: colors.accent, alignItems: 'flex-start' }]}><Text style={s.actTxt}>{'\u2713 Done'}</Text></View>}
      onSwipeableRightOpen={() => remove(habit.id)}
      renderRightActions={() => <View style={[s.act, { backgroundColor: colors.danger, alignItems: 'flex-end' }]}><Text style={s.actTxt}>Delete</Text></View>}
    >
      <Pressable
        onPress={onPress}
        onLongPress={() => Alert.alert(habit.name, 'What would you like to do?', [
          { text: done ? 'Mark not done' : 'Mark done', onPress: complete },
          { text: 'Delete', style: 'destructive', onPress: () => remove(habit.id) },
          { text: 'Cancel', style: 'cancel' }])}
        style={[s.row, { backgroundColor: colors.surface, borderColor: selected ? colors.accent : colors.line }]}
      >
        <View style={[s.bubble, { backgroundColor: tint + '33' }]}><Text style={s.icon}>{habit.icon}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: colors.text, textDecorationLine: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }]}>{habit.name}</Text>
          <Text style={{ color: colors.muted }}>{'\u{1F525}'} {streakOf(habit)} day streak</Text>
        </View>
        <Pressable onPress={complete} hitSlop={10}>
          <Animated.View style={[s.check, { transform: [{ scale }], borderColor: done ? tint : colors.muted, backgroundColor: done ? tint : 'transparent' }]}>
            {done && <Text style={{ color: '#fff', fontWeight: '700' }}>{'\u2713'}</Text>}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Swipeable>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, marginBottom: 10, gap: 12 },
  bubble: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 24 }, name: { fontSize: 16, fontWeight: '600' },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  act: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 12, marginBottom: 10 },
  actTxt: { color: '#fff', fontWeight: '700' },
});
