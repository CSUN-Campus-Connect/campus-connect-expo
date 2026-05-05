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

export default function RegisterScreen() {
  const { width: windowWidth } = useWindowDimensions();
  const router = useRouter();
  const { signIn } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const logoSize = Math.min(270, Math.max(160, windowWidth - 88));

  const handleRegister = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register({
        email,
        password,
        displayName: `${firstName} ${lastName}`,
      });
      await signIn(res.token);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthChrome>
      <AuthGlassCard>
        <View style={styles.hero}>
          <BrandLogo variant="lockup" size={logoSize} style={styles.logoMark} />
          <Text style={styles.brand}>Create your account</Text>
          <Text style={styles.tagline}>Use your CSUN email to get started</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={lastName}
          onChangeText={setLastName}
        />
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
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
          <Text style={styles.footer}>
            Already have an account? <Text style={styles.footerBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </AuthGlassCard>
    </AuthChrome>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoMark: {
    marginBottom: 14,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 6,
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
    marginBottom: 10,
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
    marginBottom: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
