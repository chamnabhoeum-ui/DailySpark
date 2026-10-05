import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false,
  }),
});

const ID = 'daily-reminder';

async function ensurePermission() {
  if (Platform.OS === 'web') return false;
  let { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') status = (await Notifications.requestPermissionsAsync()).status;
  if (status === 'granted' && Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Daily reminder', importance: Notifications.AndroidImportance.HIGH });
  }
  return status === 'granted';
}

export async function enableReminder(hour) {
  if (!(await ensurePermission())) return false;
  await Notifications.cancelScheduledNotificationAsync(ID).catch(() => {});
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: { title: 'DailySpark ??', body: "Complete today's habits to keep your streak alive!" },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute: 0, channelId: 'reminders' },
  });
  return true;
}

export const disableReminder = () => Notifications.cancelScheduledNotificationAsync(ID).catch(() => {});

export async function sendTest() {
  if (!(await ensurePermission())) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'DailySpark ??', body: 'Test: keep your streak alive!' },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5, channelId: 'reminders' },
  });
  return true;
}
