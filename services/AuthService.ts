import { UserData, UserRole } from '@/types/user';
import { MOCK_USER } from '@/data/user';
import { MOCK_NEW_USERS } from '@/data/newUsers';
import { MOCK_CONTACTS } from '@/data/contacts';
import { colors } from '@/constants/colors';

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
    role: UserRole = 'Pending',
    supervisorId?: string
  ): Promise<UserData | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: UserData = {
          id: `new-${Date.now()}`,
          name,
          email,
          role,
          phone: null,
          avatarUrl: null,
          supervisorId,
          isMaster: false,
          isAdmin: false,
          isPending: true,
          isActive: false,
        };
        
        // Add to MOCK_NEW_USERS if role is Pending
        if (role === 'Pending') {
          MOCK_NEW_USERS.push({
            ...user,
            color: colors.primary,
            registeredAt: new Date().toISOString(),
          });
        }
        
        resolve(user);
      }, 1000);
    });
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (MOCK_USER.isAdmin || MOCK_USER.isMaster) {
          // Find user in MOCK_NEW_USERS
          const userIndex = MOCK_NEW_USERS.findIndex(u => u.id === userId);
          
          if (userIndex !== -1) {
            const user = MOCK_NEW_USERS[userIndex];
            
            // Create new contact entry
            const newContact = {
              id: user.id,
              name: user.name,
              email: user.email,
              role: newRole,
              phone: null,
              avatarUrl: null,
              color: user.color,
              supervisorId: user.supervisorId,
            };
            
            // Add to MOCK_CONTACTS
            MOCK_CONTACTS.push(newContact);
            
            // Remove from MOCK_NEW_USERS
            MOCK_NEW_USERS.splice(userIndex, 1);
            
            resolve(true);
          } else {
            // User not found in new users, try updating in contacts
            const contactIndex = MOCK_CONTACTS.findIndex(c => c.id === userId);
            if (contactIndex !== -1) {
              MOCK_CONTACTS[contactIndex].role = newRole;
              resolve(true);
            } else {
              resolve(false);
            }
          }
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
          const userIndex = MOCK_CONTACTS.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            const user = MOCK_CONTACTS[userIndex];
            user.isAdmin = !user.isAdmin;
            resolve(true);
          } else {
            resolve(false);
          }
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
          const userIndex = MOCK_CONTACTS.findIndex(u => u.id === userId);
          if (userIndex !== -1) {
            MOCK_CONTACTS[userIndex].supervisorId = supervisorId;
            resolve(true);
          } else {
            resolve(false);
          }
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