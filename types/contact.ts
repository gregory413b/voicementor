export interface ContactData {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  color: string;
}