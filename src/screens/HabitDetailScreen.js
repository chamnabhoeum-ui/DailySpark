import React from 'react';
import { useHabits } from '../context/HabitsContext';
import HabitDetailView from '../components/HabitDetailView';

export default function HabitDetailScreen({ route }) {
  const { habits } = useHabits();
  return <HabitDetailView habit={habits.find(h => h.id === route.params.id)} />;
}
