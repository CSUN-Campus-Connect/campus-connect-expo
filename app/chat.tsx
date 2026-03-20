import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EMAIL_AGENT_MAILTO } from '@/constants/config';
import { ChatHistoryItem, sendChatMessage } from '@/services/chat.service';

const DISCLAIMER = 'Not official CSUN advice. Verify with CSUN sources.';
const RED = '#800020';

type ChatItem = ChatHistoryItem;

export default function ChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [items, setItems] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content:
        'Hi! I can help with general CSUN questions.\n\nAsk away, or choose “Email Agent instead”.\n\n' +
        DISCLAIMER,
    },
  ]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    return () => clearTimeout(t);
  }, [items, loading]);

  const handleSend = useCallback(async () => {
    const text = message.trim();
    if (!text || loading) return;
    setError(null);
    setLoading(true);
    setMessage('');
    const historyForRequest = items;
    setItems((prev) => [...prev, { role: 'user', content: text }]);
    try {
      const reply = await sendChatMessage(text, historyForRequest);
      setItems((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setItems((prev) => prev.slice(0, -1));
      setMessage(text);
      setError(e instanceof Error ? e.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  }, [message, loading, items]);

  const openEmailAgent = useCallback(() => {
    Linking.openURL(EMAIL_AGENT_MAILTO).catch(() => {});
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>CSUN Help</Text>
            <Text style={styles.headerSub}>{DISCLAIMER}</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {items.map((it, idx) => {
            const isUser = it.role === 'user';
            return (
              <View
                key={idx}
                style={[styles.bubbleRow, isUser ? styles.bubbleRowUser : styles.bubbleRowBot]}
              >
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleBot]}>
                  <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{it.content}</Text>
                </View>
              </View>
            );
          })}
          {loading && (
            <View style={[styles.bubbleRow, styles.bubbleRowBot]}>
              <View style={[styles.bubble, styles.bubbleBot, styles.typingRow]}>
                <ActivityIndicator size="small" color={RED} />
                <Text style={styles.typingText}> Typing…</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.emailRow}>
            <Text style={styles.emailLabel}>Email Agent instead:</Text>
            <Pressable style={styles.emailBtn} onPress={openEmailAgent}>
              <Text style={styles.emailBtnText}>Open email</Text>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask a CSUN question…"
              placeholderTextColor="#999"
              editable={!loading}
              multiline
              maxLength={2000}
              onSubmitEditing={() => void handleSend()}
            />
            <Pressable
              style={[styles.sendBtn, (!message.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => void handleSend()}
              disabled={loading || !message.trim()}
            >
              <Text
                style={[
                  styles.sendBtnText,
                  (!message.trim() || loading) && styles.sendBtnTextDisabled,
                ]}
              >
                Send
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED,
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 8,
  },
  backBtn: {
    padding: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  list: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  listContent: {
    padding: 12,
    paddingBottom: 16,
  },
  bubbleRow: {
    marginBottom: 10,
    flexDirection: 'row',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowBot: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  bubbleUser: {
    backgroundColor: RED,
  },
  bubbleBot: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  bubbleText: {
    color: 'rgba(0,0,0,0.86)',
    fontSize: 15,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: '#fff',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
    padding: 12,
  },
  errorBox: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(220,38,38,0.35)',
    backgroundColor: 'rgba(220,38,38,0.06)',
  },
  errorText: {
    color: 'rgba(153,27,27,0.95)',
    fontSize: 12,
    fontWeight: '700',
  },
  emailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  emailLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.65)',
  },
  emailBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    backgroundColor: '#fff',
  },
  emailBtnText: {
    fontWeight: '800',
    color: 'rgba(0,0,0,0.85)',
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 15,
  },
  sendBtn: {
    width: 88,
    height: 44,
    borderRadius: 8,
    backgroundColor: RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
  },
  sendBtnTextDisabled: {
    color: 'rgba(0,0,0,0.35)',
  },
});
