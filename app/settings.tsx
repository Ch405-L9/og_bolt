/**
 * Settings Screen
 * User preferences and app customization
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useLibrary();
  const colorScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [comprehensionMode, setComprehensionMode] = useState(settings.comprehensionMode);
  const [textSize, setTextSize] = useState(settings.textSize);

  function handleDarkModeToggle(value: boolean) {
    setDarkMode(value);
    // Dark mode toggle would be handled by theme provider
  }

  function handleComprehensionToggle(value: boolean) {
    setComprehensionMode(value);
    updateSettings({ comprehensionMode: value });
  }

  function handleTextSizeChange(size: number) {
    setTextSize(size);
    updateSettings({ textSize: size });
  }

  return (
    <ScreenContainer className="p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-foreground">Settings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-2xl text-foreground">×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Reading Preferences */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Reading Preferences</Text>

            {/* Comprehension Mode */}
            <View className="bg-surface rounded-lg p-4 flex-row justify-between items-center border border-border">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Comprehension Mode</Text>
                <Text className="text-sm text-muted mt-1">
                  Pause for comprehension quizzes
                </Text>
              </View>
              <Switch
                value={comprehensionMode}
                onValueChange={handleComprehensionToggle}
                trackColor={{ false: '#E5E7EB', true: '#0000FF' }}
                thumbColor={comprehensionMode ? '#FFFFFF' : '#808080'}
              />
            </View>

            {/* Text Size */}
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-base font-semibold text-foreground mb-3">
                Text Size
              </Text>
              <View className="flex-row gap-2">
                {[0.8, 1.0, 1.2, 1.5].map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => handleTextSizeChange(size)}
                    className={`flex-1 py-2 rounded-lg border ${
                      textSize === size
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        textSize === size ? 'text-background' : 'text-foreground'
                      }`}
                      style={{ fontSize: 12 * size }}
                    >
                      {size === 0.8 ? 'S' : size === 1.0 ? 'M' : size === 1.2 ? 'L' : 'XL'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Display */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Display</Text>

            {/* Dark Mode */}
            <View className="bg-surface rounded-lg p-4 flex-row justify-between items-center border border-border">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Dark Mode</Text>
                <Text className="text-sm text-muted mt-1">
                  Easier on the eyes
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#E5E7EB', true: '#0000FF' }}
                thumbColor={darkMode ? '#FFFFFF' : '#808080'}
              />
            </View>
          </View>

          {/* About */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-base font-semibold text-foreground">
                RSVP ORP Reader
              </Text>
              <Text className="text-sm text-muted mt-2">
                Version 1.0.0
              </Text>
              <Text className="text-sm text-muted mt-3">
                An advanced RSVP reading application designed for comprehension and speed reading optimization.
              </Text>
            </View>

            {/* Privacy Policy */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-base font-semibold text-primary">
                Privacy Policy
              </Text>
            </TouchableOpacity>

            {/* Terms of Service */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-base font-semibold text-primary">
                Terms of Service
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
