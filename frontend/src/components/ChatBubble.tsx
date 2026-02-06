import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../utils/theme';
import { Message } from '../utils/mockData';

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
}

export default function ChatBubble({ message, isMe }: ChatBubbleProps) {
  return (
    <View style={[styles.row, isMe && styles.rowMe]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>
          {message.text}
        </Text>
        <View style={styles.meta}>
          <Text style={[styles.time, isMe ? styles.timeMe : styles.timeOther]}>
            {message.timestamp}
          </Text>
          {isMe && (
            <Text style={styles.readStatus}>{message.read ? '✓✓' : '✓'}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: FontSize.md + 1,
    lineHeight: 22,
  },
  textMe: {
    color: '#FFFFFF',
  },
  textOther: {
    color: Colors.text,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  time: {
    fontSize: FontSize.xs,
  },
  timeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  timeOther: {
    color: Colors.textLight,
  },
  readStatus: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
});
