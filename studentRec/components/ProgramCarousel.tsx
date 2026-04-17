import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
  type ViewToken,
} from 'react-native';

import { ProgramCardRN } from '@/studentRec/components/ProgramCardRN';

export type ProgramSlide = {
  title: string;
  blurb: string;
  imageSrc: string;
  onAddToEvents: () => void;
  onInvite: () => void;
};

const GAP = 12;

export function ProgramCarousel({ slides }: { slides: ProgramSlide[] }) {
  const { width } = Dimensions.get('window');
  const itemW = Math.min(width - 48, width * 0.88);
  const [ix, setIx] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setIx(viewableItems[0].index);
      }
    },
    []
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

  const snap = itemW + GAP;

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / snap);
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    if (clamped !== ix) setIx(clamped);
  };

  return (
    <View style={{ marginTop: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pressable
          onPress={() => listRef.current?.scrollToOffset({ offset: Math.max(0, (ix - 1) * snap), animated: true })}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="Previous program"
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </Pressable>

        <FlatList
          ref={listRef}
          style={{ flex: 1 }}
          data={slides}
          keyExtractor={(s) => s.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={snap}
          decelerationRate="fast"
          contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 4 }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewConfig}
          onMomentumScrollEnd={onScrollEnd}
          getItemLayout={(_, index) => ({
            length: snap,
            offset: snap * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={{ width: itemW, marginRight: GAP }}>
              <ProgramCardRN
                title={item.title}
                blurb={item.blurb}
                imageSrc={item.imageSrc}
                onAddToEvents={item.onAddToEvents}
                onInvite={item.onInvite}
              />
            </View>
          )}
        />

        <Pressable
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: Math.min((slides.length - 1) * snap, (ix + 1) * snap),
              animated: true,
            })
          }
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.45)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          accessibilityLabel="Next program"
        >
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {slides.map((_, i) => (
          <Pressable key={i} onPress={() => listRef.current?.scrollToOffset({ offset: i * snap, animated: true })}>
            <View
              style={{
                height: 7,
                borderRadius: 999,
                width: i === ix ? 22 : 7,
                backgroundColor: i === ix ? '#fff' : 'rgba(255,255,255,0.32)',
              }}
            />
          </Pressable>
        ))}
      </View>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        {ix + 1} / {slides.length}
      </Text>
    </View>
  );
}
