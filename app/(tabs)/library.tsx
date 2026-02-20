/**
 * Library Screen
 * Displays all imported books and allows user to select one to read
 */

import React, { useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';
import { parseBook } from '@/lib/parsers';
import { BookMetadata } from '@/types/book';

export default function LibraryScreen() {
  const router = useRouter();
  const { books, isLoadingBooks, addBook, deleteBook, selectBook } = useLibrary();
  const [isImporting, setIsImporting] = useState(false);

  async function handleImportBook() {
    try {
      setIsImporting(true);

      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/epub+zip', 'application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];

      // Copy file to app directory for persistent access
      const appDir = FileSystem.documentDirectory + 'books/';
      await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });

      const destinationUri = appDir + asset.name;
      await FileSystem.copyAsync({
        from: asset.uri,
        to: destinationUri,
      });

      // Parse the book
      const parsedBook = await parseBook(destinationUri, asset.name, {
        title: asset.name.replace(/\.[^.]+$/, ''),
      });

      // Add to library
      await addBook(parsedBook.metadata);

      Alert.alert('Success', `"${parsedBook.metadata.title}" has been added to your library.`);
    } catch (error) {
      console.error('Error importing book:', error);
      Alert.alert('Error', `Failed to import book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  }

  async function handleSelectBook(book: BookMetadata) {
    try {
      await selectBook(book.id);
      router.push({
        pathname: '/book-detail',
        params: { bookId: book.id },
      });
    } catch (error) {
      console.error('Error selecting book:', error);
      Alert.alert('Error', 'Failed to select book');
    }
  }

  async function handleDeleteBook(bookId: string) {
    Alert.alert(
      'Delete Book',
      'Are you sure you want to delete this book? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteBook(bookId);
              Alert.alert('Success', 'Book deleted from library');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete book');
            }
          },
          style: 'destructive',
        },
      ]
    );
  }

  function renderBookItem({ item }: { item: BookMetadata }) {
    return (
      <TouchableOpacity
        onPress={() => handleSelectBook(item)}
        className="bg-surface rounded-lg p-4 mb-3 border border-border"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
              {item.title}
            </Text>
            {item.author && (
              <Text className="text-sm text-muted mt-1">
                by {item.author}
              </Text>
            )}
            <View className="flex-row gap-2 mt-2">
              <Text className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                {item.format}
              </Text>
              <Text className="text-xs text-muted">
                {(item.fileSize / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleDeleteBook(item.id)}
            className="ml-2 p-2"
          >
            <Text className="text-error text-lg">×</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  function renderEmptyState() {
    return (
      <View className="flex-1 items-center justify-center gap-4">
        <Text className="text-2xl font-bold text-foreground">No Books Yet</Text>
        <Text className="text-base text-muted text-center px-4">
          Import an EPUB, PDF, or TXT file to get started with RSVP reading
        </Text>
        <TouchableOpacity
          onPress={handleImportBook}
          disabled={isImporting}
          className="bg-primary px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-background font-semibold">
            {isImporting ? 'Importing...' : 'Import Your First Book'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoadingBooks) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0000FF" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-foreground">My Library</Text>
        <TouchableOpacity
          onPress={handleImportBook}
          disabled={isImporting}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-background font-semibold text-sm">
            {isImporting ? '...' : '+'}
          </Text>
        </TouchableOpacity>
      </View>

      {books.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </ScreenContainer>
  );
}
