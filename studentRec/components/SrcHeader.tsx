import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SRC_RED } from '@/studentRec/constants';

const LOGO = require('../../assets/src/src-logo.png');

const TABS = [
  { label: 'Home', path: '/student-rec' },
  { label: 'Services', path: '/student-rec/services' },
  { label: 'Schedule', path: '/student-rec/schedule' },
  { label: 'Sport Clubs', path: '/student-rec/sport-clubs' },
  { label: 'FitQuest', path: '/student-rec/fit-quest' },
] as const;

function normalizePath(p: string) {
  return p.replace(/\/$/, '') || '/';
}

function tabActive(current: string, tabPath: string): boolean {
  const c = normalizePath(current);
  const t = normalizePath(tabPath);
  if (t === '/student-rec') return c === '/student-rec' || c === '/student-rec/index';
  return c === t || c.startsWith(t + '/');
}

export function SrcHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top, zIndex: 20 }}>
      <View
        style={{
          marginHorizontal: 12,
          marginTop: 6,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 999,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'rgba(255,255,255,0.18)',
          borderWidth: 1.5,
          borderColor: 'rgba(255,255,255,0.7)',
        }}
      >
        <Pressable
          onPress={() => router.push('/dashboard' as never)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.8)',
            backgroundColor: 'rgba(255,255,255,0.15)',
          }}
          accessibilityRole="button"
          accessibilityLabel="Back to dashboard"
        >
          <Ionicons name="chevron-back" size={12} color="#fff" />
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Dashboard</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/student-rec' as never)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}
        >
          <Image source={LOGO} style={{ width: 34, height: 34 }} contentFit="contain" />
          <View style={{ flexShrink: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '900', letterSpacing: 2, color: '#fff' }}>CSUN</Text>
            <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)' }} numberOfLines={1}>
              Student Recreation Center
            </Text>
          </View>
        </Pressable>

        <View style={{ flex: 1 }} />

        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: 'rgba(34,197,94,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(187,247,208,0.4)',
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: '800', letterSpacing: 1, color: '#bbf7d0' }}>● OPEN</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 6 }}
        style={{ maxHeight: 52 }}
      >
        {TABS.map((tab) => {
          const active = tabActive(pathname, tab.path);
          return (
            <Pressable
              key={tab.path}
              onPress={() => router.push(tab.path as never)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1.5,
                borderColor: active ? SRC_RED : 'rgba(255,255,255,0.22)',
                backgroundColor: active ? 'rgba(168,5,50,0.25)' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: active ? '#fff' : 'rgba(255,255,255,0.9)',
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ height: 1, backgroundColor: 'rgba(168,5,50,0.6)', marginHorizontal: 16 }} />
    </View>
  );
}
