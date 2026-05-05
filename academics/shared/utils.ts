import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SemesterBucket } from './constants';

export function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

export function norm(s: string) {
  return (s ?? '').trim();
}

export function fmt12(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function rmpSearchUrl(profName: string) {
  return `https://www.ratemyprofessors.com/search/professors/1800?q=${encodeURIComponent(profName)}`;
}

export function catalogUrl(department: string, courseCode: string) {
  const dept = department.toLowerCase();
  const code = courseCode.toLowerCase().replace(/\s+/, '-');
  return `https://catalog.csun.edu/academics/${dept}/courses/${code}/`;
}

export function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatTimeShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export async function loadStateAsync(
  key: string
): Promise<{ semesters: SemesterBucket[]; selectedSemesterId: string } | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (!Array.isArray(parsed.semesters)) return null;
    if (typeof parsed.selectedSemesterId !== 'string') return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveStateAsync(
  key: string,
  data: { semesters: SemesterBucket[]; selectedSemesterId: string }
) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}
