import { SuperviseeData } from '@/types/supervisee';
import { colors } from '@/constants/colors';

export const MOCK_SUPERVISEES: SuperviseeData[] = [
  {
    id: 'mentor-1',  // Matches the ID in MOCK_CONTACTS
    name: 'Michael Chen',
    role: 'Mentor',
    email: 'michael.chen@example.com',
    stats: {
      activeClients: 28,
      messageLength: [12, 15, 10, 14, 13, 11, 16], // Average message length in minutes
      responseTime: [2.1, 1.9, 2.4, 2.0, 1.8], // Hours
      monthlyRetention: [8, 12, 10, 9, 11], // Months
    },
    color: colors.success,
  },
  {
    id: 'mentor-2',  // Matches the ID in MOCK_CONTACTS
    name: 'Lisa Thompson',
    role: 'Mentor',
    email: 'lisa.thompson@example.com',
    stats: {
      activeClients: 24,
      messageLength: [10, 13, 11, 12, 14, 9, 15],
      responseTime: [2.5, 2.0, 2.8, 2.2, 1.9],
      monthlyRetention: [7, 9, 11, 8, 10],
    },
    color: colors.secondary,
  }
];