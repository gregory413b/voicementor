import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Shield, Settings, ChevronDown, Save, Users, Clock, MessageSquare, UserCheck } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { MOCK_USER } from '@/data/user';
import { MOCK_NEW_USERS } from '@/data/newUsers';
import { MOCK_CONTACTS } from '@/data/contacts';
import { MOCK_SUPERVISEES } from '@/data/supervisees';
import { UserRole, UserData } from '@/types/user';
import { AuthService } from '@/services/AuthService';

const ROLE_DESCRIPTIONS = {
  Master: 'Full access to all features and user management. Only one Master account can exist.',
  Admin: 'Administrative access to manage users and system settings.',
  'Training Director': 'Oversees mentors and their client relationships.',
  Mentor: 'Works directly with clients and supervises students.',
  Student: 'In training to become a mentor, learning under supervision.',
  Client: 'Receives mentorship and support through the platform.',
};

const AVAILABLE_ROLES: UserRole[] = [
  'Training Director',
  'Mentor',
  'Student',
  'Client'
];

export default function UserManagementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showDirectorSelect, setShowDirectorSelect] = useState(false);
  const [showMentorSelect, setShowMentorSelect] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalUser, setOriginalUser] = useState<UserData | null>(null);

  const directors = MOCK_CONTACTS.filter(contact => 
    contact.role === 'Training Director'
  );

  const mentors = MOCK_CONTACTS.filter(contact => 
    contact.role === 'Mentor'
  );

  useEffect(() => {
    const foundUser = [...MOCK_NEW_USERS, ...MOCK_CONTACTS].find(u => u.id === id);
    if (foundUser) {
      setUser(foundUser);
      setOriginalUser(foundUser);
    }
  }, [id]);

  const handleRoleChange = (newRole: UserRole) => {
    if (!user) return;
    setUser({ 
      ...user, 
      role: newRole,
      supervisorId: null,
      isPending: false
    });
    setHasUnsavedChanges(true);
    setShowRoleSelect(false);
  };

  const handleAssignDirector = (directorId: string | null) => {
    if (!user) return;
    setUser({ ...user, supervisorId: directorId });
    setHasUnsavedChanges(true);
    setShowDirectorSelect(false);
  };

  const handleAssignMentor = (mentorId: string | null) => {
    if (!user) return;
    setUser({ ...user, supervisorId: mentorId });
    setHasUnsavedChanges(true);
    setShowMentorSelect(false);
  };

  const handleToggleAdmin = () => {
    if (!user || !canToggleAdmin) return;
    setUser({ ...user, isAdmin: !user.isAdmin });
    setHasUnsavedChanges(true);
  };

  const handleToggleActive = async () => {
    if (!user || user.role !== 'Client') return;
    setUser({ ...user, isActive: !user.isActive });
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user || !hasUnsavedChanges) return;

    setIsLoading(true);
    try {
      if (user.role !== originalUser?.role) {
        const roleSuccess = await AuthService.updateUserRole(user.id, user.role);
        if (!roleSuccess) throw new Error('Failed to update role');
      }

      if (user.supervisorId !== originalUser?.supervisorId) {
        const supervisorSuccess = await AuthService.assignSupervisor(user.id, user.supervisorId || '');
        if (!supervisorSuccess) throw new Error('Failed to assign supervisor');
      }

      if (user.isAdmin !== originalUser?.isAdmin) {
        const adminSuccess = await AuthService.toggleAdminStatus(user.id);
        if (!adminSuccess) throw new Error('Failed to update admin status');
      }

      setOriginalUser(user);
      setHasUnsavedChanges(false);
      Alert.alert('Success', 'Changes saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentDirector = () => {
    if (!user?.supervisorId) return 'None';
    const director = directors.find(d => d.id === user.supervisorId);
    return director ? director.name : 'None';
  };

  const getCurrentMentor = () => {
    if (!user?.supervisorId) return 'None';
    const mentor = mentors.find(m => m.id === user.supervisorId);
    return mentor ? mentor.name : 'None';
  };

  const canManageRoles = MOCK_USER.isMaster || MOCK_USER.isAdmin;
  const canToggleAdmin = MOCK_USER.isMaster;

  const superviseeData = MOCK_SUPERVISEES.find(s => s.id === user?.id || 
    MOCK_CONTACTS.find(c => 
      c.role === user?.role && 
      c.name === user?.name
    )?.id
  );
  const isSupervisor = MOCK_USER.role === 'Training Director' || MOCK_USER.role === 'Mentor';
  const canViewAnalytics = (MOCK_USER.isMaster || isSupervisor) && superviseeData;

  const calculateAnalytics = () => {
    if (!superviseeData) return null;

    return {
      activeClients: superviseeData.stats.activeClients,
      avgMessageLength: superviseeData.stats.messageLength.reduce((a, b) => a + b, 0) / superviseeData.stats.messageLength.length,
      avgResponseTime: superviseeData.stats.responseTime.reduce((a, b) => a + b, 0) / superviseeData.stats.responseTime.length,
      avgMonthlyRetention: superviseeData.stats.monthlyRetention.reduce((a, b) => a + b, 0) / superviseeData.stats.monthlyRetention.length
    };
  };

  const analytics = calculateAnalytics();

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.darkText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>User not found</Text>
          <View style={styles.placeholder} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.darkText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage User</Text>
        <TouchableOpacity 
          style={[styles.saveButton, (!hasUnsavedChanges || isLoading) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!hasUnsavedChanges || isLoading}
        >
          <Save size={20} color={hasUnsavedChanges ? colors.primary : colors.darkGray} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: user.color }]}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          
          <View style={styles.badgeContainer}>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{user.role}</Text>
            </View>
            {user.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
        </View>

        {canManageRoles && (
          <>
            <Text style={styles.sectionTitle}>User Role</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowRoleSelect(!showRoleSelect)}
              disabled={isLoading}
            >
              <Text style={styles.selectButtonText}>{user.role}</Text>
              <ChevronDown size={20} color={colors.darkGray} />
            </TouchableOpacity>

            {showRoleSelect && (
              <View style={styles.selectDropdown}>
                {AVAILABLE_ROLES.map(role => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.selectOption,
                      user.role === role && styles.selectedOption
                    ]}
                    onPress={() => handleRoleChange(role)}
                    disabled={isLoading || user.role === role}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      user.role === role && styles.selectedOptionText
                    ]}>
                      {role}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {(user.role === 'Student' || user.role === 'Mentor') && (
          <>
            <Text style={styles.sectionTitle}>Assigned Training Director</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowDirectorSelect(!showDirectorSelect)}
              disabled={isLoading}
            >
              <Text style={styles.selectButtonText}>{getCurrentDirector()}</Text>
              <ChevronDown size={20} color={colors.darkGray} />
            </TouchableOpacity>

            {showDirectorSelect && (
              <View style={styles.selectDropdown}>
                <TouchableOpacity
                  style={styles.selectOption}
                  onPress={() => handleAssignDirector(null)}
                >
                  <Text style={styles.selectOptionText}>None</Text>
                </TouchableOpacity>
                {directors.map(director => (
                  <TouchableOpacity
                    key={director.id}
                    style={[
                      styles.selectOption,
                      user.supervisorId === director.id && styles.selectedOption
                    ]}
                    onPress={() => handleAssignDirector(director.id)}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      user.supervisorId === director.id && styles.selectedOptionText
                    ]}>
                      {director.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {user.role === 'Client' && (
          <>
            <Text style={styles.sectionTitle}>Assigned Mentor</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setShowMentorSelect(!showMentorSelect)}
              disabled={isLoading}
            >
              <Text style={styles.selectButtonText}>{getCurrentMentor()}</Text>
              <ChevronDown size={20} color={colors.darkGray} />
            </TouchableOpacity>

            {showMentorSelect && (
              <View style={styles.selectDropdown}>
                <TouchableOpacity
                  style={styles.selectOption}
                  onPress={() => handleAssignMentor(null)}
                >
                  <Text style={styles.selectOptionText}>None</Text>
                </TouchableOpacity>
                {mentors.map(mentor => (
                  <TouchableOpacity
                    key={mentor.id}
                    style={[
                      styles.selectOption,
                      user.supervisorId === mentor.id && styles.selectedOption
                    ]}
                    onPress={() => handleAssignMentor(mentor.id)}
                  >
                    <Text style={[
                      styles.selectOptionText,
                      user.supervisorId === mentor.id && styles.selectedOptionText
                    ]}>
                      {mentor.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </>
        )}

        {canViewAnalytics && analytics && (
          <>
            <Text style={styles.sectionTitle}>Performance Analytics</Text>
            <View style={styles.analyticsGrid}>
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIconContainer}>
                  <Users size={24} color={colors.primary} />
                </View>
                <Text style={styles.analyticsValue}>{analytics.activeClients}</Text>
                <Text style={styles.analyticsLabel}>Active Clients</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIconContainer}>
                  <MessageSquare size={24} color={colors.success} />
                </View>
                <Text style={styles.analyticsValue}>{analytics.avgMessageLength.toFixed(1)}m</Text>
                <Text style={styles.analyticsLabel}>Avg Message Length</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIconContainer}>
                  <Clock size={24} color={colors.warning} />
                </View>
                <Text style={styles.analyticsValue}>{analytics.avgResponseTime.toFixed(1)}h</Text>
                <Text style={styles.analyticsLabel}>Avg Response Time</Text>
              </View>

              <View style={styles.analyticsCard}>
                <View style={styles.analyticsIconContainer}>
                  <UserCheck size={24} color={colors.accent} />
                </View>
                <Text style={styles.analyticsValue}>{analytics.avgMonthlyRetention.toFixed(1)}m</Text>
                <Text style={styles.analyticsLabel}>Avg Monthly Retention</Text>
              </View>
            </View>
          </>
        )}

        {user.role === 'Client' && (
          <>
            <Text style={styles.sectionTitle}>Client Status</Text>
            <TouchableOpacity
              style={[styles.statusToggle, user.isActive && styles.statusToggleActive]}
              onPress={handleToggleActive}
              disabled={isLoading}
            >
              <View style={styles.statusToggleContent}>
                <UserCheck size={24} color={user.isActive ? colors.success : colors.darkGray} />
                <View style={styles.statusToggleText}>
                  <Text style={[
                    styles.statusToggleTitle,
                    user.isActive && styles.statusToggleTitleActive
                  ]}>
                    {user.isActive ? 'Active Client' : 'Inactive Client'}
                  </Text>
                  <Text style={styles.statusToggleDescription}>
                    {user.isActive
                      ? 'Client is currently receiving mentorship'
                      : 'Client is not currently receiving mentorship'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
        )}

        {canToggleAdmin && (
          <>
            <Text style={styles.sectionTitle}>Administrative Access</Text>
            <TouchableOpacity
              style={[styles.adminToggle, user.isAdmin && styles.adminToggleActive]}
              onPress={handleToggleAdmin}
              disabled={isLoading}
            >
              <View style={styles.adminToggleContent}>
                <Shield size={24} color={user.isAdmin ? colors.warning : colors.darkGray} />
                <View style={styles.adminToggleText}>
                  <Text style={[
                    styles.adminToggleTitle,
                    user.isAdmin && styles.adminToggleTitleActive
                  ]}>
                    {user.isAdmin ? 'Remove Admin Access' : 'Grant Admin Access'}
                  </Text>
                  <Text style={styles.adminToggleDescription}>
                    {user.isAdmin
                      ? 'Remove administrative privileges from this user'
                      : 'Grant this user administrative privileges'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  adminBadgeText: {
    color: colors.warning,
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 16,
    marginTop: 24,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.darkText,
  },
  selectDropdown: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
  },
  selectOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedOption: {
    backgroundColor: colors.primaryLight,
  },
  selectOptionText: {
    fontSize: 16,
    color: colors.darkText,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  adminToggle: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  adminToggleActive: {
    backgroundColor: colors.warningLight,
  },
  adminToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminToggleText: {
    flex: 1,
    marginLeft: 16,
  },
  adminToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  adminToggleTitleActive: {
    color: colors.warning,
  },
  adminToggleDescription: {
    fontSize: 14,
    color: colors.darkGray,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  analyticsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.darkText,
    marginBottom: 4,
  },
  analyticsLabel: {
    fontSize: 14,
    color: colors.darkGray,
    textAlign: 'center',
  },
  statusToggle: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  statusToggleActive: {
    backgroundColor: colors.successLight,
  },
  statusToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusToggleText: {
    flex: 1,
    marginLeft: 16,
  },
  statusToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  statusToggleTitleActive: {
    color: colors.success,
  },
  statusToggleDescription: {
    fontSize: 14,
    color: colors.darkGray,
  },
});