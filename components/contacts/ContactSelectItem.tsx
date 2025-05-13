import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { ContactData } from '@/types/contact';

interface ContactSelectItemProps {
  contact: ContactData;
  onSelect: () => void;
}

export default function ContactSelectItem({ contact, onSelect }: ContactSelectItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      {contact.avatarUrl ? (
        <Image source={{ uri: contact.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: contact.color }]}>
          <Text style={styles.avatarText}>
            {contact.name.charAt(0)}
          </Text>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.role}>{contact.role}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 2,
  },
  role: {
    fontSize: 12,
    color: colors.darkGray,
  },
});