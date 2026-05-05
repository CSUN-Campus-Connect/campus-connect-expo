import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import type { Category } from '@/studentRec/data/sportClubsTypes';

const map: Record<Category, keyof typeof Ionicons.glyphMap> = {
  'Martial Arts': 'hand-left-outline',
  Court: 'tennisball-outline',
  Field: 'football-outline',
  Water: 'water-outline',
  Dance: 'musical-notes-outline',
  Strategy: 'grid-outline',
  Fitness: 'barbell-outline',
  Other: 'trophy-outline',
};

export function CategoryIconRN({ category, size = 14 }: { category: Category; size?: number }) {
  return <Ionicons name={map[category]} size={size} color="#fff" />;
}
