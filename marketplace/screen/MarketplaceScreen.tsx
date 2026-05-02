import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import axios from 'axios';

import { Brand } from '@/constants/brand';
import { API_BASE_URL } from '@/constants/config';
import { useAuth } from '@/context/AuthContext';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

import { MarketplaceListingCard } from '../components/MarketplaceListingCard';
import type { MarketplaceListing } from '../types';
import { marketplaceScreenStyles as styles } from './marketplaceScreenStyles';

const CATEGORIES = [
  { id: 'all', name: 'All Items' },
  { id: 'textbooks', name: 'Textbooks' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' },
] as const;

const SORT_OPTIONS: { id: string; label: string }[] = [
  { id: 'recent', label: 'Most Recent' },
  { id: 'price-low', label: 'Price ↑' },
  { id: 'price-high', label: 'Price ↓' },
  { id: 'popular', label: 'Popular' },
];

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1581287053822-fd7bf4f4bfec?w=600&h=400&fit=crop';

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
}

export function MarketplaceScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { token, isLoading: authLoading } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange] = useState([0, 1000]);

  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [favorites, setFavorites] = useState(new Set<string>());
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceListing | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const cardWidth = useMemo(() => {
    const pad = 16;
    const gap = 12;
    return (width - pad * 2 - gap) / 2;
  }, [width]);

  const loadListings = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        if (priceRange[0] > 0) params.append('minPrice', String(priceRange[0]));
        if (priceRange[1] < 1000) params.append('maxPrice', String(priceRange[1]));
        if (searchQuery) params.append('search', searchQuery);
        params.append('sortBy', sortBy);
        params.append('status', 'active');

        const response = await axios.get<MarketplaceListing[]>(
          `${API_BASE_URL}/v1/marketplace?${params.toString()}`
        );
        setListings(response.data);
      } catch (err: unknown) {
        const ax = err as { response?: { data?: { message?: string } } };
        console.error('Error fetching listings:', err);
        setError(ax.response?.data?.message ?? 'Failed to load listings');
      } finally {
        if (!opts?.silent) setLoading(false);
      }
    },
    [selectedCategory, priceRange, searchQuery, sortBy]
  );

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const refreshFavorites = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get<MarketplaceListing[]>(
        `${API_BASE_URL}/v1/marketplace/favorites`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const ids = new Set(response.data.map((l) => l.id));
      setFavorites(ids);
    } catch {
      // optional
    }
  }, [token]);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const sortedListings = useMemo(() => {
    const copy = [...listings];
    copy.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'popular':
          return (b._count?.favoritedBy ?? 0) - (a._count?.favoritedBy ?? 0);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return copy;
  }, [listings, sortBy]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadListings({ silent: true });
      await refreshFavorites();
    } finally {
      setRefreshing(false);
    }
  }, [loadListings, refreshFavorites]);

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!token) {
        Alert.alert('Sign in required', 'Please log in to favorite items.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log in', onPress: () => router.push('/(auth)/login' as never) },
        ]);
        return;
      }

      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });

      try {
        await axios.post(
          `${API_BASE_URL}/v1/marketplace/${id}/favorite`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await refreshFavorites();
      } catch {
        setFavorites((prev) => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
        Alert.alert('Error', 'Could not update favorite. Try again.');
      }
    },
    [token, router, refreshFavorites]
  );

  const handleContactSeller = (item: MarketplaceListing) => {
    if (!token) {
      Alert.alert('Sign in required', 'Please log in to contact sellers.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/(auth)/login' as never) },
      ]);
      return;
    }
    setSelectedItem(item);
    setContactMessage(`Hi! I'm interested in your "${item.title}". Is it still available?`);
    setShowContactModal(true);
  };

  const handleSendMessage = async () => {
    if (!contactMessage.trim() || !selectedItem || !token) return;
    setSendingMessage(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert(
        'Message sent',
        `Your note was sent to ${selectedItem.seller.firstName}. They may reply via email.`
      );
      setShowContactModal(false);
      setContactMessage('');
      setSelectedItem(null);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const handleSellPress = () => {
    if (!token) {
      Alert.alert('Sign in required', 'Please log in to sell items.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log in', onPress: () => router.push('/(auth)/login' as never) },
      ]);
      return;
    }
    Alert.alert(
      'Post a listing',
      'Listing creation with photos is available on the Campus Connect website. We’re bringing the full flow to the app soon.'
    );
  };

  const handleAddListingEmpty = () => {
    handleSellPress();
  };

  if (authLoading) {
    return (
      <FeatureScreenShell title="Marketplace">
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Brand.primary} />
          <Text style={styles.stateText}>Loading…</Text>
        </View>
      </FeatureScreenShell>
    );
  }

  const favoritesSlot = (
    <Pressable
      onPress={() =>
        Alert.alert('My favorites', `You have ${favorites.size} saved listing${favorites.size === 1 ? '' : 's'}.`)
      }
      style={styles.favSlot}
      accessibilityRole="button"
    >
      <Ionicons name="heart" size={20} color={Brand.primary} />
      <Text style={styles.favSlotText} numberOfLines={1}>
        ({favorites.size})
      </Text>
    </Pressable>
  );

  return (
    <FeatureScreenShell
      title="Marketplace"
      rightSlot={favoritesSlot}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Brand.primary}
        />
      }
    >
      <View style={styles.bleed}>
        <LinearGradient
          colors={['#A80532', '#8B0428', '#6D0320']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <View style={styles.heroInner}>
            <Text style={styles.heroTitle}>Matador Marketplace</Text>
            <Text style={styles.heroSubtitle}>Buy and sell with fellow CSUN students</Text>

            <Pressable style={styles.sellBtn} onPress={handleSellPress} accessibilityRole="button">
              <Ionicons name="add" size={22} color={Brand.primary} />
              <Text style={styles.sellBtnText}>Sell an Item</Text>
            </Pressable>

            <View style={styles.searchRow}>
              <Ionicons name="search" size={22} color={Brand.primary} style={{ marginLeft: 4 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search textbooks, electronics, furniture…"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              <Pressable
                style={styles.searchSubmit}
                onPress={() => {
                  Keyboard.dismiss();
                  loadListings();
                }}
              >
                <Text style={styles.searchSubmitText}>Search</Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(168, 5, 50, 0.98)', 'rgba(139, 4, 40, 0.98)']}
          style={styles.categoryStrip}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                >
                  <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </LinearGradient>

        <LinearGradient
          colors={['rgba(168, 5, 50, 0.95)', 'rgba(139, 4, 40, 0.95)']}
          style={styles.resultsBar}
        >
          <Text style={styles.resultsCount}>
            <Text style={styles.resultsCountNum}>{sortedListings.length}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.9)' }}> items found</Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.sortScroll}
            contentContainerStyle={{ alignItems: 'center', paddingLeft: 4 }}
          >
            {SORT_OPTIONS.map((opt) => {
              const active = sortBy === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setSortBy(opt.id)}
                  style={[styles.sortChip, active && styles.sortChipActive]}
                >
                  <Text style={styles.sortChipText}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </LinearGradient>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={Brand.primary} />
          <Text style={styles.stateText}>Loading marketplace items…</Text>
        </View>
      ) : null}

      {error && !loading ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={48} color="#DC2626" />
          <Text style={[styles.stateText, { color: '#374151', fontWeight: '700' }]}>
            Failed to load listings
          </Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable style={styles.retryBtn} onPress={() => loadListings()}>
            <Text style={styles.retryBtnText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && !error && sortedListings.length === 0 ? (
        <View style={[styles.centerState, { paddingHorizontal: 8 }]}>
          <Ionicons name="cube-outline" size={56} color={Brand.primary} style={{ opacity: 0.45 }} />
          <Text style={[styles.stateText, { color: '#374151', fontWeight: '700', fontSize: 18 }]}>
            No items found
          </Text>
          <Text style={styles.stateText}>
            Try adjusting your filters or be the first to list an item!
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 8 }}>
            <Pressable
              style={[styles.retryBtn, { backgroundColor: '#fff', borderWidth: 2, borderColor: Brand.primary }]}
              onPress={handleClearFilters}
            >
              <Text style={[styles.retryBtnText, { color: Brand.primary }]}>Clear filters</Text>
            </Pressable>
            <Pressable style={styles.retryBtn} onPress={handleAddListingEmpty}>
              <Text style={styles.retryBtnText}>Sell an item</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {!loading && !error && sortedListings.length > 0 ? (
        <View style={styles.grid}>
          {sortedListings.map((item) => (
            <MarketplaceListingCard
              key={item.id}
              item={item}
              width={cardWidth}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={toggleFavorite}
              onContactSeller={handleContactSeller}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </View>
      ) : null}

      <Modal
        visible={showContactModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContactModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowContactModal(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={styles.modalTitle}>Contact Seller</Text>
                {selectedItem ? (
                  <Text style={styles.modalSubtitle}>
                    Message{' '}
                    <Text style={{ color: Brand.primary, fontWeight: '800' }}>
                      {selectedItem.seller.firstName} {selectedItem.seller.lastName}
                    </Text>
                  </Text>
                ) : null}
              </View>
              <Pressable style={styles.modalClose} onPress={() => setShowContactModal(false)}>
                <Ionicons name="close" size={22} color={Brand.primary} />
              </Pressable>
            </View>

            {selectedItem ? (
              <View style={styles.modalPreview}>
                <Image
                  source={{ uri: selectedItem.images[0] || PLACEHOLDER_IMG }}
                  style={styles.modalThumb}
                  contentFit="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalItemTitle} numberOfLines={2}>
                    {selectedItem.title}
                  </Text>
                  <Text style={styles.modalItemPrice}>${selectedItem.price.toFixed(2)}</Text>
                </View>
              </View>
            ) : null}

            <TextInput
              style={styles.modalInput}
              multiline
              value={contactMessage}
              onChangeText={setContactMessage}
              placeholder="Write your message here…"
              placeholderTextColor="#9CA3AF"
            />

            <Pressable
              style={[
                styles.modalSend,
                (sendingMessage || !contactMessage.trim()) && styles.modalSendDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={sendingMessage || !contactMessage.trim()}
            >
              <Text style={styles.modalSendText}>
                {sendingMessage ? 'Sending…' : 'Send message'}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </FeatureScreenShell>
  );
}

export default MarketplaceScreen;
