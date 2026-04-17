import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { SrcHeader } from '@/studentRec/components/SrcHeader';
import { EventsBannerRN } from '@/studentRec/schedule/EventsBannerRN';
import { WeeklyScheduleRN } from '@/studentRec/schedule/WeeklyScheduleRN';

export default function StudentRecScheduleRoute() {
  return (
    <View style={{ flex: 1 }}>
      <SrcHeader />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              backgroundColor: 'rgba(168,5,50,0.3)',
              borderWidth: 1.5,
              borderColor: 'rgba(168,5,50,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="barbell-outline" size={22} color="#ffb3c1" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.45)',
                letterSpacing: 3,
                fontWeight: '700',
                fontSize: 11,
                textTransform: 'uppercase',
              }}
            >
              Student Recreation Center
            </Text>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 2 }}>
              Group Classes & Events Schedule
            </Text>
          </View>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 21, marginBottom: 20 }}>
          Browse the weekly class schedule, view availability, and add sessions to your personal calendar.
        </Text>

        <View
          style={{
            marginBottom: 20,
            padding: 16,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <EventsBannerRN />
        </View>

        <View
          style={{
            padding: 14,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: 3,
                  fontWeight: '700',
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              >
                Schedule
              </Text>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18, marginTop: 4 }}>Weekly Class Schedule</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>Tap a class</Text>
            </View>
          </View>
          <WeeklyScheduleRN />
        </View>
      </ScrollView>
    </View>
  );
}
