import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CATEGORY_COLOR_MAP } from '../data/constants';
import type { EventItem, RegistrationForm, RelatedEventSlot } from '../types';
import { BORDER, CRIMSON, PANEL } from '../eventsTheme';

type Props = {
  event: EventItem | null;
  visible: boolean;
  relatedEvents: RelatedEventSlot[];
  onClose: () => void;
  onConfirm: (ev: EventItem) => void;
  onOpenRelated: (ev: EventItem) => void;
};

function RelatedCard({
  slot,
  onOpen,
}: {
  slot: RelatedEventSlot;
  onOpen: (ev: EventItem) => void;
}) {
  const { event, reason } = slot;
  const catColor = CATEGORY_COLOR_MAP[event.category] ?? CRIMSON;
  const reasonLabel: Record<RelatedEventSlot['reason'], string> = {
    same_category: 'Same category',
    same_audience: 'Similar audience',
    trending: 'Trending now',
  };

  return (
    <Pressable onPress={() => onOpen(event)} style={styles.relatedCard}>
      <View style={styles.relatedImageWrap}>
        <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
        <LinearGradient colors={['transparent', 'rgba(10,3,5,0.88)']} style={StyleSheet.absoluteFill} />
        <View style={[styles.relatedReason, { borderColor: `${catColor}33`, backgroundColor: `${catColor}15` }]}>
          <Text style={[styles.relatedReasonText, { color: catColor }]}>{reasonLabel[reason]}</Text>
        </View>
      </View>
      <View style={styles.relatedBody}>
        <Text style={styles.relatedTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.relatedDate}>{event.date}</Text>
      </View>
    </Pressable>
  );
}

type Step = 'form' | 'success';

