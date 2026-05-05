import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

import type { CalEvent } from '@/studentRec/data/icsData';
import { SRC_EVENTS } from '@/studentRec/data/icsData';

dayjs.extend(isBetween);

function isActive(event: CalEvent): boolean {
  const now = dayjs();
  const start = dayjs(event.dtstart);
  const end = dayjs(event.dtend);
  return now.isBetween(start, end, 'day', '[]');
}

export function EventsBannerRN() {
  const [added, setAdded] = useState<Set<string>>(new Set());

  const activeEvents = SRC_EVENTS.filter(isActive);
  const upcomingEvents = SRC_EVENTS.filter((e) => dayjs(e.dtstart).isAfter(dayjs()));
  const displayEvents = [
    ...activeEvents,
    ...upcomingEvents.filter((e) => !activeEvents.includes(e)),
  ];

  function handleAdd(event: CalEvent) {
    setAdded((prev) => new Set(prev).add(event.uid));
    Alert.alert('Saved', `"${event.summary}" added to your events.`);
  }

  if (displayEvents.length === 0) return null;

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Ionicons name="calendar-outline" size={18} color="rgba(255,255,255,0.7)" />
        <Text style={{ fontWeight: '800', color: '#fff', fontSize: 16 }}>Upcoming SRC Events</Text>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{displayEvents.length} events</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 4 }}>
        {displayEvents.map((event) => {
          const active = isActive(event);
          const wasAdded = added.has(event.uid);
          const start = dayjs(event.dtstart);
          const end = dayjs(event.dtend);
          const dateLabel = event.allDay
            ? start.format('MMM D') + (end.diff(start, 'day') > 1 ? ` – ${end.subtract(1, 'day').format('MMM D')}` : '')
            : start.format('MMM D · h:mma');

          return (
            <View
              key={event.uid}
              style={{
                width: 260,
                borderRadius: 12,
                backgroundColor: active ? 'rgba(122,1,33,0.5)' : 'rgba(160,14,55,0.72)',
                borderWidth: 1.5,
                borderColor: active ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                padding: 14,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.75)' }}>{dateLabel}</Text>
                {active ? (
                  <View
                    style={{
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 999,
                      backgroundColor: 'rgba(34,197,94,0.25)',
                      borderWidth: 1,
                      borderColor: 'rgba(34,197,94,0.5)',
                    }}
                  >
                    <Text style={{ fontSize: 9, fontWeight: '800', color: '#86efac' }}>● Active</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ fontWeight: '800', color: '#fff', fontSize: 14, marginBottom: 8 }}>{event.summary}</Text>
              <Text numberOfLines={3} style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18 }}>
                {event.description}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <Pressable
                  onPress={() => handleAdd(event)}
                  disabled={wasAdded}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: wasAdded ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <Ionicons name="add-circle-outline" size={12} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
                    {wasAdded ? 'Added ✓' : 'Add to Events'}
                  </Text>
                </Pressable>
                {event.url ? (
                  <Pressable
                    onPress={() => void WebBrowser.openBrowserAsync(event.url)}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.25)',
                    }}
                  >
                    <Ionicons name="open-outline" size={14} color="rgba(255,255,255,0.85)" />
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
