import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  LayoutDashboard,
  MessageCircle,
  Folder,
  User
} from 'lucide-react-native';

interface TabBarIconProps {
  icon: string;
  color: string;
  size: number;
  containerStyle?: any;
}

export default function TabBarIcon({ icon, color, size, containerStyle }: TabBarIconProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'LayoutDashboard':
        return <LayoutDashboard size={size} color={color} />;
      case 'MessageCircle':
        return <MessageCircle size={size} color={color} />;
      case 'Folder':
        return <Folder size={size} color={color} />;
      case 'User':
        return <User size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {renderIcon()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});