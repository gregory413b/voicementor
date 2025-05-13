import { MessageData } from '@/types/message';
import { MOCK_CONTACTS } from './contacts';

export const MOCK_MESSAGES: MessageData[] = [
  {
    id: '1',
    content: 'Hey, I wanted to discuss the upcoming presentation. Can we schedule a call?',
    sender: MOCK_CONTACTS[0],
    timestamp: '2025-05-01T09:30:00Z',
    isBookmarked: true,
    unread: true,
  },
  {
    id: '2',
    isAudio: true,
    sender: MOCK_CONTACTS[1],
    timestamp: '2025-04-30T15:45:00Z',
    duration: 187,
  },
  {
    id: '3',
    content: 'Great progress on the project! Keep up the good work.',
    sender: MOCK_CONTACTS[2],
    timestamp: '2025-04-28T11:20:00Z',
    hasAttachments: true,
  },
  {
    id: '4',
    isAudio: true,
    sender: MOCK_CONTACTS[3],
    timestamp: '2025-04-27T16:10:00Z',
    duration: 298,
    isBookmarked: true,
  },
  {
    id: '5',
    content: 'The training materials have been updated. Please review when you have a chance.',
    sender: MOCK_CONTACTS[0],
    timestamp: '2025-04-25T14:30:00Z',
  },
  {
    id: '6',
    isAudio: true,
    sender: MOCK_CONTACTS[4],
    timestamp: '2025-04-23T10:15:00Z',
    duration: 202,
    hasAttachments: true,
  },
  {
    id: '7',
    content: 'Looking forward to our quarterly review meeting next week.',
    sender: MOCK_CONTACTS[2],
    timestamp: '2025-04-20T09:00:00Z',
  },
];