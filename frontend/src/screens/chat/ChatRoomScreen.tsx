import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadow,
} from '../../utils/theme';
import { mockMessages, currentUser, ChatThread, Message } from '../../utils/mockData';
import Avatar from '../../components/Avatar';
import ChatBubble from '../../components/ChatBubble';

export default function ChatRoomScreen({ navigation, route }: any) {
  const chat: ChatThread = route.params.chat;
  const [messages, setMessages] = useState<Message[]>(
    mockMessages.filter((m) => m.chatId === chat.id)
  );
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Simulate other user typing
    const timer = setTimeout(() => setIsTyping(true), 3000);
    const timer2 = setTimeout(() => setIsTyping(false), 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage: Message = {
      id: `m_new_${Date.now()}`,
      chatId: chat.id,
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: `m_reply_${Date.now()}`,
          chatId: chat.id,
          senderId: chat.otherUser.id,
          text: 'Got it, I\'ll update you shortly! 👍',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };
        setMessages((prev) => [...prev, reply]);
      }, 2000);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Avatar
          name={chat.otherUser.name}
          uri={chat.otherUser.avatar}
          size={38}
          showOnline
          online={chat.otherUser.online}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chat.otherUser.name}</Text>
          <Text style={styles.headerTask} numberOfLines={1}>
            {chat.taskTitle}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Task Info Bar */}
      <View style={styles.taskBar}>
        <Ionicons name="briefcase-outline" size={14} color={Colors.primary} />
        <Text style={styles.taskBarText} numberOfLines={1}>
          {chat.taskTitle}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewTask}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item} isMe={item.senderId === currentUser.id} />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingRow}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>typing</Text>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { opacity: 0.4 }]} />
                  <View style={[styles.typingDot, { opacity: 0.7 }]} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendBtn, inputText.trim() ? styles.sendBtnActive : null]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={inputText.trim() ? '#FFFFFF' : Colors.textLight}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerInfo: {
    flex: 1,
    marginLeft: Spacing.xs,
  },
  headerName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },
  headerTask: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  taskBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '08',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  taskBarText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  viewTask: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  messageList: {
    paddingVertical: Spacing.lg,
  },
  typingRow: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    gap: 4,
  },
  typingText: {
    fontSize: FontSize.sm,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 3,
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.textLight,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
  },
  attachBtn: {
    paddingBottom: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSize.md,
    color: Colors.text,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: Colors.primary,
  },
});
