import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  body: string;
};

/** Focused message for hub tabs that use a full planner elsewhere. */
export function AcademicsPlaceholderTab({ title, body }: Props) {
  return (
    <View
      style={{
        borderRadius: 16,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.22)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginBottom: 10 }}>{title}</Text>
      <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, lineHeight: 22 }}>{body}</Text>
    </View>
  );
}
