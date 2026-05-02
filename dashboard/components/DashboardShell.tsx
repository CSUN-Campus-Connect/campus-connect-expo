import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DASHBOARD_SPLIT_LAYOUT_MIN_WIDTH } from '../constants';
import { DashboardColors, DashboardSpacing, dashboardStyles } from '../styles';

import { BottomTabs } from './BottomTabs';
import { DashboardMobileDrawer } from './DashboardMobileDrawer';
import { DashboardSidebar } from './DashboardSidebar';

type Props = {
  children: React.ReactNode;
  /** Optional title next to the menu button on compact layout. */
  title?: string;
};

/**
 * Wide: permanent sidebar + main. Narrow: full-width main, campus nav in slide-out drawer (menu icon).
 * Bottom tabs: Home, Messages, optional shortcuts (from Settings), More.
 */
export function DashboardShell({ children, title }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const useSplitLayout = windowWidth >= DASHBOARD_SPLIT_LAYOUT_MIN_WIDTH;

  const drawerWidth = useMemo(() => Math.floor(windowWidth), [windowWidth]);

  useEffect(() => {
    if (useSplitLayout) setDrawerOpen(false);
  }, [useSplitLayout]);

  return (
    <View style={styles.root}>
      {useSplitLayout ? (
        <View style={styles.body}>
          <DashboardSidebar />
          <View
            style={[
              styles.mainColumn,
              {
                paddingTop: insets.top + DashboardSpacing.headerGap,
                paddingRight: Math.max(insets.right, 0),
              },
            ]}
          >
            <ScrollView
              style={styles.mainScroll}
              contentContainerStyle={[dashboardStyles.scrollContent, styles.mainScrollInner]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces
            >
              {children}
            </ScrollView>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.compactBody}>
            <View
              style={[
                styles.mobileTopBar,
                {
                  paddingTop: insets.top + 8,
                  paddingLeft: Math.max(insets.left, 12),
                  paddingRight: Math.max(insets.right, 12),
                },
              ]}
            >
              <Pressable
                onPress={() => setDrawerOpen(true)}
                style={({ pressed }) => [styles.menuBtn, pressed && styles.menuBtnPressed]}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Open campus menu"
              >
                <Ionicons name="menu" size={26} color={DashboardColors.textDark} />
              </Pressable>
              {title ? (
                <Text style={styles.mobileTitle} numberOfLines={1}>
                  {title}
                </Text>
              ) : null}
            </View>
            <View
              style={[
                styles.mainColumn,
                {
                  paddingRight: Math.max(insets.right, 0),
                },
              ]}
            >
              <ScrollView
                style={styles.mainScroll}
                contentContainerStyle={[dashboardStyles.scrollContent, styles.mainScrollInner]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces
              >
                {children}
              </ScrollView>
            </View>
          </View>
          <DashboardMobileDrawer
            visible={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            drawerWidth={drawerWidth}
          />
        </>
      )}
      <BottomTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: DashboardColors.background,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 0,
    minWidth: 0,
  },
  compactBody: {
    flex: 1,
    minHeight: 0,
    minWidth: 0,
  },
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: DashboardColors.mainBackground,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: DashboardColors.cardBorder,
    paddingBottom: 10,
  },
  menuBtn: {
    width: 44,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  menuBtnPressed: {
    backgroundColor: DashboardColors.cardBackground,
  },
  mobileTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: DashboardColors.textDark,
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
    backgroundColor: DashboardColors.mainBackground,
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollInner: {
    flexGrow: 1,
    paddingHorizontal: DashboardSpacing.screenPadding,
    paddingBottom: 28,
  },
});
