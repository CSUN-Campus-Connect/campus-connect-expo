import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { BottomBarProvider } from '../context/BottomBarContext';
import { LocaleProvider } from '../context/LocaleContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

/** Routes that work without a logged-in user (guest mode). */
function isPublicGuestRoute(segments: string[]): boolean {
  const root = segments[0];
  if (!root) return false;
  const publicRoots = new Set([
    'dashboard',
    'home',
    'chat',
    'messages',
    'social',
    'events',
    'clubs',
    'academics',
    'marketplace',
    'student-rec',
    'settings',
    'profile',
    'more',
    'customize-bottom-bar',
  ]);
  return publicRoots.has(root);
}

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const guestOnDashboard = isPublicGuestRoute(segments);
    if (!token && !inAuthGroup && !guestOnDashboard) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="home" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="social" />
      <Stack.Screen name="events" />
      <Stack.Screen name="clubs" />
      <Stack.Screen name="academics" />
      <Stack.Screen name="marketplace" />
      <Stack.Screen name="student-rec" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="more" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <LocaleProvider>
      <BottomBarProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </BottomBarProvider>
    </LocaleProvider>
  );
}
