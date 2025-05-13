import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Search, X, Filter, MessageCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MOCK_MESSAGES } from '@/data/messages';
import { MOCK_CONTACTS } from '@/data/contacts';
import { MOCK_USER } from '@/data/user';
import { MessageData } from '@/types/message';

export default function MessagesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const organizedMessages = useMemo(() => {
    // Get the latest message for each unique sender
    const latestMessages = MOCK_MESSAGES.reduce((acc, message) => {
      const existingMessage = acc.get(message.sender.id);
      if (!existingMessage || new Date(message.timestamp) > new Date(existingMessage.timestamp)) {
        acc.set(message.sender.id, message);
      }
      return acc;
    }, new Map<string, MessageData>());

    // Convert to array and filter based on search
    const uniqueMessages = Array.from(latestMessages.values()).filter(message => 
      message.content?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      message.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (MOCK_USER.isMaster || MOCK_USER.role === 'Training Director') {
      return [
        {
          title: 'Training Directors',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Training Director')
          ),
        },
        {
          title: 'Mentors',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Mentor')
          ),
        },
        {
          title: 'Students',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Student')
          ),
        },
        {
          title: 'Clients',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Client')
          ),
        },
      ].filter(section => section.data.length > 0);
    } else if (MOCK_USER.role === 'Mentor') {
      return [
        {
          title: 'Training Director',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Training Director')
          ),
        },
        {
          title: 'Students',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Student')
          ),
        },
        {
          title: 'Clients',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Client')
          ),
        },
      ].filter(section => section.data.length > 0);
    } else if (MOCK_USER.role === 'Student') {
      return [
        {
          title: 'Training Director',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Training Director')
          ),
        },
        {
          title: 'Mentor',
          data: uniqueMessages.filter(msg => 
            MOCK_CONTACTS.find(c => c.id === msg.sender.id && c.role === 'Mentor')
          ),
        },
      ].filter(section => section.data.length > 0);
    }

    // For Client role, show all messages in a single section
    return [{ title: 'Messages', data: uniqueMessages }];
  }, [searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderMessage = ({ item }: { item: MessageData }) => (
    <TouchableOpacity
      style={styles.messageCard}
      onPress={() => router.push(`/channel/${item.sender.id}`)}
    >
      <View style={[styles.avatar, { backgroundColor: item.sender.color }]}>
        <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.sender.name}</Text>
          <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
        </View>
        
        <View style={styles.messagePreview}>
          {item.isAudio ? (
            <View style={styles.audioIndicator}>
              <Text style={styles.previewText}>Audio message</Text>
            </View>
          ) : (
            <Text style={styles.previewText} numberOfLines={1}>
              {item.content}
            </Text>
          )}
        </View>
      </View>

      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MessageCircle size={48} color={colors.lightGray} />
      <Text style={styles.emptyText}>No messages found</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color={colors.darkText} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.darkGray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={() => setSearchQuery('')}
          >
            <X size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      <SectionList
        sections={organizedMessages}
        renderItem={renderMessage}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmptyComponent}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity 
        style={styles.newMessageButton}
        onPress={() => router.push('/new-message')}
      >
        <Text style={styles.newMessageText}>New Message</Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkText,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.darkText,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
  },
  timestamp: {
    fontSize: 12,
    color: colors.darkGray,
  },
  messagePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  newMessageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});