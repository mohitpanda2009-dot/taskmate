import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../utils/theme';
import { mockChats } from '../../utils/mockData';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';

export default function ChatListScreen({ navigation }: any) {
  const renderChat = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity
      style={[styles.chatItem, item.unreadCount > 0 && styles.chatItemUnread]}
      onPress={() => navigation.navigate('ChatRoom', { chat: item })}
      activeOpacity={0.7}
    >
      <Avatar
        name={item.otherUser.name}
        uri={item.otherUser.avatar}
        size={50}
        showOnline
        online={item.otherUser.online}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatTopRow}>
          <Text
            style={[styles.chatName, item.unreadCount > 0 && styles.chatNameUnread]}
            numberOfLines={1}
          >
            {item.otherUser.name}
          </Text>
          <Text
            style={[
              styles.chatTime,
              item.unreadCount > 0 && styles.chatTimeUnread,
            ]}
          >
            {item.lastMessageTime}
          </Text>
        </View>
        <Text style={styles.taskTitle} numberOfLines={1}>
          {item.taskTitle}
        </Text>
        <View style={styles.chatBottomRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChat}
        contentContainerStyle={mockChats.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No chats yet"
            subtitle="Start a conversation by applying to a task or accepting an applicant."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    ...Shadow.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  chatItemUnread: {
    backgroundColor: Colors.unread,
  },
  chatContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  chatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.medium,
    color: Colors.text,
    flex: 1,
  },
  chatNameUnread: {
    fontWeight: FontWeight.bold,
  },
  chatTime: {
    fontSize: FontSize.xs,
    color: Colors.textLight,
    marginLeft: Spacing.sm,
  },
  chatTimeUnread: {
    color: Colors.primary,
    fontWeight: FontWeight.semibold,
  },
  taskTitle: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    marginTop: 1,
  },
  chatBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  lastMessage: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    flex: 1,
  },
  lastMessageUnread: {
    color: Colors.text,
    fontWeight: FontWeight.medium,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Spacing.sm,
  },
  unreadText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
  },
});
