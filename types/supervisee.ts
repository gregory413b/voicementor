import { colors } from '@/constants/colors';

export interface SuperviseeStats {
  activeClients: number;
  messageLength: number[];  // Average length of messages in minutes
  responseTime: number[];   // Average response time in hours
  monthlyRetention: number[]; // Average months clients stay active
}

export interface SuperviseeData {
  id: string;
  name: string;
  role: string;
  email: string;
  stats: SuperviseeStats;
  color: string;
}