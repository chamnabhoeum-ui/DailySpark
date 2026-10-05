import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ctx = createContext();
export const useHabits = () => useContext(Ctx);

export const dayKey = (d = new Date()) => {
  const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
export const streakOf = (h) => {
  let n = 0; const d = new Date();
  if (!h.done.includes(dayKey(d))) d.setDate(d.getDate() - 1);
  while (h.done.includes(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
};

const seed = [
  { id: '1', name: 'Morning Run', icon: '🏃', done: [] },
  { id: '2', name: 'Read 20 min', icon: '📖', done: [] },
  { id: '3', name: 'Drink Water', icon: '💧', done: [] },
];

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(seed);
  useEffect(() => { AsyncStorage.getItem('habits').then(v => v && setHabits(JSON.parse(v))); }, []);
  const save = (next) => { setHabits(next); AsyncStorage.setItem('habits', JSON.stringify(next)); };

  const toggle = (id, key = dayKey()) => save(habits.map(h => h.id !== id ? h :
    { ...h, done: h.done.includes(key) ? h.done.filter(k => k !== key) : [...h.done, key] }));
  const add = (name, icon) => save([...habits, { id: String(Date.now()), name, icon, done: [] }]);
  const remove = (id) => save(habits.filter(h => h.id !== id));

  return <Ctx.Provider value={{ habits, toggle, add, remove }}>{children}</Ctx.Provider>;
}
