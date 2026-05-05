import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';
import { goToCustomizeBottomBar } from '@/dashboard/api';
import { useLocale } from '@/context/LocaleContext';
import type { SettingsStringKey } from '@/i18n/settingsStrings';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

import { settingsScreenStyles as styles } from './settingsScreenStyles';

type SectionTitleKey = Extract<
  SettingsStringKey,
  | 'sectionYourAccount'
  | 'sectionPrivacySecurity'
  | 'sectionPreferences'
  | 'sectionMessaging'
  | 'sectionSocial'
  | 'sectionMarketplace'
  | 'sectionClubs'
  | 'sectionEvents'
  | 'sectionAcademics'
  | 'sectionSupport'
>;

type RowLabelKey = Extract<
  SettingsStringKey,
  | 'rowAccount'
  | 'rowPrivacy'
  | 'rowSecurity'
  | 'rowNotifications'
  | 'rowAppearance'
  | 'rowWebsiteLanguage'
  | 'rowMessagingSettings'
  | 'rowSocialSettings'
  | 'rowMarketplaceSettings'
  | 'rowClubSettings'
  | 'rowEventSettings'
  | 'rowAcademicSettings'
  | 'rowHelpSupport'
  | 'rowCustomizeSidebar'
>;

type Row = {
  labelKey: RowLabelKey;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  value?: string;
};

function SettingsSection({
  titleKey,
  rows,
  t,
}: {
  titleKey: SectionTitleKey;
  rows: Row[];
  t: (key: SettingsStringKey) => string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t(titleKey)}</Text>
      <View style={styles.card}>
        {rows.map((row, i) => (
          <Pressable
            key={row.labelKey}
            style={({ pressed }) => [
              styles.row,
              i < rows.length - 1 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
            onPress={() => {
              if (row.onPress) {
                row.onPress();
                return;
              }
              Alert.alert(
                t(row.labelKey),
                'This section is opening soon — we’re finishing the experience for mobile.',
              );
            }}
          >
            <Ionicons name={row.icon} size={22} color={Brand.primary} style={styles.rowIcon} />
            <Text style={styles.rowLabel}>{t(row.labelKey)}</Text>
            {row.value != null ? <Text style={styles.rowValue}>{row.value}</Text> : null}
            <Ionicons name="chevron-forward" size={18} color={Brand.textLight} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const { tSettings, openLanguagePicker, currentLanguageLabel } = useLocale();

  return (
    <FeatureScreenShell title={tSettings('settingsTitle')}>
      <Text style={styles.intro}>{tSettings('intro')}</Text>

      <SettingsSection
        titleKey="sectionYourAccount"
        t={tSettings}
        rows={[{ labelKey: 'rowAccount', icon: 'person-outline' }]}
      />
      <SettingsSection
        titleKey="sectionPrivacySecurity"
        t={tSettings}
        rows={[
          { labelKey: 'rowPrivacy', icon: 'eye-outline' },
          { labelKey: 'rowSecurity', icon: 'shield-outline' },
        ]}
      />
      <SettingsSection
        titleKey="sectionPreferences"
        t={tSettings}
        rows={[
          { labelKey: 'rowNotifications', icon: 'notifications-outline' },
          { labelKey: 'rowAppearance', icon: 'color-palette-outline' },
          {
            labelKey: 'rowWebsiteLanguage',
            icon: 'language-outline',
            onPress: openLanguagePicker,
            value: currentLanguageLabel,
          },
          {
            labelKey: 'rowCustomizeSidebar',
            icon: 'albums-outline',
            onPress: goToCustomizeBottomBar,
          },
        ]}
      />
      <SettingsSection
        titleKey="sectionMessaging"
        t={tSettings}
        rows={[{ labelKey: 'rowMessagingSettings', icon: 'chatbubble-outline' }]}
      />
      <SettingsSection
        titleKey="sectionSocial"
        t={tSettings}
        rows={[{ labelKey: 'rowSocialSettings', icon: 'document-text-outline' }]}
      />
      <SettingsSection
        titleKey="sectionMarketplace"
        t={tSettings}
        rows={[{ labelKey: 'rowMarketplaceSettings', icon: 'storefront-outline' }]}
      />
      <SettingsSection
        titleKey="sectionClubs"
        t={tSettings}
        rows={[{ labelKey: 'rowClubSettings', icon: 'people-outline' }]}
      />
      <SettingsSection
        titleKey="sectionEvents"
        t={tSettings}
        rows={[{ labelKey: 'rowEventSettings', icon: 'calendar-outline' }]}
      />
      <SettingsSection
        titleKey="sectionAcademics"
        t={tSettings}
        rows={[{ labelKey: 'rowAcademicSettings', icon: 'book-outline' }]}
      />
      <SettingsSection
        titleKey="sectionSupport"
        t={tSettings}
        rows={[{ labelKey: 'rowHelpSupport', icon: 'help-circle-outline' }]}
      />
    </FeatureScreenShell>
  );
}

export default SettingsScreen;
