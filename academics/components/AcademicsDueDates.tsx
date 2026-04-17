import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { AssignmentWithCourse } from '@/academics/useAcademicsData';
import type { ExamItem } from '@/academics/shared/constants';
import { formatDateShort, formatTimeShort } from '@/academics/shared/utils';

type ExamRow = ExamItem & { courseCode: string };

type Props = {
  assignments: AssignmentWithCourse[];
  exams: ExamRow[];
  onToggleAssignment: (courseId: string, assignmentId: string) => void;
};

function daysUntil(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export function AcademicsDueDates({ assignments, exams, onToggleAssignment }: Props) {
  return (
    <View
      style={{
        borderRadius: 16,
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.97)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
      }}
    >
      <Text style={{ fontWeight: '900', fontSize: 16, marginBottom: 12, color: '#111' }}>Due Dates & Exams</Text>

      <Text style={{ fontSize: 12, fontWeight: '800', color: 'rgba(0,0,0,0.45)', marginBottom: 8, textTransform: 'uppercase' }}>
        Assignments
      </Text>
      {assignments.length === 0 ? (
        <Text style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>No assignments for this semester.</Text>
      ) : (
        <View style={{ gap: 8, marginBottom: 18 }}>
          {assignments.map((a) => {
            const d = daysUntil(a.dueDate);
            const overdue = d < 0 && !a.completed;
            return (
              <Pressable
                key={a.id}
                onPress={() => onToggleAssignment(a.courseId, a.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  backgroundColor: a.completed ? 'rgba(22,163,74,0.06)' : overdue ? 'rgba(220,38,38,0.06)' : 'transparent',
                  borderWidth: 1,
                  borderColor: a.completed ? 'rgba(22,163,74,0.12)' : overdue ? 'rgba(220,38,38,0.10)' : 'rgba(0,0,0,0.06)',
                }}
              >
                <Ionicons
                  name={a.completed ? 'checkmark-circle' : 'ellipse-outline'}
                  size={20}
                  color={a.completed ? '#16a34a' : 'rgba(0,0,0,0.28)'}
                />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 14,
                      textDecorationLine: a.completed ? 'line-through' : 'none',
                      color: a.completed ? 'rgba(0,0,0,0.38)' : overdue ? '#dc2626' : 'rgba(0,0,0,0.85)',
                    }}
                    numberOfLines={2}
                  >
                    {a.title}
                  </Text>
                  <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginTop: 2 }}>
                    {a.courseCode} · Due {formatDateShort(a.dueDate)}
                  </Text>
                </View>
                {!a.completed ? (
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                      backgroundColor:
                        overdue || d === 0 ? '#fef2f2' : d <= 5 ? '#fffbeb' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '900', color: overdue ? '#9ca3af' : d <= 1 ? '#dc2626' : '#6b7280' }}>
                      {overdue ? 'Overdue' : d === 0 ? 'Today' : `${d}d`}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}

      <Text style={{ fontSize: 12, fontWeight: '800', color: 'rgba(0,0,0,0.45)', marginBottom: 8, textTransform: 'uppercase' }}>
        Exams
      </Text>
      {exams.length === 0 ? (
        <Text style={{ color: 'rgba(0,0,0,0.45)' }}>No exams scheduled.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          {exams.map((e) => (
            <View
              key={e.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.06)',
                backgroundColor: 'rgba(168,5,50,0.04)',
              }}
            >
              <Ionicons name="calendar-outline" size={18} color="#A80532" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '800', fontSize: 14, color: '#111' }}>{e.title}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.50)', marginTop: 2 }}>
                  {e.courseCode} · {e.type.toUpperCase()} · {formatDateShort(e.date)} · {formatTimeShort(e.date)}
                </Text>
                {e.location ? (
                  <Text style={{ fontSize: 11, color: 'rgba(0,0,0,0.40)', marginTop: 2 }}>{e.location}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
