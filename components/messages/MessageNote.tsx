import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { NoteData } from '@/types/note';

interface MessageNoteProps {
  note: NoteData;
}

export default function MessageNote({ note }: MessageNoteProps) {
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.timestampButton}>
        <Play size={12} color={colors.primary} style={styles.playIcon} />
        <Text style={styles.timestamp}>{formatTimestamp(note.timestamp)}</Text>
      </TouchableOpacity>
      <Text style={styles.noteText}>{note.text}</Text>
      <Text style={styles.dateText}>{formatDate(note.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 12,
  },
  timestampButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  playIcon: {
    marginRight: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  noteText: {
    fontSize: 16,
    color: colors.darkText,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: colors.darkGray,
    alignSelf: 'flex-end',
  },
});