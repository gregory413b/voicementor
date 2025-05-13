import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Mail, Phone, CircleHelp as HelpCircle, Shield, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface MenuOptionProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export default function MenuOption({ icon, title, subtitle, onPress }: MenuOptionProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'Mail':
        return <Mail size={20} color={colors.darkText} />;
      case 'Phone':
        return <Phone size={20} color={colors.darkText} />;
      case 'HelpCircle':
        return <HelpCircle size={20} color={colors.darkText} />;
      case 'Shield':
        return <Shield size={20} color={colors.darkText} />;
      case 'FileText':
        return <FileText size={20} color={colors.darkText} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.icon}>{renderIcon()}</View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color={colors.darkGray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  icon: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.darkText,
  },
  subtitle: {
    fontSize: 14,
    color: colors.darkGray,
    marginTop: 2,
  },
});