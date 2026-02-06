import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSize, FontWeight, Spacing } from '../utils/theme';
import { getNotificationIcon } from '../utils/helpers';
import { Notification } from '../utils/mockData';

interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

const typeColors: Record<string, string> = {
  task: Colors.primary,
  chat: '#9B59B6',
  payment: Colors.success,
  system: Colors.textSecondary,
};

export default function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const iconColor = typeColors[notification.type] || Colors.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.container, !notification.read && styles.unread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
        <Ionicons
          name={getNotificationIcon(notification.type) as any}
          size={20}
          color={iconColor}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !notification.read && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={styles.body} numberOfLines={2}>
          {notification.body}
        </Text>
        <Text style={styles.time}>{notification.createdAt}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unread: {
    backgroundColor: Colors.unread,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    marginBottom: 2,
  },
  titleUnread: {
    fontWeight: FontWeight.bold,
  },
  body: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginLeft: Spacing.sm,
  },
});
