import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';

import {
  AddToEventsModal,
  defaultAddToEventsHandler,
} from '@/studentRec/components/AddToEventsModal';
import {
  InviteFriendModal,
  defaultInviteHandler,
} from '@/studentRec/components/InviteFriendModal';
import { ProgramCarousel } from '@/studentRec/components/ProgramCarousel';
import { SrcHeader } from '@/studentRec/components/SrcHeader';

const HERO_VIDEO = require('../../assets/src/hero-src.mp4');

const quickStats = [
  { icon: 'time-outline' as const, label: 'Open Today', value: '6am – 11pm' },
  { icon: 'people-outline' as const, label: 'Members', value: '12,000+' },
  { icon: 'calendar-outline' as const, label: 'Weekly Classes', value: '80+' },
  { icon: 'people-circle-outline' as const, label: 'Sport Clubs', value: '40+' },
];

const programData = [
  { title: 'Yoga', blurb: 'Guided flows for balance and flexibility. Mats available.', imageSrc: '/images/carouselSRC/yoga.png' },
  { title: 'Boxing Conditioning', blurb: 'Pads, bags, and footwork. High energy training.', imageSrc: '/images/carouselSRC/boxing.png' },
  { title: 'Aquatics', blurb: 'Lap swim and learn to swim options for all levels.', imageSrc: '/images/carouselSRC/aquatics.png' },
  { title: 'Recovery Sessions', blurb: 'Mobility, stretching, and tools to feel your best.', imageSrc: '/images/carouselSRC/recovery.png' },
  { title: 'Private Instruction', blurb: 'One on one coaching tailored to your goals.', imageSrc: '/images/carouselSRC/private.png' },
  { title: 'First Aid & CPR', blurb: 'Learn lifesaving skills with certified instruction.', imageSrc: '/images/carouselSRC/firstaid.png' },
  { title: 'Reservations', blurb: 'Reserve courts, lanes, and spaces with ease.', imageSrc: '/images/carouselSRC/reserve.png' },
  { title: 'Group Exercise', blurb: 'Join classes across strength, cardio, and mobility.', imageSrc: '/images/carouselSRC/classes.png' },
  { title: 'Games Room', blurb: 'Billiards, console gaming, lounge space to unwind.', imageSrc: '/images/carouselSRC/game-room.jpg' },
  { title: 'Rock Wall', blurb: 'Bouldering and top rope for all experience levels.', imageSrc: '/images/carouselSRC/rock-wall.jpg' },
  { title: 'Outdoor Experiences', blurb: 'Trips and skills clinics to explore the outdoors.', imageSrc: '/images/CarouselSRC/outdoor.png' },
  { title: 'Intramural Sports', blurb: 'Leagues and tournaments for friendly competition.', imageSrc: '/images/carouselSRC/intramurals.jpg' },
];

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Boxing: 'barbell-outline',
  Yoga: 'body-outline',
  Aquatics: 'water-outline',
  Recovery: 'trending-up-outline',
  'Personal Training': 'fitness-outline',
  'Sport Clubs': 'basketball-outline',
};

const exploreCategories: { title: string; route: '/student-rec/services' | '/student-rec/sport-clubs' }[] = [
  { title: 'Boxing', route: '/student-rec/services' },
  { title: 'Yoga', route: '/student-rec/services' },
  { title: 'Aquatics', route: '/student-rec/services' },
  { title: 'Recovery', route: '/student-rec/services' },
  { title: 'Personal Training', route: '/student-rec/services' },
  { title: 'Sport Clubs', route: '/student-rec/sport-clubs' },
];

export function SrcHomeScreen() {
  const router = useRouter();
  const [eventsModal, setEventsModal] = useState<{ open: boolean; title: string }>({ open: false, title: '' });
  const [inviteModal, setInviteModal] = useState<{ open: boolean; title: string }>({ open: false, title: '' });

  const featured = programData.map((p) => ({
    ...p,
    onAddToEvents: () => setEventsModal({ open: true, title: p.title }),
    onInvite: () => setInviteModal({ open: true, title: p.title }),
  }));

  return (
    <View style={{ flex: 1 }}>
      <SrcHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          <View
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              height: 240,
              marginBottom: 12,
            }}
          >
            <Video
              source={HERO_VIDEO}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
            <LinearGradient
              colors={['rgba(168,5,50,0.55)', 'transparent', 'rgba(0,0,0,0.45)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 4,
                }}
              >
                California State University Northridge
              </Text>
              <Text
                style={{
                  fontSize: 42,
                  fontWeight: '900',
                  color: 'rgba(255,255,255,0.15)',
                  lineHeight: 44,
                }}
              >
                CSUN
              </Text>
              <Text style={{ fontSize: 22, fontWeight: '900', letterSpacing: 6, color: '#fff' }}>SRC</Text>
              <View
                style={{
                  alignSelf: 'flex-start',
                  marginTop: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: 'rgba(34,197,94,0.25)',
                  borderWidth: 1,
                  borderColor: 'rgba(187,247,208,0.4)',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#bbf7d0' }}>● Facility Open</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.2)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              marginBottom: 20,
            }}
          >
            {quickStats.map((s, i) => (
              <View
                key={s.label}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderBottomWidth: i < quickStats.length - 1 ? 1 : 0,
                  borderBottomColor: 'rgba(255,255,255,0.12)',
                }}
              >
                <Ionicons name={s.icon} size={18} color="rgba(255,255,255,0.6)" />
                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.55)',
                      fontWeight: '600',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {s.label}
                  </Text>
                  <Text style={{ fontSize: 15, color: '#fff', fontWeight: '800' }}>{s.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text
            style={{
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 3,
              fontWeight: '700',
              marginBottom: 10,
              fontSize: 11,
              textTransform: 'uppercase',
            }}
          >
            Explore Programs
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            {exploreCategories.map((c) => {
              const ic = categoryIcons[c.title] ?? 'fitness-outline';
              return (
                <Pressable
                  key={c.title}
                  onPress={() => router.push(c.route as never)}
                  style={{
                    width: '47%',
                    borderRadius: 14,
                    backgroundColor: 'rgba(255,255,255,0.09)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255,255,255,0.18)',
                    padding: 14,
                  }}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      backgroundColor: 'rgba(168,5,50,0.3)',
                      borderWidth: 1,
                      borderColor: 'rgba(168,5,50,0.4)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name={ic} size={20} color="#ffb3c1" />
                  </View>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{c.title}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 4 }}>View classes →</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: 3,
                  fontWeight: '700',
                  fontSize: 11,
                  textTransform: 'uppercase',
                }}
              >
                Highlights
              </Text>
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20, marginTop: 4 }}>Featured at the SRC</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.18)',
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>12 programs</Text>
            </View>
          </View>

          <ProgramCarousel slides={featured} />
        </View>
      </ScrollView>

      <AddToEventsModal
        open={eventsModal.open}
        programTitle={eventsModal.title}
        onClose={() => setEventsModal({ open: false, title: '' })}
        onConfirm={(email) => defaultAddToEventsHandler(eventsModal.title, email)}
      />
      <InviteFriendModal
        open={inviteModal.open}
        programTitle={inviteModal.title}
        onClose={() => setInviteModal({ open: false, title: '' })}
        onConfirm={(sender, friend) => defaultInviteHandler(inviteModal.title, sender, friend)}
      />
    </View>
  );
}

export default SrcHomeScreen;
