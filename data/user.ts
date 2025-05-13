import { UserData } from '@/types/user';

export const MOCK_USER: UserData = {
  id: 'user-1',
  name: 'Gregory Bottaro',
  email: 'gregory@catholicpsych.com',
  role: 'Training Director', // Changed from 'Master' to 'Training Director'
  phone: '+1 (555) 987-6543',
  avatarUrl: null,
  supervisees: ['sup-1', 'sup-2', 'sup-3'],
  isMaster: true,
  isAdmin: true,
};