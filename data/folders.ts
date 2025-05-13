import { FolderData } from '@/types/folder';
import { colors } from '@/constants/colors';

export const MOCK_FOLDERS: FolderData[] = [
  {
    id: '1',
    name: 'Important Messages',
    messageCount: 5,
    color: colors.primary,
    lastUpdated: '2025-05-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Team Updates',
    messageCount: 8,
    color: colors.success,
    lastUpdated: '2025-04-28T14:45:00Z',
  },
  {
    id: '3',
    name: 'Client Feedback',
    messageCount: 3,
    color: colors.accent,
    lastUpdated: '2025-04-27T09:15:00Z',
  },
  {
    id: '4',
    name: 'Training Resources',
    messageCount: 12,
    color: colors.warning,
    lastUpdated: '2025-04-25T16:20:00Z',
  },
  {
    id: '5',
    name: 'Archived',
    messageCount: 24,
    color: colors.folderColors[4],
    lastUpdated: '2025-04-15T11:10:00Z',
  },
];