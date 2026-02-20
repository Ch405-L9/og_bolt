/**
 * Analytics Screen
 * Displays reading statistics and comprehension insights
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';

export default function AnalyticsScreen() {
  const router = useRouter();
  const { currentBook, currentProgress } = useLibrary();

  if (!currentBook || !currentProgress) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Loading...</Text>
      </ScreenContainer>
    );
  }

  const totalMinutes = Math.round(currentProgress.totalReadingTime / 1000 / 60);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const averageWPM = currentProgress.sessions.length > 0
    ? Math.round(
        currentProgress.sessions.reduce((sum, s) => sum + s.averageWPM, 0) /
          currentProgress.sessions.length
      )
    : 0;

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-foreground">Analytics</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl text-foreground">×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-4">
          {/* Reading Time */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-xs text-muted mb-2">Total Reading Time</Text>
            <Text className="text-3xl font-bold text-foreground">
              {totalHours}h
            </Text>
            <Text className="text-sm text-muted mt-1">
              {totalMinutes} minutes
            </Text>
          </View>

          {/* Average Speed */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-xs text-muted mb-2">Average Speed</Text>
            <Text className="text-3xl font-bold text-foreground">
              {averageWPM}
            </Text>
            <Text className="text-sm text-muted mt-1">Words Per Minute</Text>
          </View>

          {/* Progress */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-xs text-muted mb-2">Reading Progress</Text>
            <Text className="text-3xl font-bold text-foreground">
              {Math.round(currentProgress.percentComplete)}%
            </Text>
            <View className="mt-3 h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary"
                style={{ width: `${currentProgress.percentComplete}%` }}
              />
            </View>
          </View>

          {/* Sessions */}
          <View className="bg-surface rounded-lg p-4">
            <Text className="text-xs text-muted mb-2">Reading Sessions</Text>
            <Text className="text-3xl font-bold text-foreground">
              {currentProgress.sessions.length}
            </Text>
            <Text className="text-sm text-muted mt-1">Total sessions</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
