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

  const bounce = () => Animated.sequence([
    Animated.spring(scale, { toValue: 1.3, useNativeDriver: true, speed: 40 }),
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
  ]).start();
  const complete = () => { toggle(habit.id); bounce(); ref.current?.close(); };

  return (
    <Swipeable
      ref={ref}
      onSwipeableLeftOpen={complete} // GESTURE 1: swipe right = complete
      renderLeftActions={() => <View style={[s.act, { backgroundColor: colors.accent, alignItems: 'flex-start' }]}><Text style={s.actTxt}>✓ Done</Text></View>}
      onSwipeableRightOpen={() => remove(habit.id)} // GESTURE 2: swipe left = delete
      renderRightActions={() => <View style={[s.act, { backgroundColor: colors.danger, alignItems: 'flex-end' }]}><Text style={s.actTxt}>Delete</Text></View>}
    >
      <Pressable
        onPress={onPress}
        onLongPress={() => Alert.alert(habit.name, 'What would you like to do?', [ // GESTURE 3: long press menu
          { text: done ? 'Mark not done' : 'Mark done', onPress: complete },
          { text: 'Delete', style: 'destructive', onPress: () => remove(habit.id) },
          { text: 'Cancel', style: 'cancel' }])}
        style={[s.row, { backgroundColor: colors.surface, borderColor: selected ? colors.accent : colors.line }]}
      >
        <Text style={s.icon}>{habit.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={[s.name, { color: colors.text, textDecorationLine: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }]}>{habit.name}</Text>
          <Text style={{ color: colors.muted }}>🔥 {streakOf(habit)} day streak</Text>
        </View>
        <Pressable onPress={complete} hitSlop={10}>
          <Animated.View style={[s.check, { transform: [{ scale }], borderColor: done ? colors.accent : colors.muted, backgroundColor: done ? colors.accent : 'transparent' }]}>
            {done && <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>}
          </Animated.View>
        </Pressable>
      </Pressable>
    </Swipeable>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1.5, marginBottom: 10, gap: 12 },
  icon: { fontSize: 26 }, name: { fontSize: 16, fontWeight: '600' },
  check: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  act: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, borderRadius: 12, marginBottom: 10 },
  actTxt: { color: '#fff', fontWeight: '700' },
});
