/**
 * Bookmarks Screen
 * Displays all bookmarks for the current book
 */

import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';

export default function BookmarksScreen() {
  const router = useRouter();
  const { currentBook, currentBookmarks, deleteBookmark } = useLibrary();

  function renderBookmarkItem({ item }: any) {
    return (
      <TouchableOpacity className="bg-surface rounded-lg p-4 mb-3 border border-border">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-sm text-muted mb-1">
              Word {item.position.toLocaleString()}
            </Text>
            <Text className="text-base text-foreground">
              {item.context}
            </Text>
            {item.note && (
              <Text className="text-sm text-muted mt-2 italic">
                Note: {item.note}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => deleteBookmark(item.id)}
            className="ml-2"
          >
            <Text className="text-error">×</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-foreground">Bookmarks</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl text-foreground">×</Text>
        </TouchableOpacity>
      </View>

      {currentBookmarks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-muted">No bookmarks yet</Text>
        </View>
      ) : (
        <FlatList
          data={currentBookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      )}
    </ScreenContainer>
  );
}
