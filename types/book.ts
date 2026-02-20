/**
 * Book and library-related types for RSVP_ORP Reader
 */

export type BookFormat = 'EPUB' | 'PDF' | 'TXT';

export interface BookMetadata {
  id: string;
  title: string;
  author?: string;
  format: BookFormat;
  fileUri: string;
  fileSize: number;
  coverImageUri?: string;
  dateAdded: number; // timestamp
  dateModified: number; // timestamp
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: number;
  endTime: number;
  wordsRead: number;
  averageWPM: number;
  comprehensionScore?: number;
}

export interface BookProgress {
  bookId: string;
  currentPosition: number; // word index
  totalWords: number;
  percentComplete: number;
  lastReadTime: number;
  totalReadingTime: number; // in milliseconds
  sessions: ReadingSession[];
}

export interface Bookmark {
  id: string;
  bookId: string;
  position: number; // word index
  context: string; // surrounding text for context
  timestamp: number;
  note?: string;
}

export interface RSVPSettings {
  speed: number; // WPM (200-1000)
  orpColor: string; // hex color
  comprehensionMode: boolean;
  darkMode: boolean;
  textSize: number; // 0.8 - 1.5 multiplier
}

export interface ParsedBook {
  metadata: BookMetadata;
  words: string[];
  chapters?: Chapter[];
}

export interface Chapter {
  title: string;
  startWordIndex: number;
  endWordIndex: number;
}
