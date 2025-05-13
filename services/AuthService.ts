import { UserData, UserRole } from '@/types/user';
import { MOCK_USER } from '@/data/user';
import { MOCK_NEW_USERS } from '@/data/newUsers';
import { MOCK_CONTACTS } from '@/data/contacts';

export class AuthService {
  static async login(email: string, password: string): Promise<UserData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'demo@example.com' && password === 'password') {
          resolve(MOCK_USER);
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  static async register(
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'Client',
    supervisorId?: string
  ): Promise<UserData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: UserData = {
          id: 'new-user-id',
          name,
          email,
          role,
          phone: null,
          avatarUrl: null,
          supervisorId: role === 'Client' ? supervisorId : null,
          isMaster: false,
          isAdmin: false,
          isPending: true,
        };
        resolve(user);
      }, 1000);
    });
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_USER.isAdmin || MOCK_USER.isMaster) {
          // Find the user in MOCK_NEW_USERS
          const userIndex = MOCK_NEW_USERS.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            // Create a new contact entry
            const user = MOCK_NEW_USERS[userIndex];
            const newContact = {
              ...user,
              role: newRole,
            };
            
            // Add to MOCK_CONTACTS
            MOCK_CONTACTS.push(newContact);
            
            // Remove from MOCK_NEW_USERS
            MOCK_NEW_USERS.splice(userIndex, 1);
          }
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  static async toggleAdminStatus(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_USER.isMaster) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  static async assignSupervisor(userId: string, supervisorId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_USER.isAdmin || MOCK_USER.isMaster) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  static async resetPassword(email: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  }

  static async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }
}