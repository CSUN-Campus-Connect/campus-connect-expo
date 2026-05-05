import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Brand } from '@/constants/brand';
import { SECTION_COPY } from '@/constants/sectionCopy';
import { useLocale } from '@/context/LocaleContext';
import type { ChatTurn } from '@/services/geminiChat';
import { sendGeminiMessage } from '@/services/geminiChat';
import { FeatureScreenShell } from '@/shell/FeatureScreenShell';

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

/** Campus assistant chat (Gemini). */
export function ChatScreen() {
  const { locale } = useLocale();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        'Hi! I’m the Toro Campus Connect assistant. Ask me about CSUN, classes, events, or how to use the app.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { id: `u-${Date.now()}`, role: 'user', text };
    setInput('');
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    scrollToEnd();

    const turns: ChatTurn[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));

    const result = await sendGeminiMessage(turns, { language: locale });

    setLoading(false);

    if ('error' in result) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: `Sorry — ${result.error}`,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', text: result.text },
      ]);
    }
    scrollToEnd();
  };

  return (
    <FeatureScreenShell title={SECTION_COPY.chat.title} noScrollBody>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={scrollToEnd}
        >
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubbleWrap,
                m.role === 'user' ? styles.bubbleWrapUser : styles.bubbleWrapBot,
              ]}
            >
              <View style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={m.role === 'user' ? styles.textUser : styles.textBot}>{m.text}</Text>
              </View>
            </View>
          ))}
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={Brand.primary} />
              <Text style={styles.loadingText}>Thinking…</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about campus, events, or the app…"
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={2000}
            editable={!loading}
          />
          <Pressable
            onPress={send}
            disabled={loading || !input.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              (loading || !input.trim()) && styles.sendBtnDisabled,
              pressed && styles.sendBtnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </FeatureScreenShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  bubbleWrap: {
    marginBottom: 10,
    maxWidth: '92%',
  },
  bubbleWrapUser: {
    alignSelf: 'flex-end',
  },
  bubbleWrapBot: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleUser: {
    backgroundColor: Brand.primary,
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  textUser: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
  textBot: {
    color: '#111',
    fontSize: 15,
    lineHeight: 22,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 10 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
  sendBtnPressed: {
    opacity: 0.85,
  },
});

export default ChatScreen;
