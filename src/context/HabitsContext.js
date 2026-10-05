import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Ctx = createContext();
export const useHabits = () => useContext(Ctx);
export const ALL = [0, 1, 2, 3, 4, 5, 6];

export const dayKey = (d = new Date()) => {
  const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
};
export const isScheduled = (h, d = new Date()) => (h.days || ALL).includes(new Date(d).getDay());

export const streakOf = (h) => {
  let n = 0; const d = new Date();
  for (let i = 0; i < 400; i++) {
    if (isScheduled(h, d)) {
      if (h.done.includes(dayKey(d))) n++;
      else if (i > 0) break;
    }
    d.setDate(d.getDate() - 1);
  }
  return n;
};

const seed = [
  { id: '1', name: 'Morning Run', icon: '\u{1F3C3}', color: '#0F9D7A', days: ALL, note: '', done: [] },
  { id: '2', name: 'Read 20 min', icon: '\u{1F4D6}', color: '#3B82F6', days: ALL, note: '', done: [] },
  { id: '3', name: 'Drink Water', icon: '\u{1F4A7}', color: '#06B6D4', days: ALL, note: '', done: [] },
];

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(seed);
  useEffect(() => { AsyncStorage.getItem('habits').then(v => v && setHabits(JSON.parse(v))); }, []);
  const save = (next) => { setHabits(next); AsyncStorage.setItem('habits', JSON.stringify(next)); };

  const toggle = (id, key = dayKey()) => save(habits.map(h => h.id !== id ? h :
    { ...h, done: h.done.includes(key) ? h.done.filter(k => k !== key) : [...h.done, key] }));
  const add = (name, icon, extra = {}) => save([...habits,
    { id: String(Date.now()), name, icon, color: '#0F9D7A', days: ALL, note: '', ...extra, done: [] }]);
  const remove = (id) => save(habits.filter(h => h.id !== id));

  return <Ctx.Provider value={{ habits, toggle, add, remove }}>{children}</Ctx.Provider>;
}
