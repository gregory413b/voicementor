import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Settings, Camera, Bell, Moon, CircleHelp as HelpCircle, Shield, FileText, LogOut } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { AuthService } from '@/services/AuthService';
import { MOCK_USER } from '@/data/user';
import MenuOption from '@/components/profile/MenuOption';

export default function ProfileScreen() {
  const [user, setUser] = useState(MOCK_USER);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      router.replace('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/settings')}
        >
          <Settings size={20} color={colors.darkText} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {user.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profileInitials}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editImageButton}>
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileRole}>{user.role}</Text>

        <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Account</Text>
      </View>

      <View style={styles.menuSection}>
        <MenuOption 
          icon="Mail" 
          title="Email" 
          subtitle={user.email} 
          onPress={() => {}}
        />
        <MenuOption 
          icon="Phone" 
          title="Phone" 
          subtitle={user.phone || "Add phone number"} 
          onPress={() => {}}
        />
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Preferences</Text>
      </View>

      <View style={styles.menuSection}>
        <View style={styles.switchOption}>
          <Bell size={20} color={colors.darkText} style={styles.optionIcon} />
          <Text style={styles.switchOptionText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={notificationsEnabled ? colors.primary : '#FFFFFF'}
          />
        </View>
        <View style={styles.switchOption}>
          <Moon size={20} color={colors.darkText} style={styles.optionIcon} />
          <Text style={styles.switchOptionText}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: colors.lightGray, true: colors.primaryLight }}
            thumbColor={darkModeEnabled ? colors.primary : '#FFFFFF'}
          />
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>More</Text>
      </View>

      <View style={styles.menuSection}>
        <MenuOption 
          icon="HelpCircle" 
          title="Help & Support" 
          onPress={() => {}}
        />
        <MenuOption 
          icon="Shield" 
          title="Privacy Policy" 
          onPress={() => {}}
        />
        <MenuOption 
          icon="FileText" 
          title="Terms of Service" 
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={colors.error} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.darkText,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.darkText,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: colors.darkGray,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.darkText,
  },
  menuSection: {
    backgroundColor: colors.lightGray,
    borderRadius: 16,
    overflow: 'hidden',
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  optionIcon: {
    marginRight: 16,
  },
  switchOptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.darkText,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderRadius: 16,
  },
  logoutIcon: {
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: colors.darkGray,
  },
});