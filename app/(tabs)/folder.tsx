import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { FolderPlus, Search, X, Folder } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import FolderCard from '@/components/folders/FolderCard';
import { FolderData } from '@/types/folder';
import { MOCK_FOLDERS } from '@/data/folders';

export default function FolderScreen() {
  const [folders, setFolders] = useState<FolderData[]>(MOCK_FOLDERS);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFolderPress = (folderId: string) => {
    router.push(`/folder/${folderId}`);
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: FolderData = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        messageCount: 0,
        color: colors.folderColors[Math.floor(Math.random() * colors.folderColors.length)],
        lastUpdated: new Date().toISOString(),
      };

      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Folders</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <FolderPlus size={20} color={colors.darkText} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search folders..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
            <X size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredFolders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FolderCard 
            folder={item} 
            onPress={() => handleFolderPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Folder size={48} color={colors.lightGray} />
            <Text style={styles.emptyText}>No folders found</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Folder</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.darkText} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.modalInput}
              placeholder="Folder name"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus={true}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalCreateButton,
                  !newFolderName.trim() && styles.modalButtonDisabled
                ]}
                onPress={createNewFolder}
                disabled={!newFolderName.trim()}
              >
                <Text style={styles.modalCreateButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkText,
  },
  addButton: {
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
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: colors.darkText,
  },
  clearButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.darkGray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.darkText,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: colors.darkGray,
    fontWeight: '500',
  },
  modalCreateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  modalCreateButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});