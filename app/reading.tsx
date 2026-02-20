/**
 * Reading Screen - RSVP Engine
 * Core reading experience with word-by-word display and animation
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '@/components/screen-container';
import { useLibrary } from '@/lib/contexts/library-context';
import { RSVPEngine } from '@/lib/rsvp-engine';
import { textToWords } from '@/lib/parsers';
import { SpeedSlider } from '@/components/speed-slider';

export default function ReadingScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const { currentBook, currentProgress, settings, updatePosition, updateSettings } = useLibrary();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [speed, setSpeed] = useState(settings.speed);
  const [isLoading, setIsLoading] = useState(true);

  const engineRef = useRef<RSVPEngine | null>(null);

  // Load book content on mount
  useEffect(() => {
    loadBookContent();
  }, [currentBook?.id]);

  // Initialize RSVP engine when words are loaded
  useEffect(() => {
    if (words.length > 0 && !engineRef.current) {
      const engine = new RSVPEngine(words, {
        speed,
        orpColor: settings.orpColor,
        onWordChange: (index, word) => {
          setCurrentWordIndex(index);
          setCurrentWord(word);
        },
        onComplete: () => {
          setIsPlaying(false);
          handleReadingComplete();
        },
      });
      engineRef.current = engine;

      // Set initial position from progress
      if (currentProgress && currentProgress.currentPosition > 0) {
        engine.jumpToWord(currentProgress.currentPosition);
      }
    }
  }, [words, speed, settings.orpColor]);

  // Handle play/pause
  useEffect(() => {
    if (!engineRef.current) return;

    if (isPlaying) {
      engineRef.current.play();
    } else {
      engineRef.current.pause();
    }
  }, [isPlaying]);

  async function loadBookContent() {
    try {
      setIsLoading(true);

      if (!currentBook) {
        throw new Error('No book selected');
      }

      // Read file content
      const content = await FileSystem.readAsStringAsync(currentBook.fileUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Convert to words
      const bookWords = textToWords(content);
      setWords(bookWords);
    } catch (error) {
      console.error('Error loading book:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    updateSettings({ speed: newSpeed });
    if (engineRef.current) {
      engineRef.current.setSpeed(newSpeed);
    }
  }

  function handleClose() {
    setIsPlaying(false);
    if (engineRef.current && currentBook) {
      const state = engineRef.current.getState();
      updatePosition(state.currentIndex);
    }
    router.back();
  }

  function handleReadingComplete() {
    if (currentBook) {
      updatePosition(words.length - 1);
    }
  }

  function handlePreviousWord() {
    if (engineRef.current) {
      engineRef.current.jumpToWord(currentWordIndex - 1);
    }
  }

  function handleNextWord() {
    if (engineRef.current) {
      engineRef.current.jumpToWord(currentWordIndex + 1);
    }
  }

  if (isLoading || !currentBook || !currentProgress || words.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground text-lg">
          {isLoading ? 'Loading book...' : 'No content available'}
        </Text>
      </ScreenContainer>
    );
  }

  const progressPercent = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0;
  const orp = RSVPEngine.getORP(currentWord);

  return (
    <ScreenContainer className="p-4 justify-between">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold text-foreground flex-1" numberOfLines={1}>
          {currentBook.title}
        </Text>
        <TouchableOpacity onPress={handleClose} className="ml-2">
          <Text className="text-2xl text-foreground">×</Text>
        </TouchableOpacity>
      </View>

      {/* Main RSVP Display */}
      <View className="flex-1 items-center justify-center gap-6">
        {/* Word Display with ORP */}
        <View className="items-center min-h-24 justify-center">
          <Text className="text-5xl font-bold text-foreground text-center">
            {orp.before}
            <Text style={{ color: settings.orpColor, fontSize: 60 }}>
              {orp.highlight}
            </Text>
            {orp.after}
          </Text>
        </View>

        {/* Speed Control */}
        <SpeedSlider
          value={speed}
          onValueChange={handleSpeedChange}
          minValue={200}
          maxValue={1000}
          step={50}
        />
      </View>

      {/* Controls */}
      <View className="gap-3 mt-4">
        {/* Progress Bar */}
        <View className="gap-1">
          <View className="flex-row justify-between">
            <Text className="text-xs text-muted">
              Word {currentWordIndex + 1} of {words.length}
            </Text>
            <Text className="text-xs text-muted">
              {Math.round(progressPercent)}%
            </Text>
          </View>
          <View className="h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full bg-primary rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handlePreviousWord}
            disabled={currentWordIndex === 0}
            className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-semibold">← Prev</Text>
          </TouchableOpacity>

          {/* Play/Pause Button */}
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            className="flex-1 bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-background font-bold text-lg">
              {isPlaying ? 'Pause' : 'Play'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextWord}
            disabled={currentWordIndex >= words.length - 1}
            className="flex-1 bg-surface border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-semibold">Next →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
