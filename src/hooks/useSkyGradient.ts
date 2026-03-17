import { useState, useEffect } from 'react';
import { getTimeOfDay, getSkyGradient, getStatusBarStyle, getTextColor, getSecondaryTextColor, type TimeOfDay } from '../constants/sky';

export function useSkyGradient() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(() => getTimeOfDay(new Date().getHours()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay(new Date().getHours()));
    }, 60_000); // check every minute
    return () => clearInterval(interval);
  }, []);

  return {
    timeOfDay,
    gradient: getSkyGradient(timeOfDay),
    statusBarStyle: getStatusBarStyle(timeOfDay),
    textColor: getTextColor(timeOfDay),
    secondaryTextColor: getSecondaryTextColor(timeOfDay),
    isDark: timeOfDay === 'evening' || timeOfDay === 'night',
  };
}
