import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Folder } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { FolderData } from '@/types/folder';

interface FolderCardProps {
  folder: FolderData;
  onPress: () => void;
}

export default function FolderCard({ folder, onPress }: FolderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: folder.color }]} 
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Folder size={32} color="#FFFFFF" />
      </View>
      <Text style={styles.folderName} numberOfLines={1}>
        {folder.name}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={styles.messageCount}>
          {folder.messageCount} {folder.messageCount === 1 ? 'message' : 'messages'}
        </Text>
        <Text style={styles.updatedDate}>
          {formatDate(folder.lastUpdated)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 160,
    justifyContent: 'space-between',
    maxWidth: '48%',
  },
  iconContainer: {
    marginBottom: 8,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  updatedDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});