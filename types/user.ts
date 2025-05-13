export type UserRole = 'Master' | 'Admin' | 'Training Director' | 'Mentor' | 'Student' | 'Client' | 'Pending';

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  avatarUrl: string | null;
  supervisorId?: string | null;
  supervisees?: string[];
  clients?: string[];
  isMaster?: boolean;
  isAdmin?: boolean;
  isPending?: boolean;
  isActive?: boolean; // Added for client status tracking
}