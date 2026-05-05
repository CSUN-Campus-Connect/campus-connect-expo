import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const DEFAULT_URLS = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1522252234503-e356532cafd5?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbe0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
];

type Props = {
  imageUrls?: string[];
  height?: number;
};

/** Hero image grid — same role as `PanelImageGallery` on web, simplified for React Native. */
export function ClubPanelGallery({ imageUrls = DEFAULT_URLS, height = 260 }: Props) {
  const tiles = imageUrls.length >= 6 ? imageUrls.slice(0, 6) : [...imageUrls, ...DEFAULT_URLS].slice(0, 6);
  return (
    <View style={[styles.grid, { height }]}>
      <View style={styles.row}>
        <Tile uri={tiles[0]} />
        <Tile uri={tiles[1]} />
        <Tile uri={tiles[2]} large />
      </View>
      <View style={styles.row}>
        <Tile uri={tiles[3]} />
        <Tile uri={tiles[4]} />
        <Tile uri={tiles[5]} large />
      </View>
    </View>
  );
}

function Tile({ uri, large }: { uri: string; large?: boolean }) {
  return (
    <View style={[styles.tileWrap, large && styles.tileWide]}>
      <Image source={{ uri }} style={styles.image} contentFit="cover" transition={200} />
    </View>
  );
}

const GAP = 8;

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    gap: GAP,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: GAP,
  },
  tileWrap: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  tileWide: {
    flex: 1.85,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
