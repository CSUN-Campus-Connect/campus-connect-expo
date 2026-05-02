import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, Text, UIManager, View } from 'react-native';

import type { ReservationSpace, ServiceModule, TrainerProfile } from '@/studentRec/data/servicesData';
import { resolveSrcImage } from '@/studentRec/utils/imageUri';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  StorefrontRounded: 'storefront-outline',
  FitnessCenterRounded: 'barbell-outline',
  SelfImprovementRounded: 'body-outline',
  SchoolRounded: 'school-outline',
  FavoriteRounded: 'heart-outline',
  EventAvailableRounded: 'calendar-outline',
  LockRounded: 'lock-closed-outline',
  DryRounded: 'water-outline',
  AccessibleRounded: 'accessibility-outline',
};

function ProShopList({ items }: { items: { name: string }[] }) {
  return (
    <View
      style={{
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(59,130,246,0.25)',
        backgroundColor: 'rgba(15,25,50,0.55)',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(59,130,246,0.18)',
          backgroundColor: 'rgba(59,130,246,0.1)',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>Rental Equipment</Text>
        <Text style={{ color: '#93c5fd', fontSize: 11, fontWeight: '700' }}>{items.length} items · Free</Text>
      </View>
      {items.map((item, i) => (
        <View
          key={item.name}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderBottomWidth: i < items.length - 1 ? 1 : 0,
            borderBottomColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <Ionicons name="checkmark-circle" size={14} color="rgba(59,130,246,0.7)" />
          <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{item.name}</Text>
        </View>
      ))}
      <View style={{ padding: 12, backgroundColor: 'rgba(59,130,246,0.06)' }}>
        <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
          Stop by the <Text style={{ color: '#93c5fd', fontWeight: '700' }}>SRC Front Desk</Text> with your CSUN ID to
          check out items.
        </Text>
      </View>
    </View>
  );
}

function TrainerCard({ trainer }: { trainer: TrainerProfile }) {
  const uri = resolveSrcImage(trainer.imageSrc);
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.13)',
        padding: 14,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(168,5,50,0.3)',
          }}
        >
          <Image source={{ uri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{trainer.name}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2 }}>{trainer.role}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 8, lineHeight: 20 }}>
            {trainer.specialties.slice(0, 3).join(' · ')}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SpaceCard({ space }: { space: ReservationSpace }) {
  const [open, setOpen] = useState(false);
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        style={{ padding: 14 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>{space.name}</Text>
            {space.floor ? (
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, marginTop: 4 }}>📍 {space.floor}</Text>
            ) : null}
            {space.capacity ? (
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>👥 {space.capacity}</Text>
            ) : null}
          </View>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={20} color="rgba(255,255,255,0.5)" />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {space.activities.map((a) => (
            <View
              key={a}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: 'rgba(59,130,246,0.2)',
                borderWidth: 1,
                borderColor: 'rgba(59,130,246,0.4)',
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#93c5fd' }}>{a}</Text>
            </View>
          ))}
        </View>
      </Pressable>
      {open ? (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', marginBottom: 8 }}>
            FEATURES
          </Text>
          {space.features.map((f) => (
            <Text key={f} style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 4 }}>
              • {f}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function CPRHighlight({ service }: { service: ServiceModule }) {
  return (
    <View
      style={{
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(244,63,94,0.45)',
        backgroundColor: 'rgba(244,63,94,0.15)',
        marginTop: 12,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(244,63,94,0.22)',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: 'rgba(244,63,94,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="heart" size={22} color="#fda4af" />
          </View>
          <View>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17 }}>American Red Cross Certified</Text>
            <Text style={{ color: 'rgba(255,180,190,0.75)', fontSize: 12, fontWeight: '600' }}>
              CPR · AED · First Aid — One Day
            </Text>
          </View>
        </View>
        {service.cta ? (
          <Pressable
            onPress={() => void WebBrowser.openBrowserAsync(service.cta!.href)}
            style={{
              backgroundColor: '#f43f5e',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 999,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{service.cta.label}</Text>
          </Pressable>
        ) : null}
      </View>
      <View style={{ padding: 16 }}>
        {(service.bullets ?? []).map((b) => (
          <View key={b} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <Ionicons name="checkmark-circle" size={14} color="#fda4af" style={{ marginTop: 2 }} />
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, flex: 1, lineHeight: 20 }}>{b}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ServiceModuleRN({ service }: { service: ServiceModule }) {
  const icon = ICONS[service.iconName] ?? 'fitness-outline';
  const isCPR = service.id === 'cpr-firstaid';

  return (
    <View style={{ paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: `${service.accentColor}22`,
            borderWidth: 1.5,
            borderColor: `${service.accentColor}44`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={24} color={service.accentColor} />
        </View>
        <View style={{ flex: 1, minWidth: 200 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 22 }}>{service.title}</Text>
            {service.badge ? (
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: `${service.accentColor}28`,
                  borderWidth: 1,
                  borderColor: `${service.accentColor}55`,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '800', color: service.accentColor }}>{service.badge}</Text>
              </View>
            ) : null}
          </View>
          <Text style={{ color: service.accentColor, fontSize: 13, fontWeight: '700', fontStyle: 'italic', marginBottom: 8 }}>
            {service.tagline}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 22 }}>{service.description}</Text>
        </View>
        {service.cta && !isCPR ? (
          <Pressable
            onPress={() => void WebBrowser.openBrowserAsync(service.cta!.href)}
            style={{
              backgroundColor: service.accentColor,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>{service.cta.label}</Text>
          </Pressable>
        ) : null}
      </View>

      {isCPR ? <CPRHighlight service={service} /> : null}

      {!isCPR && service.bullets && service.bullets.length > 0 ? (
        <View style={{ marginBottom: 12 }}>
          {service.bullets.map((b) => (
            <View key={b} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: `${service.accentColor}44`,
                  backgroundColor: `${service.accentColor}22`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 2,
                }}
              >
                <Ionicons name="checkmark" size={11} color={service.accentColor} />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, flex: 1, lineHeight: 20 }}>{b}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {service.id === 'pro-shop' && service.rentalItems ? <ProShopList items={service.rentalItems} /> : null}

      {(service.id === 'personal-training' || service.id === 'private-instruction') && service.trainers ? (
        <View style={{ marginTop: 12 }}>
          <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16, marginBottom: 10 }}>
            {service.id === 'personal-training' ? 'Your Personal Trainers' : 'Private Instructors'}
          </Text>
          {service.trainers.map((t) => (
            <TrainerCard key={t.name} trainer={t} />
          ))}
        </View>
      ) : null}

      {service.id === 'reservations' && service.spaces ? (
        <View style={{ marginTop: 12 }}>
          {service.spaces.map((s) => (
            <SpaceCard key={s.name} space={s} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
