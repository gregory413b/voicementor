import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Play, X, Check } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import AudioPlayer from '@/components/audio/AudioPlayer';
import MessageNote from '@/components/messages/MessageNote';
import { MOCK_MESSAGES } from '@/data/messages';
import { MOCK_NOTES } from '@/data/notes';
import { MessageData } from '@/types/message';
import { NoteData } from '@/types/note';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState<MessageData | null>(null);
  const [messageNotes, setMessageNotes] = useState<NoteData[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [currentTimePosition, setCurrentTimePosition] = useState(0);

  useEffect(() => {
    const foundMessage = MOCK_MESSAGES.find(msg => msg.id === id);
    if (foundMessage) {
      setMessage(foundMessage);
      setIsBookmarked(foundMessage.isBookmarked || false);
    }

    const notesBelongingToMessage = MOCK_NOTES.filter(note => note.messageId === id);
    setMessageNotes(notesBelongingToMessage);
  }, [id]);

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const newNoteItem: NoteData = {
      id: Date.now().toString(),
      messageId: id || '',
      text: newNote,
      timestamp: Math.round(currentTimePosition),
      createdAt: new Date().toISOString(),
    };

    setMessageNotes([...messageNotes, newNoteItem]);
    setNewNote('');
    setIsAddingNote(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!message) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft size={24} color={colors.darkText} />
          </TouchableOpacity>
          <View style={styles.placeholder} />
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text>Message not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <ArrowLeft size={24} color={colors.darkText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkButton} onPress={handleToggleBookmark}>
          {isBookmarked ? (
            <Check size={24} color={colors.primary} />
          ) : (
            <Check size={24} color={colors.darkGray} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.messageInfo}>
          <View style={styles.senderInfo}>
            <View style={[styles.senderAvatar, { backgroundColor: message.sender.color }]}>
              <Text style={styles.senderInitials}>
                {message.sender.name.charAt(0)}
              </Text>
            </View>
            <View>
              <Text style={styles.senderName}>{message.sender.name}</Text>
              <Text style={styles.timeText}>
                {formatDate(message.timestamp)}
              </Text>
            </View>
          </View>
          
          {message.isAudio ? (
            <View style={styles.playerContainer}>
              <AudioPlayer 
                duration={message.duration || 0} 
                onTimeUpdate={setCurrentTimePosition}
              />
            </View>
          ) : (
            <Text style={styles.messageContent}>{message.content}</Text>
          )}
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.notesSection}>
          <View style={styles.notesHeader}>
            <Text style={styles.sectionTitle}>Notes</Text>
            {messageNotes.length > 0 && (
              <Text style={styles.noteCount}>{messageNotes.length}</Text>
            )}
          </View>

          {messageNotes.length > 0 ? (
            <View style={styles.notesList}>
              {messageNotes.map(note => (
                <MessageNote key={note.id} note={note} />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyNotesText}>
              No notes for this message. Tap the button below to add a note.
            </Text>
          )}
        </View>
      </ScrollView>

      {isAddingNote ? (
        <View style={styles.addNoteContainer}>
          <View style={styles.noteInputContainer}>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note at current playback position..."
              value={newNote}
              onChangeText={setNewNote}
              multiline
              autoFocus
            />
          </View>
          <View style={styles.noteButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !newNote.trim() && styles.saveButtonDisabled
              ]}
              onPress={handleAddNote}
              disabled={!newNote.trim()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addNoteButton}
          onPress={() => setIsAddingNote(true)}
        >
          <Play size={20} color="#FFFFFF" />
          <Text style={styles.addNoteText}>Add Note</Text>
        </TouchableOpacity>
      )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    padding: 8,
  },
  bookmarkButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  messageInfo: {
    marginBottom: 16,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  senderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  senderInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
  },
  timeText: {
    fontSize: 14,
    color: colors.darkGray,
  },
  messageContent: {
    fontSize: 16,
    color: colors.darkText,
    lineHeight: 24,
  },
  playerContainer: {
    marginVertical: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 24,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  noteCount: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.darkGray,
    backgroundColor: colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  notesList: {
    gap: 12,
  },
  emptyNotesText: {
    color: colors.darkGray,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
  addNoteButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addNoteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNoteContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  noteInputContainer: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
    padding: 8,
  },
  noteInput: {
    maxHeight: 100,
    fontSize: 16,
    color: colors.darkText,
  },
  noteButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  saveButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});