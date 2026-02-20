/**
 * Library Context
 * Manages global state for the library, current book, and reading progress
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BookMetadata, BookProgress, Bookmark, RSVPSettings } from '@/types/book';
import { LibraryStorage, ProgressStorage, BookmarkStorage } from '@/lib/storage/library-storage';

interface LibraryContextType {
  // Library state
  books: BookMetadata[];
  isLoadingBooks: boolean;
  
  // Current book state
  currentBook: BookMetadata | null;
  currentProgress: BookProgress | null;
  currentBookmarks: Bookmark[];
  
  // RSVP settings
  settings: RSVPSettings;
  
  // Library actions
  loadBooks: () => Promise<void>;
  addBook: (book: BookMetadata) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  selectBook: (bookId: string) => Promise<void>;
  
  // Progress actions
  updateProgress: (progress: BookProgress) => Promise<void>;
  updatePosition: (position: number) => Promise<void>;
  
  // Bookmark actions
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;
  
  // Settings actions
  updateSettings: (settings: Partial<RSVPSettings>) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<BookMetadata[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [currentBook, setCurrentBook] = useState<BookMetadata | null>(null);
  const [currentProgress, setCurrentProgress] = useState<BookProgress | null>(null);
  const [currentBookmarks, setCurrentBookmarks] = useState<Bookmark[]>([]);
  const [settings, setSettings] = useState<RSVPSettings>({
    speed: 300, // Default 300 WPM
    orpColor: '#FF0000', // Red
    comprehensionMode: false,
    darkMode: false,
    textSize: 1.0,
  });

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Load progress and bookmarks when book changes
  useEffect(() => {
    if (currentBook) {
      loadProgressAndBookmarks(currentBook.id);
    }
  }, [currentBook?.id]);

  async function loadBooks() {
    try {
      setIsLoadingBooks(true);
      const loadedBooks = await LibraryStorage.getBooks();
      setBooks(loadedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setIsLoadingBooks(false);
    }
  }

  async function loadProgressAndBookmarks(bookId: string) {
    try {
      const progress = await ProgressStorage.getProgress(bookId);
      setCurrentProgress(progress);

      const bookmarks = await BookmarkStorage.getBookmarks(bookId);
      setCurrentBookmarks(bookmarks);
    } catch (error) {
      console.error('Error loading progress and bookmarks:', error);
    }
  }

  async function addBook(book: BookMetadata) {
    try {
      await LibraryStorage.addBook(book);
      setBooks([...books, book]);
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  }

  async function deleteBook(bookId: string) {
    try {
      await LibraryStorage.deleteBook(bookId);
      setBooks(books.filter(b => b.id !== bookId));
      if (currentBook?.id === bookId) {
        setCurrentBook(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  async function selectBook(bookId: string) {
    try {
      const book = await LibraryStorage.getBook(bookId);
      if (book) {
        setCurrentBook(book);
      }
    } catch (error) {
      console.error('Error selecting book:', error);
      throw error;
    }
  }

  async function updateProgress(progress: BookProgress) {
    try {
      await ProgressStorage.saveProgress(progress);
      setCurrentProgress(progress);
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  async function updatePosition(position: number) {
    if (!currentBook || !currentProgress) return;

    try {
      await ProgressStorage.updatePosition(currentBook.id, position, currentProgress.totalWords);
      const updated = await ProgressStorage.getProgress(currentBook.id);
      if (updated) {
        setCurrentProgress(updated);
      }
    } catch (error) {
      console.error('Error updating position:', error);
      throw error;
    }
  }

  async function addBookmark(bookmark: Bookmark) {
    try {
      await BookmarkStorage.addBookmark(bookmark);
      setCurrentBookmarks([...currentBookmarks, bookmark]);
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  }

  async function deleteBookmark(bookmarkId: string) {
    if (!currentBook) return;

    try {
      await BookmarkStorage.deleteBookmark(currentBook.id, bookmarkId);
      setCurrentBookmarks(currentBookmarks.filter(b => b.id !== bookmarkId));
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      throw error;
    }
  }

  function updateSettings(newSettings: Partial<RSVPSettings>) {
    setSettings({ ...settings, ...newSettings });
  }

  const value: LibraryContextType = {
    books,
    isLoadingBooks,
    currentBook,
    currentProgress,
    currentBookmarks,
    settings,
    loadBooks,
    addBook,
    deleteBook,
    selectBook,
    updateProgress,
    updatePosition,
    addBookmark,
    deleteBookmark,
    updateSettings,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
}
