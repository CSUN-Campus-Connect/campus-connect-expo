import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { CourseItem } from '@/academics/shared/constants';
import { catalogUrl, rmpSearchUrl } from '@/academics/shared/utils';

type Props = {
  open: boolean;
  onClose: () => void;
  semesterLabel: string;
  course: CourseItem | null;
};

export function CourseInfoModal({ open, onClose, semesterLabel, course }: Props) {
  const code = course ? `${course.subject.toUpperCase()} ${course.number}` : '';
  const title = course?.title ?? '';
  const professor = course?.professor ?? '';

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View
          style={{
            maxHeight: '88%',
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'hidden',
          }}
        >
          <View style={{ backgroundColor: '#A80532', paddingHorizontal: 20, paddingVertical: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '900', letterSpacing: 2 }}>
                  {semesterLabel}
                </Text>
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 4 }}>
                  {code}
                  {title ? ` — ${title}` : ''}
                </Text>
                {professor ? (
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4 }}>{professor}</Text>
                ) : null}
              </View>
              <Pressable onPress={onClose} hitSlop={12}>
                <Ionicons name="close" size={26} color="rgba(255,255,255,0.9)" />
              </Pressable>
            </View>
          </View>

          <ScrollView style={{ padding: 18 }} keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Units', value: course?.units != null ? String(course.units) : '—' },
                { label: 'Section', value: course?.sectionId ?? '—' },
                { label: 'Mode', value: course?.isOnline ? 'Online' : 'In-Person' },
                { label: 'Location', value: course?.location ?? '—' },
              ].map((s) => (
                <View
                  key={s.label}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    backgroundColor: 'rgba(168,5,50,0.06)',
                    borderWidth: 1,
                    borderColor: 'rgba(168,5,50,0.12)',
                    minWidth: 72,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '900', color: '#A80532' }}>{s.value}</Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: 'rgba(0,0,0,0.55)',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>

            {course?.description ? (
              <View
                style={{
                  padding: 14,
                  borderRadius: 12,
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontWeight: '900', marginBottom: 8, fontSize: 15 }}>Description</Text>
                <Text style={{ color: 'rgba(0,0,0,0.72)', fontSize: 15, lineHeight: 22 }}>{course.description}</Text>
              </View>
            ) : (
              <View
                style={{
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: 'rgba(59,130,246,0.08)',
                  marginBottom: 14,
                }}
              >
                <Text style={{ fontSize: 14, color: 'rgba(0,0,0,0.65)' }}>
                  No catalog description is available for this section yet.
                </Text>
              </View>
            )}

            <View
              style={{
                padding: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(168,5,50,0.05)',
                borderWidth: 1,
                borderColor: 'rgba(168,5,50,0.12)',
                marginBottom: 16,
              }}
            >
              <Text style={{ fontWeight: '900', color: '#A80532', marginBottom: 8, fontSize: 15 }}>Prerequisites</Text>
              <Text style={{ color: 'rgba(0,0,0,0.72)', fontSize: 15 }}>
                {course?.prerequisitesText ?? 'No prerequisite details are listed for this course yet.'}
              </Text>
            </View>

            {professor ? (
              <Pressable
                onPress={() => Linking.openURL(rmpSearchUrl(professor))}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.18)',
                  marginBottom: 10,
                }}
              >
                <Text style={{ fontWeight: '800', color: 'rgba(0,0,0,0.75)', flex: 1 }} numberOfLines={2}>
                  Rate My Professor — {professor}
                </Text>
                <Ionicons name="open-outline" size={18} color="rgba(0,0,0,0.45)" />
              </Pressable>
            ) : null}

            {course ? (
              <Pressable
                onPress={() =>
                  Linking.openURL(catalogUrl(course.subject, `${course.subject}-${course.number}`))
                }
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.18)',
                  marginBottom: 32,
                }}
              >
                <Text style={{ fontWeight: '800', color: 'rgba(0,0,0,0.75)', flex: 1 }} numberOfLines={2}>
                  CSUN Catalog — {code}
                </Text>
                <Ionicons name="open-outline" size={18} color="rgba(0,0,0,0.45)" />
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
