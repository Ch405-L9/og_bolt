/**
 * Library storage service
 * Manages book metadata, progress, and bookmarks using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookMetadata, BookProgress, Bookmark, ReadingSession } from '@/types/book';

const LIBRARY_KEY = '@rsvp_library';
const PROGRESS_KEY = '@rsvp_progress';
const BOOKMARKS_KEY = '@rsvp_bookmarks';
const SESSIONS_KEY = '@rsvp_sessions';

/**
 * Library management
 */
export const LibraryStorage = {
  /**
   * Get all books in library
   */
  async getBooks(): Promise<BookMetadata[]> {
    try {
      const data = await AsyncStorage.getItem(LIBRARY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading library:', error);
      return [];
    }
  },

  /**
   * Add book to library
   */
  async addBook(book: BookMetadata): Promise<void> {
    try {
      const books = await this.getBooks();
      const exists = books.some(b => b.id === book.id);
      if (!exists) {
        books.push(book);
        await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(books));
      }
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  /**
   * Get book by ID
   */
  async getBook(bookId: string): Promise<BookMetadata | null> {
    try {
      const books = await this.getBooks();
      return books.find(b => b.id === bookId) || null;
    } catch (error) {
      console.error('Error getting book:', error);
      return null;
    }
  },

  /**
   * Delete book from library
   */
  async deleteBook(bookId: string): Promise<void> {
    try {
      const books = await this.getBooks();
      const filtered = books.filter(b => b.id !== bookId);
      await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));

      // Also delete associated data
      await ProgressStorage.deleteProgress(bookId);
      await BookmarkStorage.deleteBookmarks(bookId);
      await SessionStorage.deleteSessions(bookId);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  /**
   * Update book metadata
   */
  async updateBook(bookId: string, updates: Partial<BookMetadata>): Promise<void> {
    try {
      const books = await this.getBooks();
      const index = books.findIndex(b => b.id === bookId);
      if (index !== -1) {
        books[index] = { ...books[index], ...updates, dateModified: Date.now() };
        await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(books));
      }
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },
};

/**
 * Reading progress management
 */
export const ProgressStorage = {
  /**
   * Get progress for a book
   */
  async getProgress(bookId: string): Promise<BookProgress | null> {
    try {
      const data = await AsyncStorage.getItem(`${PROGRESS_KEY}:${bookId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading progress:', error);
      return null;
    }
  },

  /**
   * Save or update progress
   */
  async saveProgress(progress: BookProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${PROGRESS_KEY}:${progress.bookId}`,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  },

  /**
   * Delete progress for a book
   */
  async deleteProgress(bookId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${PROGRESS_KEY}:${bookId}`);
    } catch (error) {
      console.error('Error deleting progress:', error);
      throw error;
    }
  },

  /**
   * Update current position
   */
  async updatePosition(bookId: string, position: number, totalWords: number): Promise<void> {
    try {
      const progress = await this.getProgress(bookId) || {
        bookId,
        currentPosition: 0,
        totalWords,
        percentComplete: 0,
        lastReadTime: Date.now(),
        totalReadingTime: 0,
        sessions: [],
      };

      progress.currentPosition = position;
      progress.percentComplete = totalWords > 0 ? (position / totalWords) * 100 : 0;
      progress.lastReadTime = Date.now();

      await this.saveProgress(progress);
    } catch (error) {
      console.error('Error updating position:', error);
      throw error;
    }
  },
};

/**
 * Bookmarks management
 */
export const BookmarkStorage = {
  /**
   * Get all bookmarks for a book
   */
  async getBookmarks(bookId: string): Promise<Bookmark[]> {
    try {
      const data = await AsyncStorage.getItem(`${BOOKMARKS_KEY}:${bookId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading bookmarks:', error);
      return [];
    }
  },

  /**
   * Add bookmark
   */
  async addBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks(bookmark.bookId);
      bookmarks.push(bookmark);
      await AsyncStorage.setItem(
        `${BOOKMARKS_KEY}:${bookmark.bookId}`,
        JSON.stringify(bookmarks)
      );
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  /**
   * Delete bookmark
   */
  async deleteBookmark(bookId: string, bookmarkId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks(bookId);
      const filtered = bookmarks.filter(b => b.id !== bookmarkId);
      await AsyncStorage.setItem(
        `${BOOKMARKS_KEY}:${bookId}`,
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  },

  /**
   * Delete all bookmarks for a book
   */
  async deleteBookmarks(bookId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${BOOKMARKS_KEY}:${bookId}`);
    } catch (error) {
      console.error('Error deleting bookmarks:', error);
      throw error;
    }
  },
};

/**
 * Reading sessions management
 */
export const SessionStorage = {
  /**
   * Get all sessions for a book
   */
  async getSessions(bookId: string): Promise<ReadingSession[]> {
    try {
      const data = await AsyncStorage.getItem(`${SESSIONS_KEY}:${bookId}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading sessions:', error);
      return [];
    }
  },

  /**
   * Add session
   */
  async addSession(session: ReadingSession): Promise<void> {
    try {
      const sessions = await this.getSessions(session.bookId);
      sessions.push(session);
      await AsyncStorage.setItem(
        `${SESSIONS_KEY}:${session.bookId}`,
        JSON.stringify(sessions)
      );
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  },

  /**
   * Delete sessions for a book
   */
  async deleteSessions(bookId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${SESSIONS_KEY}:${bookId}`);
    } catch (error) {
      console.error('Error deleting sessions:', error);
      throw error;
    }
  },
};
