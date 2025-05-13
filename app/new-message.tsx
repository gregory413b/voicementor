import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Search, X, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MOCK_CONTACTS } from '@/data/contacts';
import { ContactData } from '@/types/contact';
import ContactSelectItem from '@/components/contacts/ContactSelectItem';

export default function NewMessageScreen() {
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<ContactData[]>([]);
  
  const contacts = MOCK_CONTACTS.filter(contact => 
    !selectedContacts.some(c => c.id === contact.id) &&
    (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     contact.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddContact = (contact: ContactData) => {
    setSelectedContacts([...selectedContacts, contact]);
    setSearchQuery('');
  };

  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(selectedContacts.filter(c => c.id !== contactId));
  };

  const handleNext = () => {
    if (title && selectedContacts.length > 0) {
      router.push('/record');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Message</Text>
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            (!title || selectedContacts.length === 0) && styles.nextButtonDisabled
          ]} 
          onPress={handleNext}
          disabled={!title || selectedContacts.length === 0}
        >
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter message title..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipients</Text>
          
          {selectedContacts.length > 0 && (
            <View style={styles.selectedContactsContainer}>
              {selectedContacts.map(contact => (
                <View key={contact.id} style={styles.selectedContact}>
                  <Text style={styles.selectedContactText}>{contact.name}</Text>
                  <TouchableOpacity 
                    style={styles.removeContactButton}
                    onPress={() => handleRemoveContact(contact.id)}
                  >
                    <X size={16} color={colors.darkGray} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.searchContainer}>
            <Search size={20} color={colors.darkGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          {searchQuery && contacts.length > 0 && (
            <View style={styles.contactsDropdown}>
              <FlatList
                data={contacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <ContactSelectItem 
                    contact={item} 
                    onSelect={() => handleAddContact(item)} 
                  />
                )}
                nestedScrollEnabled
                style={styles.contactsList}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          After selecting recipients, you'll be able to record your voice message.
        </Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: colors.darkGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  nextButton: {
    padding: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  selectedContactsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  selectedContact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedContactText: {
    fontSize: 14,
    color: colors.darkText,
    marginRight: 4,
  },
  removeContactButton: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  contactsDropdown: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    marginTop: 8,
    maxHeight: 200,
  },
  contactsList: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  footerText: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
  },
});