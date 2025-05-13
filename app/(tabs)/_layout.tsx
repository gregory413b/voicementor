import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import TabBarIcon from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.darkGray,
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.lightGray,
          height: 50,
          paddingBottom: 0,
          paddingTop: 0,
        },
        headerShown: false,
      }}
    >
      {/* Only include the 4 main tabs */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon="LayoutDashboard" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon="MessageCircle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="folder"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon="Folder" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon="User" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}