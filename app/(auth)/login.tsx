import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { AuthChrome, AuthGlassCard } from '@/components/auth/AuthChrome';
import { BrandLogo } from '@/components/brand/BrandLogo';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';

function friendlyLoginError(err: unknown): string {
  const e = err as {
    response?: { data?: { message?: string; error?: string }; status?: number };
    code?: string;
  };
  const msg = e?.response?.data?.message ?? e?.response?.data?.error;
  const status = e?.response?.status;
  const lower = (msg ?? '').toLowerCase();

  if (msg) {
    if (lower.includes('verify') || lower.includes('verification')) {
      return 'Please verify your email before logging in. Check your inbox for the verification link.';
    }
    return String(msg);
  }
  if (e?.code === 'ERR_NETWORK' || !e?.response) {
    return "We couldn’t reach the sign-in server. Check your internet connection and try again.";
  }
  if (status === 401) {
    return 'Invalid email or password. Please try again.';
  }
  if (status) {
    return `Login failed (${status}). Please try again.`;
  }
  return 'Login failed. Please try again.';
}

export default function LoginScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /** Scroll padding + card padding so the logo never overflows the glass card (`overflow: hidden`). */
  const logoSize = Math.min(270, Math.max(160, windowWidth - 88));

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      await signIn(res.token);
    } catch (e: unknown) {
      setError(friendlyLoginError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthChrome>
      <AuthGlassCard>
        <View style={styles.hero}>
          <BrandLogo variant="lockup" size={logoSize} style={styles.logoMark} />
          <Text style={styles.tagline}>Sign in with your CSUN email</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="CSUN Email"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Log in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace('/home' as never)}
          disabled={loading}
        >
          <Text style={styles.guestButtonText}>Continue as guest</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={loading}>
          <Text style={styles.footer}>
            Don&apos;t have an account? <Text style={styles.footerBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </AuthGlassCard>
    </AuthChrome>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 22,
  },
  logoMark: {
    marginBottom: 18,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  error: {
    color: '#FFB4B4',
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  primaryButton: {
    backgroundColor: Brand.accent,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  guestButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  guestButtonText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  footerBold: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
