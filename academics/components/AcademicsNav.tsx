import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type TabDef = { label: string; index: number; isPill?: boolean };

const MENU_TABS: TabDef[] = [
  { label: 'My Classes', index: 0 },
  { label: 'Due Dates', index: 1 },
  { label: 'Study Groups', index: 3 },
  { label: 'Note Share', index: 4 },
];

const PILL_TABS: TabDef[] = [
  { label: 'UniCart', index: 2, isPill: true },
  { label: 'Smart Planner', index: 5, isPill: true },
];

const ALL = [...MENU_TABS, ...PILL_TABS];

type Props = {
  tab: number;
  setTab: (t: number) => void;
};

export function AcademicsNav({ tab, setTab }: Props) {
  const [open, setOpen] = React.useState(false);
  const activeLabel = ALL.find((t) => t.index === tab)?.label ?? 'My Classes';

  return (
    <View style={{ flex: 1, minWidth: 200, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="school" size={18} color="#fff" />
        </View>
        <View>
          <Text style={{ fontWeight: '800', fontSize: 15, color: '#fff', letterSpacing: -0.3 }}>
            Academic Hub
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
            }}
          >
            CSUN · Academics
          </Text>
        </View>

        <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.18)', marginHorizontal: 4 }} />

        <View style={{ zIndex: 2 }}>
          <Pressable
            onPress={() => setOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.22)',
              backgroundColor: open ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 13, color: '#fff' }}>{activeLabel}</Text>
            <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.75)" />
          </Pressable>
        </View>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menuWrap}>
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.menu}>
                {MENU_TABS.map((t) => {
                  const isActive = tab === t.index;
                  return (
                    <Pressable
                      key={t.index}
                      onPress={() => {
                        setTab(t.index);
                        setOpen(false);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        backgroundColor: isActive ? 'rgba(168,5,50,0.30)' : 'transparent',
                      }}
                    >
                      <View
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: isActive ? '#ff5c87' : 'transparent',
                          borderWidth: isActive ? 0 : 1.5,
                          borderColor: 'rgba(255,255,255,0.18)',
                        }}
                      />
                      <Text
                        style={{
                          fontWeight: isActive ? '700' : '500',
                          fontSize: 13,
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.72)',
                        }}
                      >
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {PILL_TABS.map((t) => {
          const isActive = tab === t.index;
          const isUni = t.index === 2;
          return (
            <Pressable
              key={t.index}
              onPress={() => setTab(t.index)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                borderWidth: 1.5,
                backgroundColor: isActive
                  ? isUni
                    ? 'rgba(20,180,160,0.25)'
                    : 'rgba(255,186,50,0.22)'
                  : 'rgba(255,255,255,0.06)',
                borderColor: isActive
                  ? isUni
                    ? 'rgba(20,180,160,0.65)'
                    : 'rgba(255,186,50,0.60)'
                  : 'rgba(255,255,255,0.18)',
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: isActive ? (isUni ? '#4ef0de' : '#ffd566') : 'rgba(255,255,255,0.30)',
                }}
              />
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 12,
                  color: isActive ? (isUni ? '#4ef0de' : '#ffd566') : 'rgba(255,255,255,0.75)',
                }}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  menuWrap: {
    alignSelf: 'flex-start',
  },
  menu: {
    minWidth: 220,
    backgroundColor: 'rgba(20,4,10,0.96)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    paddingVertical: 8,
  },
});
