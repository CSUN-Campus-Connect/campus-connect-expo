import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { useBottomBar, type BottomBarSlots } from '@/context/BottomBarContext';
import { useLocale } from '@/context/LocaleContext';
import type { BottomBarOptionalId } from '@/dashboard/bottomBarTypes';
import type { SettingsStringKey } from '@/i18n/settingsStrings';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

import { settingsScreenStyles as styles } from '@/settings/screen/settingsScreenStyles';

const OPTIONS: { id: BottomBarOptionalId | null; labelKey: SettingsStringKey }[] = [
  { id: null, labelKey: 'bottomBarNone' },
  { id: 'social', labelKey: 'bottomBarSocial' },
  { id: 'events', labelKey: 'bottomBarEvents' },
  { id: 'clubs', labelKey: 'bottomBarClubs' },
  { id: 'academics', labelKey: 'bottomBarAcademics' },
  { id: 'src', labelKey: 'bottomBarSrc' },
];

function SlotPickerRow({
  titleKey,
  value,
  onChange,
  t,
}: {
  titleKey: SettingsStringKey;
  value: BottomBarOptionalId | null;
  onChange: (next: BottomBarOptionalId | null) => void;
  t: (key: SettingsStringKey) => string;
}) {
  const [open, setOpen] = useState(false);
  const label = useMemo(() => {
    const opt = OPTIONS.find((o) => o.id === value);
    return opt ? t(opt.labelKey) : t('bottomBarNone');
  }, [value, t]);

  return (
    <>
      <Text style={styles.sectionTitle}>{t(titleKey)}</Text>
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => setOpen(true)}
        >
          <Ionicons name="grid-outline" size={22} color={Brand.primary} style={styles.rowIcon} />
          <Text style={styles.rowLabel}>{label}</Text>
          <Ionicons name="chevron-down" size={18} color={Brand.textLight} />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={modalStyles.modalRoot}>
          <Pressable style={modalStyles.backdrop} onPress={() => setOpen(false)} />
          <View style={modalStyles.sheet}>
            <Text style={modalStyles.sheetTitle}>{t(titleKey)}</Text>
            <ScrollView keyboardShouldPersistTaps="handled" style={modalStyles.list}>
              {OPTIONS.map((opt, index) => (
                <Pressable
                  key={String(opt.id)}
                  style={({ pressed }) => [
                    modalStyles.option,
                    index > 0 && modalStyles.optionBorder,
                    pressed && modalStyles.optionPressed,
                  ]}
                  onPress={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                >
                  <Text style={modalStyles.optionText}>{t(opt.labelKey)}</Text>
                  {value === opt.id ? (
                    <Ionicons name="checkmark" size={22} color={Brand.primary} />
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 28,
    maxHeight: '70%',
    zIndex: 1,
    elevation: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: Brand.textDark,
  },
  list: {
    maxHeight: 360,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  optionBorder: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
  },
  optionPressed: {
    backgroundColor: Brand.surfaceMuted,
  },
  optionText: {
    fontSize: 16,
    color: Brand.textDark,
  },
});

export function CustomizeBottomBarScreen() {
  const { tSettings } = useLocale();
  const { slots, setSlots } = useBottomBar();
  const router = useRouter();

  const applySlot = useCallback(
    (which: 'slot1' | 'slot2', next: BottomBarOptionalId | null) => {
      const other: 'slot1' | 'slot2' = which === 'slot1' ? 'slot2' : 'slot1';
      if (next != null && next === slots[other]) {
        void setSlots({ ...slots, [which]: next, [other]: null });
        return;
      }
      void setSlots({ ...slots, [which]: next });
    },
    [slots, setSlots],
  );

  return (
    <FeatureScreenShell title={tSettings('customizeBottomBarTitle')}>
      <Text style={styles.intro}>{tSettings('customizeBottomBarIntro')}</Text>

      <View style={styles.section}>
        <SlotPickerRow
          titleKey="bottomBarSlot1"
          value={slots.slot1}
          onChange={(next) => applySlot('slot1', next)}
          t={tSettings}
        />
      </View>

      <View style={styles.section}>
        <SlotPickerRow
          titleKey="bottomBarSlot2"
          value={slots.slot2}
          onChange={(next) => applySlot('slot2', next)}
          t={tSettings}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          {
            marginTop: 8,
            paddingVertical: 14,
            alignItems: 'center' as const,
          },
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => router.back()}
      >
        <Text style={{ fontSize: 16, fontWeight: '600', color: Brand.primary }}>
          {tSettings('customizeBottomBarDone')}
        </Text>
      </Pressable>
    </FeatureScreenShell>
  );
}

export default CustomizeBottomBarScreen;
