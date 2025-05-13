import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MessageCircle, Users, ChevronRight, UserPlus } from 'lucide-react-native';
import { router } from 'expo-router';
import { colors } from '@/constants/colors';
import { MOCK_USER } from '@/data/user';
import { MOCK_MESSAGES } from '@/data/messages';
import { MOCK_NEW_USERS } from '@/data/newUsers';
import { MOCK_SUPERVISEES } from '@/data/supervisees';

export default function DashboardScreen() {
  const recentMessages = MOCK_MESSAGES
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const recentNewUsers = MOCK_NEW_USERS
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 3);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalSupervisees = MOCK_SUPERVISEES.reduce((acc, sup) => acc + (sup.stats?.activeClients || 0), 0);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerBackground}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>{MOCK_USER.name}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              {MOCK_USER.avatarUrl ? (
                <Image source={{ uri: MOCK_USER.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalSupervisees}</Text>
              <Text style={styles.statLabel}>Total Supervisees</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Messages</Text>
            <TouchableOpacity 
              style={styles.seeAllButton} 
              onPress={() => router.push('/messages')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.messagesList}>
            {recentMessages.map(message => (
              <TouchableOpacity 
                key={message.id}
                style={styles.messageCard}
                onPress={() => router.push(`/channel/${message.sender.id}`)}
              >
                <View style={[styles.messageSenderAvatar, { backgroundColor: message.sender.color }]}>
                  <Text style={styles.messageSenderInitial}>
                    {message.sender.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageSender}>{message.sender.name}</Text>
                    <Text style={styles.messageTime}>
                      {formatTime(message.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.messagePreview} numberOfLines={1}>
                    {message.isAudio ? "Voice message" : message.content}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {(MOCK_USER.isMaster || MOCK_USER.isAdmin) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Users</Text>
              <TouchableOpacity 
                style={styles.seeAllButton}
                onPress={() => router.push('/users')}
              >
                <Text style={styles.seeAllText}>Manage Users</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.usersList}>
              {recentNewUsers.map(user => (
                <TouchableOpacity 
                  key={user.id}
                  style={styles.userCard}
                  onPress={() => router.push(`/user/${user.id}`)}
                >
                  <View style={[styles.userAvatar, { backgroundColor: user.color }]}>
                    <Text style={styles.userInitial}>
                      {user.name.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.userContent}>
                    <View style={styles.userHeader}>
                      <Text style={[
                        styles.userName,
                        user.isPending && styles.pendingUserName
                      ]}>
                        {user.name}
                      </Text>
                      <Text style={styles.userTime}>
                        {formatTime(user.registeredAt)}
                      </Text>
                    </View>
                    <View style={styles.userInfo}>
                      <Text style={[
                        styles.userRole,
                        user.isPending && styles.pendingRole
                      ]}>
                        {user.role}
                      </Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  headerBackground: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: -30,
    zIndex: 1,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.darkGray,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.darkText,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  messagesList: {
    gap: 12,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageSenderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageSenderInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
  messageSender: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
  },
  messageTime: {
    fontSize: 12,
    color: colors.darkGray,
  },
  messagePreview: {
    fontSize: 14,
    color: colors.darkGray,
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userContent: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRole: {
    fontSize: 14,
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 8,
  },
  userEmail: {
    fontSize: 14,
    color: colors.darkGray,
  },
  userTime: {
    fontSize: 12,
    color: colors.darkGray,
  },
  pendingUserName: {
    fontWeight: '700',
  },
  pendingRole: {
    backgroundColor: colors.warningLight,
    color: colors.warning,
  },
});