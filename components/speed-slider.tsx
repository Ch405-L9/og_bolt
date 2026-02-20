/**
 * Speed Slider Component
 * Custom slider for RSVP speed control (200-1000 WPM)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Dimensions } from 'react-native';

interface SpeedSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

export function SpeedSlider({
  value,
  onValueChange,
  minValue = 200,
  maxValue = 1000,
  step = 50,
}: SpeedSliderProps) {
  const sliderWidth = Dimensions.get('window').width - 40;
  const thumbWidth = 24;
  const trackHeight = 4;

  // Calculate thumb position
  const range = maxValue - minValue;
  const percentage = (value - minValue) / range;
  const thumbPosition = percentage * (sliderWidth - thumbWidth);

  function handleThumbPress(x: number) {
    const newPercentage = Math.max(0, Math.min(1, (x - thumbWidth / 2) / (sliderWidth - thumbWidth)));
    const newValue = Math.round((newPercentage * range + minValue) / step) * step;
    onValueChange(Math.max(minValue, Math.min(maxValue, newValue)));
  }

  return (
    <View className="gap-2 px-2">
      <View className="flex-row justify-between items-center">
        <Text className="text-sm text-muted">Speed (WPM)</Text>
        <Text className="text-lg font-bold text-primary">
          {Math.round(value)}
        </Text>
      </View>

      {/* Slider Track */}
      <View className="h-12 justify-center">
        {/* Background Track */}
        <View className="h-1 bg-border rounded-full" />

        {/* Active Track */}
        <View
          className="absolute h-1 bg-primary rounded-full"
          style={{
            width: `${percentage * 100}%`,
          }}
        />

        {/* Thumb */}
        <TouchableOpacity
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            handleThumbPress(locationX);
          }}
          style={{
            position: 'absolute',
            left: thumbPosition,
            width: thumbWidth,
            height: 24,
            marginTop: -10,
          }}
          className="bg-primary rounded-full border-2 border-background shadow-lg"
        />
      </View>

      {/* Labels */}
      <View className="flex-row justify-between">
        <Text className="text-xs text-muted">200</Text>
        <Text className="text-xs text-muted">1000</Text>
      </View>
    </View>
  );
}
