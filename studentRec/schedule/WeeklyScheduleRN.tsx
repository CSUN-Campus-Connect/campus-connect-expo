import { Ionicons } from '@expo/vector-icons';
import dayjs, { Dayjs } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import type { WeeklyClass } from '@/studentRec/data/icsData';
import { WEEKLY_CLASSES } from '@/studentRec/data/icsData';

dayjs.extend(isoWeek);

const RED = '#A80532';

const CATEGORY_COLORS: Record<WeeklyClass['category'], { bg: string; text: string }> = {
  cardio: { bg: 'rgba(95, 202, 113, 0.85)', text: '#ffffff' },
  strength: { bg: 'rgba(219, 177, 38, 0.9)', text: '#ffffff' },
  'mind-body': { bg: 'rgba(162, 98, 218, 0.85)', text: '#ffffff' },
  aquatics: { bg: 'rgba(21, 142, 212, 0.85)', text: '#ffffff' },
  dance: { bg: 'rgba(231, 88, 172, 0.85)', text: '#ffffff' },
  hiit: { bg: 'rgba(253, 110, 44, 0.85)', text: '#ffffff' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function fmt12(t: string) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')}${ampm}`;
}

export function WeeklyScheduleRN() {
  const today = dayjs();
  const [weekStart, setWeekStart] = useState<Dayjs>(today.startOf('week'));
  const [added, setAdded] = useState<Set<string>>(new Set());

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')), [weekStart]);
  const isCurrentWeek = weekStart.isSame(today.startOf('week'), 'day');

  const byDay = useMemo(() => {
    const map: Record<number, WeeklyClass[]> = {};
    WEEKLY_CLASSES.forEach((c) => {
      if (!map[c.dayOfWeek]) map[c.dayOfWeek] = [];
      map[c.dayOfWeek].push(c);
    });
    Object.keys(map).forEach((k) => {
      map[Number(k)]!.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    return map;
  }, []);

  const addClass = (cls: WeeklyClass) => {
    setAdded((prev) => new Set(prev).add(cls.id));
    Alert.alert('Saved', `"${cls.name}" added to your schedule.`);
  };

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Pressable
            onPress={() => setWeekStart((w) => w.subtract(1, 'week'))}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={18} color="#fff" />
          </Pressable>
          <Text style={{ fontWeight: '800', color: '#fff', fontSize: 15, minWidth: 180, textAlign: 'center' }}>
            {weekStart.format('MMM D')} – {weekStart.add(6, 'day').format('MMM D, YYYY')}
          </Text>
          <Pressable
            onPress={() => setWeekStart((w) => w.add(1, 'week'))}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-forward" size={18} color="#fff" />
          </Pressable>
        </View>
        {!isCurrentWeek ? (
          <Pressable
            onPress={() => setWeekStart(today.startOf('week'))}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700' }}>Today</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
        {weekDays.map((d, colIdx) => {
          const dow = d.day();
          const classes = byDay[dow] ?? [];
          const isToday = d.isSame(today, 'day');
          return (
            <View
              key={colIdx}
              style={{
                marginBottom: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.1)',
                backgroundColor: isToday ? 'rgba(168,5,50,0.12)' : 'rgba(255,255,255,0.04)',
                padding: 12,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '800', color: isToday ? '#fff' : 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
                  {DAYS[dow]}
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '900', color: isToday ? '#fff' : 'rgba(255,255,255,0.75)' }}>{d.date()}</Text>
                {isToday ? (
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: RED }} />
                ) : null}
              </View>
              {classes.length === 0 ? (
                <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>No classes</Text>
              ) : (
                classes.map((cls) => {
                  const cc = CATEGORY_COLORS[cls.category];
                  const wasAdded = added.has(cls.id);
                  return (
                    <Pressable
                      key={cls.id}
                      onPress={() => addClass(cls)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{cls.name}</Text>
                          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>
                            {fmt12(cls.startTime)} – {fmt12(cls.endTime)} · {cls.instructor}
                          </Text>
                          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>{cls.location}</Text>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 999,
                            backgroundColor: cc.bg,
                          }}
                        >
                          <Text style={{ fontSize: 9, fontWeight: '800', color: cc.text, textTransform: 'capitalize' }}>
                            {cls.category.replace('-', ' ')}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: wasAdded ? '#86efac' : 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 8, fontWeight: '700' }}>
                        {wasAdded ? 'On your schedule ✓' : 'Tap to add to your schedule'}
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
