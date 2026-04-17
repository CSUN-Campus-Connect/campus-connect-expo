import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { BottomBarOptionalId } from '@/dashboard/bottomBarTypes';
import { isBottomBarOptionalId } from '@/dashboard/bottomBarTypes';

const STORAGE_KEY = 'cc_bottom_bar_slots_v1';

export type BottomBarSlots = {
  slot1: BottomBarOptionalId | null;
  slot2: BottomBarOptionalId | null;
};

const DEFAULT_SLOTS: BottomBarSlots = { slot1: null, slot2: null };

function normalizeSlots(raw: unknown): BottomBarSlots {
  if (raw == null || typeof raw !== 'object') return { ...DEFAULT_SLOTS };
  const o = raw as Record<string, unknown>;
  const s1 = o.slot1;
  const s2 = o.slot2;
  const slot1 = typeof s1 === 'string' && isBottomBarOptionalId(s1) ? s1 : null;
  const slot2 =
    typeof s2 === 'string' && isBottomBarOptionalId(s2) && s2 !== slot1 ? s2 : null;
  return { slot1, slot2 };
}

interface BottomBarContextValue {
  slots: BottomBarSlots;
  setSlots: (next: BottomBarSlots) => Promise<void>;
}

const BottomBarContext = createContext<BottomBarContextValue | null>(null);

export function BottomBarProvider({ children }: { children: ReactNode }) {
  const [slots, setSlotsState] = useState<BottomBarSlots>(DEFAULT_SLOTS);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (!stored) return;
      try {
        const parsed = JSON.parse(stored) as unknown;
        setSlotsState(normalizeSlots(parsed));
      } catch {
        setSlotsState(DEFAULT_SLOTS);
      }
    });
  }, []);

  const setSlots = useCallback(async (next: BottomBarSlots) => {
    const normalized = normalizeSlots(next);
    setSlotsState(normalized);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }, []);

  const value = useMemo(() => ({ slots, setSlots }), [slots, setSlots]);

  return <BottomBarContext.Provider value={value}>{children}</BottomBarContext.Provider>;
}

export function useBottomBar(): BottomBarContextValue {
  const ctx = useContext(BottomBarContext);
  if (!ctx) {
    throw new Error('useBottomBar must be used within BottomBarProvider');
  }
  return ctx;
}
