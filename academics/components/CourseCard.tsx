import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import type { CardColorValue, CourseItem } from '@/academics/shared/constants';
import { CARD_COLORS } from '@/academics/shared/constants';
import { fmt12 } from '@/academics/shared/utils';

const EXTRA_CARD_COLORS = [
  { value: 'sky' as const, label: 'Sky', accent: '#2563eb', border: 'rgba(37,99,235,0.28)', bg: 'rgba(37,99,235,0.06)' },
  { value: 'violet' as const, label: 'Violet', accent: '#7c3aed', border: 'rgba(124,58,237,0.26)', bg: 'rgba(124,58,237,0.06)' },
  { value: 'teal' as const, label: 'Teal', accent: '#0f766e', border: 'rgba(15,118,110,0.26)', bg: 'rgba(15,118,110,0.06)' },
  { value: 'amber' as const, label: 'Amber', accent: '#b45309', border: 'rgba(180,83,9,0.26)', bg: 'rgba(180,83,9,0.06)' },
] as const;

const ALL = [...CARD_COLORS, ...EXTRA_CARD_COLORS] as const;

type Props = {
  course: CourseItem;
  onOpenInfo: () => void;
  onColorChange: (color: CardColorValue) => void;
};

export function CourseCard({ course, onOpenInfo, onColorChange }: Props) {
  const [pickerOpen, setPickerOpen] = React.useState(false);

  const code = `${course.subject.toUpperCase()} ${course.number}`;
  const title = course.title || 'Course title';
  const professor = course.professor || 'TBA';

  const totalAssignments = course.assignments?.length ?? 0;
  const completedAssignments = course.assignments?.filter((a) => a.completed).length ?? 0;
  const pendingAssignments = totalAssignments - completedAssignments;
  const progress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  const scheduleStr = course.isOnline
    ? 'Online'
    : course.days?.length
      ? `${course.days.join('/')} · ${fmt12(course.startTime ?? '')}–${fmt12(course.endTime ?? '')}`
      : null;

  const colorDef =
    ALL.find((c) => c.value === (course.cardColor ?? 'default')) ?? ALL[0];

  return (
    <View
      style={{
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: colorDef.bg,
        borderWidth: 1.5,
        borderColor: colorDef.border,
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 10,
        width: '100%',
      }}
    >
      <View style={{ width: 3, borderRadius: 999, backgroundColor: colorDef.accent, minHeight: 48 }} />

      <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontWeight: '900', fontSize: 11, color: colorDef.accent, letterSpacing: 1.2 }}>{code}</Text>
          {course.units != null ? (
            <View
              style={{
                paddingHorizontal: 6,
                paddingVertical: 1,
                borderRadius: 4,
                backgroundColor: colorDef.accent + '18',
              }}
            >
              <Text style={{ fontSize: 9, fontWeight: '900', color: colorDef.accent }}>{course.units}u</Text>
            </View>
          ) : null}
        </View>
        <Text style={{ fontWeight: '800', fontSize: 14, color: '#1a1a2e' }} numberOfLines={2}>
          {title}
        </Text>
        <Text style={{ color: 'rgba(0,0,0,0.50)', fontSize: 12 }}>{professor}</Text>

        {scheduleStr ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons
              name={course.isOnline ? 'laptop-outline' : 'time-outline'}
              size={12}
              color="rgba(0,0,0,0.40)"
            />
            <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.55)', flex: 1 }} numberOfLines={1}>
              {scheduleStr}
            </Text>
          </View>
        ) : null}

        {course.location && !course.isOnline ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="location-outline" size={12} color="rgba(0,0,0,0.35)" />
            <Text style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)' }}>{course.location}</Text>
          </View>
        ) : null}

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.50)', textTransform: 'uppercase' }}>
            Tasks
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: '900',
              color: progress === 100 ? '#16a34a' : colorDef.accent,
            }}
          >
            {completedAssignments}/{totalAssignments}
          </Text>
        </View>
        <View style={{ height: 4, borderRadius: 999, backgroundColor: colorDef.accent + '18', overflow: 'hidden' }}>
          <View
            style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              borderRadius: 999,
              backgroundColor: progress === 100 ? '#16a34a' : colorDef.accent,
            }}
          />
        </View>
        {pendingAssignments > 0 ? (
          <Text style={{ fontSize: 10, color: 'rgba(0,0,0,0.38)' }}>{pendingAssignments} pending</Text>
        ) : null}

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
          <Pressable
            onPress={onOpenInfo}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: colorDef.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Ionicons name="information-circle-outline" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 11 }}>Info</Text>
          </Pressable>
          <Pressable
            onPress={() => setPickerOpen(true)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.05)',
            }}
          >
            <Ionicons name="color-palette-outline" size={16} color="rgba(0,0,0,0.45)" />
          </Pressable>
        </View>
      </View>

      <Modal visible={pickerOpen} transparent animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 }}
          onPress={() => setPickerOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              alignSelf: 'center',
              width: '100%',
              maxWidth: 280,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '900', color: 'rgba(0,0,0,0.45)', marginBottom: 12 }}>
              CARD COLOR
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {ALL.map((c, idx) => (
                <Pressable
                  key={`${c.value}-${idx}`}
                  onPress={() => {
                    onColorChange(c.value as CardColorValue);
                    setPickerOpen(false);
                  }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: c.bg,
                    borderWidth: 2,
                    borderColor: c.accent,
                  }}
                />
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
