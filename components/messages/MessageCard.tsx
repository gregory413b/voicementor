import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mic } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MessageData } from '@/types/message';

interface MessageCardProps {
  message: MessageData;
  onPress: () => void;
}

export default function MessageCard({ message, onPress }: MessageCardProps) {
  const formatDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const now = new Date();
    
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    }
    
    if (messageDate.getFullYear() === now.getFullYear()) {
      return messageDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    return messageDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {message.sender.avatarUrl ? (
          <View style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: message.sender.color }]}>
            <Text style={styles.avatarText}>
              {message.sender.name.charAt(0)}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.senderName} numberOfLines={1}>
            {message.sender.name}
          </Text>
          <Text style={styles.timestamp}>
            {formatDate(message.timestamp)}
          </Text>
        </View>
        <View style={styles.messagePreview}>
          {message.isAudio ? (
            <View style={styles.audioIndicator}>
              <Mic size={14} color={colors.darkGray} />
              <Text style={styles.previewText}>Audio recording</Text>
            </View>
          ) : (
            <Text style={styles.previewText} numberOfLines={1}>
              {message.content}
            </Text>
          )}
        </View>
      </View>
      {message.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGray,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 15,
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
});