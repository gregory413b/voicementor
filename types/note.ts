export interface NoteData {
  id: string;
  messageId: string;
  text: string;
  timestamp: number; // in seconds from the start of the message
  createdAt: string;
}