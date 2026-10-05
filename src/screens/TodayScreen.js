import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { dayKey, useHabits } from '../context/HabitsContext';
import HabitRow from '../components/HabitRow';
import HabitDetailView from '../components/HabitDetailView';

export default function TodayScreen({ navigation }) {
  const { colors } = useTheme();
  const { habits } = useHabits();
  const { width } = useWindowDimensions();
  const wide = width >= 700; // ADAPTIVE: tablet = master-detail split view
  const [selId, setSelId] = useState(null);
  const doneCount = habits.filter(h => h.done.includes(dayKey())).length;
  const pct = habits.length ? doneCount / habits.length : 0;

  const prog = useRef(new Animated.Value(0)).current; // ANIMATION: progress bar fill
  useEffect(() => { Animated.timing(prog, { toValue: pct, duration: 400, useNativeDriver: false }).start(); }, [pct]);

  const list = (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{doneCount}/{habits.length} done today</Text>
      <View style={[s.bar, { backgroundColor: colors.line }]}>
        <Animated.View style={[s.fill, { backgroundColor: colors.accent, width: prog.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
      <FlatList data={habits} keyExtractor={h => h.id}
        renderItem={({ item }) => (
          <HabitRow habit={item} selected={wide && selId === item.id}
            onPress={() => wide ? setSelId(item.id) : navigation.navigate('HabitDetail', { id: item.id })} />)}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No habits yet. Tap + to add one.</Text>} />
      <Pressable onPress={() => navigation.navigate('AddHabit')} style={[s.fab, { backgroundColor: colors.accent }]}>
        <Text style={{ color: '#fff', fontSize: 28 }}>+</Text>
      </Pressable>
    </View>
  );
  if (!wide) return list;
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <View style={{ width: '42%' }}>{list}</View>
      <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: colors.line }}>
        <HabitDetailView habit={habits.find(h => h.id === selId)} />
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  bar: { height: 10, borderRadius: 5, marginVertical: 12, overflow: 'hidden' }, fill: { height: 10 },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 4 },
});
