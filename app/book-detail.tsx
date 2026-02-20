/**
 * Book Detail Screen
 * Shows book metadata and options to start reading or view bookmarks
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';
import { BookProgress } from '@/types/book';

export default function BookDetailScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { currentBook, currentProgress, selectBook } = useLibrary();
  const [isLoading, setIsLoading] = useState(true);
  const [bookWords, setBookWords] = useState<string[]>([]);

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  async function loadBook() {
    try {
      setIsLoading(true);
      await selectBook(bookId);
      
      // Load book words from file
      if (currentBook) {
        const content = await FileSystem.readAsStringAsync(currentBook.fileUri, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        const words = content.split(/\s+/).filter(w => w.length > 0);
        setBookWords(words);
      }
    } catch (error) {
      console.error('Error loading book:', error);
      Alert.alert('Error', 'Failed to load book');
    } finally {
      setIsLoading(false);
    }
  }

  function handleStartReading() {
    if (!currentBook) return;
    router.push({
      pathname: '/reading',
      params: { bookId: currentBook.id },
    });
  }

  function handleViewBookmarks() {
    if (!currentBook) return;
    router.push({
      pathname: '/bookmarks',
      params: { bookId: currentBook.id },
    });
  }

  function handleViewAnalytics() {
    if (!currentBook) return;
    router.push({
      pathname: '/analytics',
      params: { bookId: currentBook.id },
    });
  }

  if (isLoading || !currentBook) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" color="#0000FF" />
      </ScreenContainer>
    );
  }

  const progressPercent = currentProgress?.percentComplete || 0;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Book Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">
              {currentBook.title}
            </Text>
            {currentBook.author && (
              <Text className="text-lg text-muted">
                by {currentBook.author}
              </Text>
            )}
            <View className="flex-row gap-2 mt-2">
              <Text className="text-sm bg-primary/10 text-primary px-3 py-1 rounded">
                {currentBook.format}
              </Text>
              <Text className="text-sm text-muted">
                {(currentBook.fileSize / 1024 / 1024).toFixed(2)} MB
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-foreground">
                Reading Progress
              </Text>
              <Text className="text-sm text-muted">
                {Math.round(progressPercent)}%
              </Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${progressPercent}%` }}
              />
            </View>
          </View>

          {/* Stats */}
          {currentProgress && (
            <View className="gap-3">
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-xs text-muted mb-1">
                  Total Reading Time
                </Text>
                <Text className="text-xl font-bold text-foreground">
                  {Math.round(currentProgress.totalReadingTime / 1000 / 60)} minutes
                </Text>
              </View>
              <View className="bg-surface rounded-lg p-4">
                <Text className="text-xs text-muted mb-1">
                  Current Position
                </Text>
                <Text className="text-xl font-bold text-foreground">
                  Word {currentProgress.currentPosition.toLocaleString()} of {currentProgress.totalWords.toLocaleString()}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={handleStartReading}
              className="bg-primary rounded-lg py-4 items-center"
            >
              <Text className="text-background font-bold text-lg">
                {progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewBookmarks}
              className="bg-surface border border-border rounded-lg py-4 items-center"
            >
              <Text className="text-foreground font-semibold">
                View Bookmarks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewAnalytics}
              className="bg-surface border border-border rounded-lg py-4 items-center"
            >
              <Text className="text-foreground font-semibold">
                Reading Analytics
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
