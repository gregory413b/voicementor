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

  const analyticsCategories = MOCK_SUPERVISEES.length > 0 ? {
    messageLength: MOCK_SUPERVISEES
      .map(supervisee => ({
        name: supervisee.name,
        value: (supervisee.stats?.messagesPerWeek || []).reduce((a, b) => a + b, 0) / 7,
        color: supervisee.color,
      }))
      .sort((a, b) => (typeof b.value === 'number' && typeof a.value === 'number' ? b.value - a.value : 0)),

    responseTime: MOCK_SUPERVISEES
      .map(supervisee => ({
        name: supervisee.name,
        value: (supervisee.stats?.responseTime || []).reduce((a, b) => a + b, 0) / (supervisee.stats?.responseTime?.length || 1),
        color: supervisee.color,
      }))
      .sort((a, b) => (typeof b.value === 'number' && typeof a.value === 'number' ? b.value - a.value : 0)),

    monthlyRetention: MOCK_SUPERVISEES
      .map(supervisee => ({
        name: supervisee.name,
        value: supervisee.stats?.monthlyRetention || 0,
        color: supervisee.color,
      }))
      .sort((a, b) => (typeof b.value === 'number' && typeof a.value === 'number' ? b.value - a.value : 0)),
  } : {
    messageLength: [],
    responseTime: [],
    monthlyRetention: [],
  };

  const calculateBarWidth = (value: number, maxValue: number) => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 100;
  };

  const formatAnalyticsValue = (value: number | undefined, suffix: string) => {
    if (typeof value !== 'number') return 'N/A';
    return `${value.toFixed(1)}${suffix}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.headerGradient}>
        <View style={styles.header}>
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
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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

        {MOCK_USER.role === 'Training Director' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Analytics</Text>
            <View style={styles.analyticsContainer}>
              <View style={styles.totalStats}>
                <View style={styles.totalStat}>
                  <Text style={styles.totalStatLabel}>Total Supervisees</Text>
                  <Text style={styles.totalStatValue}>
                    {MOCK_SUPERVISEES.reduce((acc, sup) => acc + (sup.stats?.activeClients || 0), 0)}
                  </Text>
                </View>
              </View>

              <View style={styles.analyticsCategory}>
                <Text style={styles.categoryTitle}>Average Message Length</Text>
                {analyticsCategories.messageLength.map((item) => (
                  <View key={item.name} style={styles.analyticsBar}>
                    <View 
                      style={[
                        styles.analyticsProgress, 
                        { 
                          width: `${calculateBarWidth(
                            typeof item.value === 'number' ? item.value : 0,
                            typeof analyticsCategories.messageLength[0]?.value === 'number' ? analyticsCategories.messageLength[0].value : 0
                          )}%`,
                          backgroundColor: item.color,
                        }
                      ]} 
                    />
                    <View style={styles.analyticsContent}>
                      <Text style={styles.analyticsName}>{item.name}</Text>
                      <Text style={styles.analyticsValue}>
                        {formatAnalyticsValue(item.value, 'm')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.analyticsCategory}>
                <Text style={styles.categoryTitle}>Average Response Time</Text>
                {analyticsCategories.responseTime.map((item) => (
                  <View key={item.name} style={styles.analyticsBar}>
                    <View 
                      style={[
                        styles.analyticsProgress, 
                        { 
                          width: `${calculateBarWidth(
                            typeof item.value === 'number' ? item.value : 0,
                            typeof analyticsCategories.responseTime[0]?.value === 'number' ? analyticsCategories.responseTime[0].value : 0
                          )}%`,
                          backgroundColor: item.color,
                        }
                      ]} 
                    />
                    <View style={styles.analyticsContent}>
                      <Text style={styles.analyticsName}>{item.name}</Text>
                      <Text style={styles.analyticsValue}>
                        {formatAnalyticsValue(item.value, 'h')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.analyticsCategory}>
                <Text style={styles.categoryTitle}>Average Monthly Retention</Text>
                {analyticsCategories.monthlyRetention.map((item) => (
                  <View key={item.name} style={styles.analyticsBar}>
                    <View 
                      style={[
                        styles.analyticsProgress, 
                        { 
                          width: `${calculateBarWidth(
                            typeof item.value === 'number' ? item.value : 0,
                            typeof analyticsCategories.monthlyRetention[0]?.value === 'number' ? analyticsCategories.monthlyRetention[0].value : 0
                          )}%`,
                          backgroundColor: item.color,
                        }
                      ]} 
                    />
                    <View style={styles.analyticsContent}>
                      <Text style={styles.analyticsName}>{item.name}</Text>
                      <Text style={styles.analyticsValue}>
                        {formatAnalyticsValue(item.value, 'm')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
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
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
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
  scrollView: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
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
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 16,
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
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: 16,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  analyticsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    gap: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 12,
  },
  analyticsBar: {
    height: 44,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  analyticsProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    opacity: 0.2,
  },
  analyticsContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  analyticsName: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: '500',
  },
  analyticsValue: {
    fontSize: 14,
    color: colors.darkText,
    fontWeight: '600',
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  totalStat: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  totalStatLabel: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 8,
  },
  totalStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.darkText,
  },
  pendingUserName: {
    fontWeight: '700',
  },
  pendingRole: {
    backgroundColor: colors.warningLight,
    color: colors.warning,
  },
});