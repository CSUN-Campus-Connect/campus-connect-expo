import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';

import type { MarketplaceListing } from '../types';
import { marketplaceScreenStyles as styles } from '../screen/marketplaceScreenStyles';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=600&h=400&fit=crop';

type Props = {
  item: MarketplaceListing;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onContactSeller: (item: MarketplaceListing) => void;
  formatTimeAgo: (timestamp: string) => string;
  width: number;
};

function formatCondition(condition: string): string {
  if (condition === 'likeNew') return 'Like New';
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}

function getConditionColor(condition: string): string {
  switch (condition) {
    case 'likeNew':
      return '#059669';
    case 'excellent':
      return '#0891B2';
    case 'good':
      return '#16A34A';
    case 'fair':
      return '#CA8A04';
    case 'poor':
      return '#DC2626';
    default:
      return '#6B7280';
  }
}

export function MarketplaceListingCard({
  item,
  isFavorite,
  onToggleFavorite,
  onContactSeller,
  formatTimeAgo,
  width,
}: Props) {
  const savings =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null;

  const condColor = getConditionColor(item.condition);
  const avatarUri =
    item.seller.profilePicture ??
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.seller.firstName)}`;

  return (
    <View style={[styles.card, { width }]}>
      <View style={styles.cardImageWrap}>
        <Image
          source={{ uri: item.images[0] || PLACEHOLDER }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.conditionBadge}>
          <Text style={[styles.conditionBadgeText, { color: condColor, borderColor: condColor }]}>
            {formatCondition(item.condition)}
          </Text>
        </View>
        {item.category === 'textbooks' ? (
          <View style={[styles.textbookBadge, { top: 52 }]}>
            <Text style={styles.textbookBadgeText}>Textbook</Text>
          </View>
        ) : null}
        <Pressable
          onPress={() => onToggleFavorite(item.id)}
          style={styles.favBtn}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? Brand.primary : '#6B7280'}
          />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.priceMain}>${item.price.toFixed(2)}</Text>
          {item.originalPrice ? (
            <Text style={styles.priceStrike}>${item.originalPrice.toFixed(2)}</Text>
          ) : null}
        </View>
        {savings != null ? (
          <View style={styles.savePill}>
            <Text style={styles.savePillText}>Save {savings}%</Text>
          </View>
        ) : null}

        <View style={styles.sellerRow}>
          <Image source={{ uri: avatarUri }} style={styles.sellerAvatar} contentFit="cover" />
          <View style={styles.sellerMeta}>
            <Text style={styles.sellerName} numberOfLines={1}>
              {item.seller.firstName} {item.seller.lastName}
            </Text>
            <Text style={styles.sellerLoc} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.contactBtn}
          onPress={() => onContactSeller(item)}
          accessibilityRole="button"
        >
          <Ionicons name="chatbubble-outline" size={16} color="#fff" />
          <Text style={styles.contactBtnText}>Contact Seller</Text>
        </Pressable>

        <Text style={styles.postedAt}>Posted {formatTimeAgo(item.createdAt)}</Text>
      </View>
    </View>
  );
}