export function EventRegisterModal({
  event,
  visible,
  relatedEvents,
  onClose,
  onConfirm,
  onOpenRelated,
}: Props) {
  const [form, setForm] = useState<RegistrationForm>({ name: '', email: '', phone: '' });
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);

  const catColor = event ? (CATEGORY_COLOR_MAP[event.category] ?? CRIMSON) : CRIMSON;

  const resetAndClose = () => {
    setStep('form');
    setForm({ name: '', email: '', phone: '' });
    setLoading(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!event) return;
    setLoading(true);
    await new Promise((res) => setTimeout(res, 700));
    onConfirm(event);
    setLoading(false);
    setStep('success');
  };

  return (
    <Modal visible={visible && !!event} animationType="fade" transparent onRequestClose={resetAndClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={resetAndClose} accessibilityRole="button" />
        {!event ? null : (
          <View style={[styles.sheet, { borderColor: `${catColor}33` }]}>
            {step === 'form' ? (
              <>
                <View style={styles.sheetHeaderImg}>
                  <Image source={{ uri: event.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
                  <LinearGradient colors={['transparent', 'rgba(10,3,5,0.92)']} style={StyleSheet.absoluteFill} />
                  <Pressable onPress={resetAndClose} style={[styles.sheetClose, { top: 12, right: 12 }]}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </Pressable>
                </View>

                <ScrollView style={styles.formScroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                  <View style={[styles.catChip, { borderColor: `${catColor}33`, backgroundColor: `${catColor}18` }]}>
                    <View style={[styles.dot, { backgroundColor: catColor }]} />
                    <Text style={[styles.catChipText, { color: catColor }]}>{event.category}</Text>
                  </View>

                  <Text style={styles.formTitle}>{event.title}</Text>
                  <Text style={styles.formSub}>
                    {event.date} · {event.time} · {event.location}
                  </Text>

                  <Text style={styles.label}>FULL NAME</Text>
                  <TextInput
                    value={form.name}
                    onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
                    placeholder="Your full name"
                    placeholderTextColor="rgba(255,255,255,0.28)"
                    style={styles.input}
                    autoCapitalize="words"
                  />

                  <Text style={styles.label}>CSUN EMAIL</Text>
                  <TextInput
                    value={form.email}
                    onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
                    placeholder="you@my.csun.edu"
                    placeholderTextColor="rgba(255,255,255,0.28)"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />

                  <Text style={styles.label}>PHONE (OPTIONAL)</Text>
                  <TextInput
                    value={form.phone}
                    onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                    placeholder="(818) 555-0000"
                    placeholderTextColor="rgba(255,255,255,0.28)"
                    style={styles.input}
                    keyboardType="phone-pad"
                  />

                  <View style={styles.formActions}>
                    <Pressable onPress={resetAndClose} style={styles.btnGhost}>
                      <Text style={styles.btnGhostText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => void handleSubmit()}
                      disabled={loading || !form.name.trim() || !form.email.trim()}
                      style={[styles.btnPrimary, { backgroundColor: loading ? `${catColor}88` : catColor }]}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.btnPrimaryText}>Confirm Registration</Text>
                      )}
                    </Pressable>
                  </View>
                </ScrollView>
              </>
            ) : (
              <ScrollView contentContainerStyle={styles.successScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark" size={32} color="#16c878" />
                </View>
                <Text style={styles.successTitle}>You are registered!</Text>
                <Text style={styles.successSub}>{event.title}</Text>
                <Text style={styles.successEmail}>Confirmation sent to {form.email || 'your email'}</Text>

                <View style={styles.summaryBox}>
                  {[
                    { label: 'Date', value: event.date },
                    { label: 'Time', value: event.time },
                    { label: 'Location', value: event.location },
                    { label: 'Price', value: event.price },
                  ].map(({ label, value }) => (
                    <View key={label} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{label}</Text>
                      <Text style={styles.summaryValue}>{value}</Text>
                    </View>
                  ))}
                  {event.csunUrl ? (
                    <Pressable onPress={() => void Linking.openURL(event.csunUrl!)} style={styles.csunLink}>
                      <Ionicons name="open-outline" size={14} color="#16c878" />
                      <Text style={styles.csunLinkText}>View full details on csun.edu</Text>
                    </Pressable>
                  ) : null}
                </View>

                {relatedEvents.length > 0 ? (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={styles.relatedKicker}>YOU MIGHT ALSO LIKE</Text>
                    <View style={styles.relatedGrid}>
                      {relatedEvents.map((slot) => (
                        <View key={slot.event.id} style={styles.relatedItem}>
                          <RelatedCard
                            slot={slot}
                            onOpen={(ev) => {
                              resetAndClose();
                              onOpenRelated(ev);
                            }}
                          />
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                <Pressable onPress={resetAndClose} style={styles.closeBtn}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: PANEL,
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sheetHeaderImg: { height: 140, position: 'relative' },
  sheetClose: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formScroll: { paddingHorizontal: 22, paddingBottom: 16, paddingTop: 14 },
  catChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  catChipText: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  formTitle: { fontSize: 18, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 24 },
  formSub: { fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: '#fff',
    fontSize: 14,
    marginBottom: 14,
  },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btnGhost: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnGhostText: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },
  btnPrimary: { flex: 2, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  btnPrimaryText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  successScroll: { padding: 24 },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'rgba(22,200,120,0.4)',
    backgroundColor: 'rgba(22,200,120,0.12)',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: { fontSize: 20, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 6 },
  successSub: { fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 6 },
  successEmail: { fontSize: 12, color: '#16c878', textAlign: 'center', marginBottom: 20 },
  summaryBox: {
    backgroundColor: 'rgba(22,200,120,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(22,200,120,0.15)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 11, color: 'rgba(255,255,255,0.35)' },
  summaryValue: { fontSize: 12, color: '#fff', fontWeight: '500' },
  csunLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  csunLinkText: { fontSize: 12, color: '#16c878' },
  relatedKicker: {
    fontSize: 9,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '700',
    marginBottom: 10,
  },
  relatedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  relatedItem: { width: '31%', minWidth: 100 },
  relatedCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    overflow: 'hidden',
  },
  relatedImageWrap: { height: 80, position: 'relative' },
  relatedReason: {
    position: 'absolute',
    bottom: 6,
    left: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  relatedReasonText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  relatedBody: { padding: 10 },
  relatedTitle: { fontSize: 11, fontWeight: '700', color: '#fff', marginBottom: 4, lineHeight: 14 },
  relatedDate: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  closeBtn: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  closeBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
});
