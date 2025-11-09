import type { ReactNode } from 'react';

export type ScreenID = 'homeScreen' | 'mainCalculatorScreen' | 'reportScreen' | 'historyScreen' | 'trainingScreen';

export const locationValues = ["abb1", "abb2", "omra_ext", "mallik_ext", "omra_ss", "safa_malik_ss", "qrarah_ss"] as const;
export type LocationValue = typeof locationValues[number];

export type ShiftValue = 'Shift-A' | 'Shift-B' | 'Shift-C';
export type VoltageValue = '13800' | '400';

export interface LoadData {
  abb1: number;
  abb2: number;
  omra_ext: number;
  mallik_ext: number;
  omra_ss: number;
  safa_malik_ss: number;
  qrarah_ss: number;
}

export interface OptionType<T> {
  value: T;
  label: string;
}

export interface NavItem {
    id: ScreenID | 'updates';
    icon: ReactNode;
    label: string;
    action: 'navigate' | 'open_url';
    target: ScreenID | string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  location: LocationValue;
  currents: number[];
  kva: number;
  voltage: VoltageValue;
}

export interface AppContextType {
    activeScreen: ScreenID;
    setActiveScreen: (screenId: ScreenID) => void;
    shift: ShiftValue;
    setShift: (shift: ShiftValue) => void;
    loadData: LoadData;
    cumulativeKVA: number;
    history: HistoryEntry[];
    addOrUpdateCalculation: (location: LocationValue, currents: number[], voltage: VoltageValue, entryId?: string) => void;
    clearAll: () => void;
    editTarget: HistoryEntry | null;
    setEditTarget: (entry: HistoryEntry | null) => void;
}
