import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header with Settings */}
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-bold text-foreground">RSVP Reader</Text>
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              className="p-2 bg-surface rounded-lg border border-border"
            >
              <Text className="text-lg text-foreground">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Welcome Section */}
          <View className="items-center gap-2">
            <Text className="text-2xl font-bold text-foreground">Welcome Back</Text>
            <Text className="text-base text-muted text-center">
              Start reading with optimal recognition point highlighting
            </Text>
          </View>

          {/* Quick Start Cards */}
          <View className="gap-3">
            {/* Library Card */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/library')}
              className="bg-primary rounded-2xl p-6 shadow-sm"
            >
              <Text className="text-2xl font-bold text-background mb-2">📚 My Library</Text>
              <Text className="text-sm text-background/80">
                Access your imported books and continue reading
              </Text>
            </TouchableOpacity>

            {/* Features Card */}
            <View className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
              <Text className="text-lg font-semibold text-foreground mb-3">Features</Text>
              <View className="gap-2">
                <Text className="text-sm text-muted">✓ RSVP reading with ORP highlighting</Text>
                <Text className="text-sm text-muted">✓ Adjustable speed (200-1000 WPM)</Text>
                <Text className="text-sm text-muted">✓ EPUB, PDF, and TXT support</Text>
                <Text className="text-sm text-muted">✓ Reading analytics and progress tracking</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
