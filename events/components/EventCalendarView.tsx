import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem } from '../types';
import { BORDER, CRIMSON, TEXT_MUTED } from '../eventsTheme';

type Props = {
  events: EventItem[];
  onSelectEvent: (ev: EventItem) => void;
};

export function EventCalendarView({ events, onSelectEvent }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 24));

  const monthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const eventsByDate: Record<string, EventItem[]> = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    events.forEach((ev) => {
      const date = new Date(ev.startISO).toISOString().split('T')[0];
      if (!map[date]) map[date] = [];
      map[date].push(ev);
    });
    return map;
  }, [events]);

  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const days = Array.from({ length: lastDay }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthEvents = useMemo(() => {
    return Object.entries(eventsByDate)
      .filter(([date]) => {
        const d = new Date(date);
        return d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth();
      })
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([, evs]) => evs);
  }, [eventsByDate, currentDate]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.kicker}>Monthly Overview</Text>
      <Text style={styles.title}>Events Calendar</Text>
      <Text style={styles.body}>
        View CSUN events for the selected month. Dots indicate days with events.
      </Text>

      <View style={styles.monthNav}>
        <Pressable onPress={prevMonth} style={styles.monthBtn}>
          <Text style={styles.monthBtnText}>Previous</Text>
        </Pressable>
        <Text style={styles.monthTitle}>{monthName}</Text>
        <Pressable onPress={nextMonth} style={styles.monthBtn}>
          <Text style={styles.monthBtnText}>Next</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Text key={day} style={styles.dow}>
            {day}
          </Text>
        ))}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <View key={`e-${i}`} style={styles.cell} />
        ))}
        {days.map((day) => {
          const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            .toISOString()
            .split('T')[0];
          const dayEvents = eventsByDate[dateStr] || [];
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <View
              key={day}
              style={[
                styles.cell,
                styles.dayCell,
                isToday ? styles.dayToday : null,
              ]}
            >
              <Text style={[styles.dayNum, isToday && { color: CRIMSON }]}>{day}</Text>
              {dayEvents.length > 0 ? (
                <View style={{ gap: 4 }}>
                  {dayEvents.slice(0, 2).map((ev) => {
                    const c = CATEGORY_COLOR_MAP[ev.category] ?? CRIMSON;
                    return (
                      <Pressable
                        key={ev.id}
                        onPress={() => onSelectEvent(ev)}
                        style={[styles.dayEv, { borderColor: `${c}44`, backgroundColor: `${c}22` }]}
                      >
                        <Text style={styles.dayEvText} numberOfLines={1}>
                          {ev.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                  {dayEvents.length > 2 ? (
                    <Text style={styles.more}>+{dayEvents.length - 2} more</Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      <Text style={styles.listKicker}>ALL EVENTS THIS MONTH</Text>
      <View style={{ gap: 10 }}>
        {monthEvents.map((ev) => {
          const c = CATEGORY_COLOR_MAP[ev.category] ?? CRIMSON;
          return (
            <Pressable
              key={ev.id}
              onPress={() => onSelectEvent(ev)}
              style={styles.listRow}
            >
              <View style={[styles.listDot, { backgroundColor: c }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{ev.title}</Text>
                <Text style={styles.listMeta}>
                  {ev.time} · {ev.location}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 8 },
  kicker: {
    fontSize: 9,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: CRIMSON,
    fontWeight: '700',
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 6 },
  body: { fontSize: 13, color: TEXT_MUTED, marginBottom: 16, lineHeight: 20 },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  monthBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  monthBtnText: { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  monthTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  dow: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: CRIMSON,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  cell: {
    width: '14.28%',
    padding: 4,
  },
  dayCell: {
    minHeight: 92,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 8,
  },
  dayToday: {
    backgroundColor: 'rgba(210,32,48,0.12)',
    borderColor: 'rgba(210,32,48,0.28)',
  },
  dayNum: { fontSize: 13, fontWeight: '800', color: '#fff', marginBottom: 6 },
  dayEv: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dayEvText: { fontSize: 9, color: '#fff' },
  more: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
  listKicker: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: CRIMSON,
    marginBottom: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 12,
  },
  listDot: { width: 6, height: 6, borderRadius: 3 },
  listTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2 },
  listMeta: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },
});
