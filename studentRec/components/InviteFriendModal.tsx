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

import { isApiConfigured, postInvite } from '@/studentRec/api';

const SRC_RED = '#A80532';

type Props = {
  open: boolean;
  programTitle: string;
  onClose: () => void;
  onConfirm: (senderEmail: string, friendEmail: string) => Promise<void>;
};

export function InviteFriendModal({ open, programTitle, onClose, onConfirm }: Props) {
  const [senderEmail, setSenderEmail] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [errors, setErrors] = useState<{ sender?: string; friend?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = () => {
    setSenderEmail('');
    setFriendEmail('');
    setErrors({});
    setLoading(false);
    setSuccess(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = () => {
    const e: { sender?: string; friend?: string } = {};
    if (!senderEmail) e.sender = 'Your email is required.';
    else if (!senderEmail.endsWith('@my.csun.edu')) e.sender = 'Must use your @my.csun.edu email.';
    if (!friendEmail) e.friend = "Friend's email is required.";
    else if (!friendEmail.endsWith('@my.csun.edu')) e.friend = 'Must be a @my.csun.edu address.';
    else if (friendEmail === senderEmail) e.friend = "Can't invite yourself!";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    if (!isApiConfigured()) {
      Alert.alert(
        'Can’t send invite',
        'We couldn’t reach the server. Check your connection and try again.',
      );
      return;
    }
    setLoading(true);
    try {
      await onConfirm(senderEmail, friendEmail);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => handleClose(), 2400);
    } catch {
      setErrors({ friend: 'Something went wrong. Please try again.' });
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
                    <Ionicons name="person-add-outline" size={22} color="#ff6b8a" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 3 }}>
                      INVITE A FRIEND
                    </Text>
                    <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>{programTitle}</Text>
                  </View>
                </View>
                <Pressable onPress={handleClose} disabled={loading}>
                  <Ionicons name="close" size={22} color="rgba(255,255,255,0.5)" />
                </Pressable>
              </View>

              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '700', marginBottom: 8 }}>
                FROM YOU
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Your CSUN Email</Text>
              <TextInput
                value={senderEmail}
                onChangeText={(t) => {
                  setSenderEmail(t);
                  setErrors((p) => ({ ...p, sender: undefined }));
                }}
                placeholder="yourid@my.csun.edu"
                placeholderTextColor="rgba(255,255,255,0.28)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: errors.sender ? '#ff6b8a' : 'rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  padding: 12,
                  color: '#fff',
                  marginBottom: 8,
                }}
              />
              {errors.sender ? (
                <Text style={{ color: '#ff6b8a', fontSize: 11, marginBottom: 12 }}>{errors.sender}</Text>
              ) : null}

              <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: '700', marginBottom: 8 }}>
                TO YOUR FRIEND
              </Text>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>Friend&apos;s CSUN Email</Text>
              <TextInput
                value={friendEmail}
                onChangeText={(t) => {
                  setFriendEmail(t);
                  setErrors((p) => ({ ...p, friend: undefined }));
                }}
                placeholder="friendid@my.csun.edu"
                placeholderTextColor="rgba(255,255,255,0.28)"
                autoCapitalize="none"
                keyboardType="email-address"
                style={{
                  borderWidth: 1,
                  borderColor: errors.friend ? '#ff6b8a' : 'rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  padding: 12,
                  color: '#fff',
                  marginBottom: 8,
                }}
              />
              {errors.friend ? <Text style={{ color: '#ff6b8a', fontSize: 11, marginBottom: 12 }}>{errors.friend}</Text> : null}

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
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
                    <Text style={{ color: '#fff', fontWeight: '800' }}>Send Invite</Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={{ padding: 28, alignItems: 'center' }}>
              <Ionicons name="checkmark-circle-outline" size={56} color="#4ade80" />
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 18, marginTop: 12 }}>Invite Sent!</Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
                Your friend at {friendEmail} was invited to {programTitle}.
              </Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export async function defaultInviteHandler(program: string, senderEmail: string, friendEmail: string) {
  const res = await postInvite(program, senderEmail, friendEmail);
  if (!res.ok) throw new Error('Failed');
}
