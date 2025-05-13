import { ContactData } from './contact';

export interface MessageData {
  id: string;
  content?: string;
  isAudio?: boolean;
  sender: ContactData;
  timestamp: string;
  duration?: number;
  isBookmarked?: boolean;
  unread?: boolean;
  hasAttachments?: boolean;
  folder?: string;
}