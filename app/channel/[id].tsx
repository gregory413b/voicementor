import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Settings, MoveVertical as MoreVertical, Plus, Send, Mic } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AudioPlayer from '@/components/audio/AudioPlayer';
import { MessageData } from '@/types/message';
import { ContactData } from '@/types/contact';
import { MOCK_MESSAGES } from '@/data/messages';
import { MOCK_CONTACTS } from '@/data/contacts';
import { MOCK_USER } from '@/data/user';

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contact, setContact] = useState<ContactData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [inputText, setInputText] = useState('');

  const canManageUsers = MOCK_USER.isMaster || MOCK_USER.isAdmin;

  useEffect(() => {
    const foundContact = MOCK_CONTACTS.find(c => c.id === id);
    if (foundContact) {
      setContact(foundContact);
      const channelMessages = MOCK_MESSAGES
        .filter(msg => msg.sender.id === id || msg.sender.id === MOCK_USER.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setMessages(channelMessages);
    }
  }, [id]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: MessageData = {
      id: Date.now().toString(),
      content: inputText.trim(),
      sender: {
        id: MOCK_USER.id,
        name: MOCK_USER.name,
        role: MOCK_USER.role,
        email: MOCK_USER.email,
        color: colors.primary,
      },
      timestamp: new Date().toISOString(),
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
  };

  const handleUserManagement = () => {
    if (contact) {
      router.push(`/user/${contact.id}`);
    }
  };

  const renderMessage = ({ item }: { item: MessageData }) => {
    const isIncoming = item.sender.id === id;
    const messageTime = new Date(item.timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    return (
      <View style={[styles.messageContainer, isIncoming ? styles.incomingMessage : styles.outgoingMessage]}>
        {isIncoming && (
          <View style={[styles.avatarContainer, { backgroundColor: item.sender.color }]}>
            <Text style={styles.avatarText}>
              {item.sender.name.charAt(0)}
            </Text>
          </View>
        )}
        <View style={[styles.messageContent, isIncoming ? styles.incomingContent : styles.outgoingContent]}>
          {item.isAudio ? (
            <View style={styles.audioContainer}>
              <AudioPlayer duration={item.duration || 0} />
            </View>
          ) : (
            <Text style={[styles.messageText, isIncoming ? styles.incomingText : styles.outgoingText]}>
              {item.content}
            </Text>
          )}
          <Text style={[styles.messageTime, isIncoming ? styles.incomingTime : styles.outgoingTime]}>
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  if (!contact) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Channel not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{contact.name}</Text>
          <Text style={styles.headerSubtitle}>{contact.role}</Text>
        </View>
        <View style={styles.headerActions}>
          {canManageUsers && (
            <TouchableOpacity style={styles.headerButton} onPress={handleUserManagement}>
              <Settings size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <Plus size={24} color={colors.darkGray} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={inputText.length > 0 ? handleSendMessage : undefined}
          >
            {inputText.length > 0 ? (
              <View style={styles.sendIconContainer}>
                <Send size={20} color="#FFFFFF" />
              </View>
            ) : (
              <Mic size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    maxWidth: '80%',
  },
  incomingMessage: {
    alignSelf: 'flex-start',
  },
  outgoingMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messageContent: {
    borderRadius: 20,
    padding: 12,
    maxWidth: '100%',
  },
  incomingContent: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 4,
  },
  outgoingContent: {
    backgroundColor: colors.lightGray,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  incomingText: {
    color: '#FFFFFF',
  },
  outgoingText: {
    color: colors.darkText,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  incomingTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  outgoingTime: {
    color: colors.darkGray,
  },
  audioContainer: {
    minWidth: 240,
    maxWidth: '100%',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIconContainer: {
    transform: [{ rotate: '45deg' }],
  },
});