import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { isApiConfigured, postAddToEvents } from '@/studentRec/api';

const SRC_RED = '#A80532';

type Props = {
  open: boolean;
  programTitle: string;
  onClose: () => void;
  onConfirm: (email: string) => Promise<void>;
};

export function AddToEventsModal({ open, programTitle, onClose, onConfirm }: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setEmail('');
    setError('');
    setLoading(false);
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = (val: string) => {
    if (!val) return 'Email is required.';
    if (!val.endsWith('@my.csun.edu')) return 'Must use your @my.csun.edu email.';
    return '';
  };

  const handleSubmit = async () => {
    const err = validate(email);
    if (err) {
      setError(err);
      return;
    }
    if (!isApiConfigured()) {
      Alert.alert(
        'Can’t submit',
        'We couldn’t reach the server. Check your connection and try again.',
      );
      return;
    }
    setLoading(true);
    try {
      await onConfirm(email);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => handleClose(), 2200);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={loading ? undefined : handleClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', padding: 20 }}
        onPress={handleClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: 'rgba(168,5,50,0.35)',
            backgroundColor: 'rgba(180, 52, 97, 0.97)',
            maxWidth: 400,
            alignSelf: 'center',
            width: '100%',
          }}
        >
          <View style={{ height: 3, backgroundColor: SRC_RED }} />
          {!success ? (
            <View style={{ padding: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 12, flex: 1 }}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: 'rgba(168,5,50,0.2)',
                      borderWidth: 1,
                      borderColor: 'rgba(168,5,50,0.45)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="calendar-outline" size={22} color="#ff6b8a" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 3 }}>
                      ADD TO EVENTS
                    </Text>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{programTitle}</Text>
                  </View>
                </View>
                <Pressable onPress={handleClose} disabled={loading} accessibilityLabel="Close">
                  <Ionicons name="close" size={22} color="rgba(255,255,255,0.5)" />
                </Pressable>
              </View>

              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 8 }}>Your CSUN Email</Text>
              <TextInput
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setError('');
                }}
                placeholder="yourid@my.csun.edu"
                placeholderTextColor="rgba(255,255,255,0.28)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: error ? '#ff6b8a' : 'rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  padding: 12,
                  color: '#fff',
                  marginBottom: error ? 6 : 16,
                }}
              />
              {error ? (
                <Text style={{ color: '#ff6b8a', fontSize: 12, fontWeight: '600', marginBottom: 12 }}>{error}</Text>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Pressable
                  onPress={handleClose}
                  disabled={loading}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.5)',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleSubmit}
                  disabled={loading}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 10,
                    backgroundColor: SRC_RED,
                    alignItems: 'center',
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={{ color: '#fff', fontWeight: '800' }}>Add to My Events</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={56} color="#4ade80" />
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 12 }}>Added to Your Events!</Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                {programTitle} has been added. Check your CSUN email for confirmation.
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export async function defaultAddToEventsHandler(program: string, email: string) {
  const res = await postAddToEvents(program, email);
  if (!res.ok) throw new Error('Failed');
}
