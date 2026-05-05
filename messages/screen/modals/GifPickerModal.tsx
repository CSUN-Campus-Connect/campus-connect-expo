import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as React from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '../messagesScreenStyles';

type GifItem = { url: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  gifTab: 'all' | 'favorites';
  onGifTab: (t: 'all' | 'favorites') => void;
  visibleGifs: GifItem[];
  gifFavorites: string[];
  onToggleFavorite: (url: string) => void;
  onSelectGif: (url: string) => void;
};

export function GifPickerModal({
  visible,
  onClose,
  gifTab,
  onGifTab,
  visibleGifs,
  gifFavorites,
  onToggleFavorite,
  onSelectGif,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalScreen}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>GIFs</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </Pressable>
        </View>
        <View style={styles.gifTabs}>
          <Pressable
            onPress={() => onGifTab('all')}
            style={[styles.gifTab, gifTab === 'all' && styles.gifTabOn]}
          >
            <Text style={[styles.gifTabText, gifTab === 'all' && styles.gifTabTextOn]}>All GIFs</Text>
          </Pressable>
          <Pressable
            onPress={() => onGifTab('favorites')}
            style={[styles.gifTab, gifTab === 'favorites' && styles.gifTabOn]}
          >
            <Text style={[styles.gifTabText, gifTab === 'favorites' && styles.gifTabTextOn]}>
              Favorites ({gifFavorites.length})
            </Text>
          </Pressable>
        </View>
        {gifTab === 'favorites' && visibleGifs.length === 0 ? (
          <View style={styles.emptyGif}>
            <Text style={styles.threadName}>No favorites yet</Text>
            <Text style={styles.headerSub}>Tap the star on a GIF to save it.</Text>
          </View>
        ) : (
          <FlatList
            data={visibleGifs}
            keyExtractor={(g) => g.url}
            numColumns={3}
            columnWrapperStyle={{ gap: 8 }}
            contentContainerStyle={{ gap: 8, padding: 12 }}
            renderItem={({ item: g }) => (
              <View style={styles.gifCell}>
                <Pressable
                  onPress={() => {
                    onSelectGif(g.url);
                    onClose();
                  }}
                  style={styles.gifPress}
                >
                  <Image source={{ uri: g.url }} style={styles.gifImg} contentFit="cover" />
                </Pressable>
                <Pressable style={styles.gifStar} onPress={() => onToggleFavorite(g.url)}>
                  <Ionicons
                    name={gifFavorites.includes(g.url) ? 'star' : 'star-outline'}
                    size={20}
                    color="#f59e0b"
                  />
                </Pressable>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}
