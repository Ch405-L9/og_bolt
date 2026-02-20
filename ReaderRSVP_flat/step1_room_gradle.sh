#!/usr/bin/env bash
set -e

APP_GRADLE=app/build.gradle.kts
ROOT_GRADLE=build.gradle.kts

# Add KSP plugin to app/build.gradle.kts if missing
if ! grep -q 'com.google.devtools.ksp' "$APP_GRADLE"; then
  sed -i 's/id("org.jetbrains.kotlin.plugin.compose")/id("org.jetbrains.kotlin.plugin.compose")\n    id("com.google.devtools.ksp")/' "$APP_GRADLE"
fi

# Add Room dependencies if missing
if ! grep -q 'androidx.room:room-runtime' "$APP_GRADLE"; then
  sed -i '/implementation("com.tom-roush:pdfbox-android:2.0.27.0")/a\
    \n    // Room\n    implementation("androidx.room:room-runtime:2.6.1")\n    implementation("androidx.room:room-ktx:2.6.1")\n    ksp("androidx.room:room-compiler:2.6.1")\n' "$APP_GRADLE"
fi

# Ensure KSP plugin classpath at root if needed (AGP 8+ usually fine without, but safe)
if ! grep -q 'com.google.devtools.ksp' "$ROOT_GRADLE"; then
  echo "Root build.gradle.kts unchanged (no explicit KSP needed for AGP 8.x)."
fi

echo "Gradle files patched for Room + KSP."
