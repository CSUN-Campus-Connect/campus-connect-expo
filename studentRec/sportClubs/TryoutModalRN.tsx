import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CAT_COLORS, RED } from '@/studentRec/data/sportClubsConstants';
import type { Club } from '@/studentRec/data/sportClubsTypes';

import { CategoryIconRN } from './CategoryIconRN';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 9, fontWeight: '800', letterSpacing: 1.4, color: '#9ca3af', marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 14, color: '#111827', lineHeight: 20 }}>{value}</Text>
    </View>
  );
}

function InterestForm({ club, onClose }: { club: Club; onClose: () => void }) {
  const [f, setF] = useState({
    email: '',
    experience: '',
    contact: '',
    phone: '',
    major: '',
    age: '',
  });
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);

  const emailOk = /^[^\s@]+@my\.csun\.edu$/.test(f.email);
  const valid = emailOk && f.experience && f.contact.trim();

  if (done) {
    return (
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 48, marginBottom: 12 }}>✅</Text>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8 }}>You&apos;re on the list!</Text>
        <Text style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>
          The {club.name} team will reach out to {f.email} with next steps.
        </Text>
        <Pressable
          onPress={onClose}
          style={{ backgroundColor: RED, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 11 }}
        >
          <Text style={{ color: '#fff', fontWeight: '800' }}>Done</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 9, fontWeight: '800', color: '#9ca3af', marginBottom: 4 }}>
        CSUN EMAIL <Text style={{ color: RED }}>*</Text>
      </Text>
      <TextInput
        value={f.email}
        onChangeText={(t) => setF((p) => ({ ...p, email: t }))}
        placeholder="yourname@my.csun.edu"
        placeholderTextColor="#9ca3af"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1.5,
          borderColor: touched && !emailOk ? '#fca5a5' : '#e5e7eb',
          borderRadius: 10,
          padding: 10,
          marginBottom: 8,
        }}
      />
      {touched && !emailOk ? (
        <Text style={{ color: '#ef4444', fontSize: 11, marginBottom: 12 }}>Must be a @my.csun.edu address.</Text>
      ) : null}

      <Text style={{ fontSize: 9, fontWeight: '800', color: '#9ca3af', marginBottom: 4 }}>
        YEARS OF EXPERIENCE <Text style={{ color: RED }}>*</Text>
      </Text>
      <TextInput
        value={f.experience}
        onChangeText={(t) => setF((p) => ({ ...p, experience: t }))}
        placeholder="e.g. 1–2 years"
        placeholderTextColor="#9ca3af"
        style={{
          borderWidth: 1.5,
          borderColor: touched && !f.experience ? '#fca5a5' : '#e5e7eb',
          borderRadius: 10,
          padding: 10,
          marginBottom: 12,
        }}
      />

      <Text style={{ fontSize: 9, fontWeight: '800', color: '#9ca3af', marginBottom: 4 }}>
        BEST WAY TO REACH YOU <Text style={{ color: RED }}>*</Text>
      </Text>
      <TextInput
        value={f.contact}
        onChangeText={(t) => setF((p) => ({ ...p, contact: t }))}
        placeholder="Text, DM, email…"
        placeholderTextColor="#9ca3af"
        multiline
        style={{
          borderWidth: 1.5,
          borderColor: touched && !f.contact.trim() ? '#fca5a5' : '#e5e7eb',
          borderRadius: 10,
          padding: 10,
          minHeight: 56,
          marginBottom: 16,
        }}
      />

      <Text style={{ fontSize: 9, fontWeight: '800', color: '#9ca3af', marginBottom: 4 }}>CELL (optional)</Text>
      <TextInput
        value={f.phone}
        onChangeText={(t) => setF((p) => ({ ...p, phone: t }))}
        placeholder="818-555-0199"
        placeholderTextColor="#9ca3af"
        keyboardType="phone-pad"
        style={{ borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 12 }}
      />

      <Pressable
        onPress={() => {
          setTouched(true);
          if (!valid) return;
          setDone(true);
          Alert.alert('Interest submitted', 'Thanks — the club will follow up using the contact you provided.');
        }}
        style={{
          backgroundColor: RED,
          paddingVertical: 12,
          borderRadius: 11,
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>Submit interest</Text>
      </Pressable>
    </ScrollView>
  );
}

export function TryoutModalRN({ club, onClose }: { club: Club | null; onClose: () => void }) {
  if (!club) return null;
  const cc = CAT_COLORS[club.category];
  const isInfo = club.tryout.kind === 'info';

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '92%',
            overflow: 'hidden',
          }}
        >
          <View style={{ height: 5, backgroundColor: cc }} />
          <View style={{ alignItems: 'center', paddingTop: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#e5e7eb' }} />
          </View>

          <View style={{ paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: cc,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                  >
                    <CategoryIconRN category={club.category} size={11} />
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{club.category}</Text>
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: '800', letterSpacing: 1.4, color: '#9ca3af' }}>
                    {isInfo ? 'TRYOUT INFO' : 'EXPRESS INTEREST'}
                  </Text>
                </View>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827' }}>{club.name}</Text>
              </View>
              <Pressable onPress={onClose} style={{ padding: 6 }}>
                <Ionicons name="close" size={22} color="#6b7280" />
              </Pressable>
            </View>
          </View>

          {isInfo && club.tryout.kind === 'info' ? (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {club.tryout.schedule ? <InfoRow label="Schedule" value={club.tryout.schedule} /> : null}
              {club.tryout.location ? <InfoRow label="Location" value={club.tryout.location} /> : null}
              {club.tryout.cost ? <InfoRow label="Cost" value={club.tryout.cost} /> : null}
              {club.tryout.notes ? <InfoRow label="Notes" value={club.tryout.notes} /> : null}
              <View
                style={{
                  backgroundColor: '#fffbeb',
                  borderWidth: 1,
                  borderColor: '#fde68a',
                  borderRadius: 10,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 11, color: '#92400e', lineHeight: 18 }}>
                  Always confirm details on the official club page — schedules may change.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={onClose}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: '#e5e7eb',
                    paddingVertical: 12,
                    borderRadius: 11,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontWeight: '700', color: '#4b5563' }}>Close</Text>
                </Pressable>
                <Pressable
                  onPress={() => void WebBrowser.openBrowserAsync(club.href)}
                  style={{
                    flex: 1,
                    backgroundColor: RED,
                    paddingVertical: 12,
                    borderRadius: 11,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Text style={{ fontWeight: '700', color: '#fff' }}>Club Page</Text>
                  <Ionicons name="open-outline" size={14} color="#fff" />
                </Pressable>
              </View>
            </ScrollView>
          ) : (
            <InterestForm club={club} onClose={onClose} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
