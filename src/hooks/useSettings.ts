import { useState, useEffect } from 'react';

export const BG_COLORS = [
  { label: 'cream', value: '#f0ede0' }, // default
  { label: 'green', value: '#e0ede6' },
  { label: 'blue',  value: '#e0eaf0' },
  { label: 'pink',  value: '#f0e0e8' },
] as const;

export type BgColorValue = typeof BG_COLORS[number]['value'];

export interface Settings {
  volume: number;       // 0 to 1
  muted: boolean;
  bgColor: BgColorValue;
  language: 'en';  // | 'fr';
  defaultName: string;
}

const DEFAULT_SETTINGS: Settings = {
  volume: 0.8,
  muted: false,
  bgColor: '#f0ede0',
  language: 'en',
  defaultName: '',
};

const STORAGE_KEY = 'yhtz_settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}