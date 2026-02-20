#!/usr/bin/env bash
set -e

APP=app/build.gradle.kts

# Ensure kapt plugin
if ! grep -q 'org.jetbrains.kotlin.kapt' "$APP"; then
  sed -i 's/id("org.jetbrains.kotlin.plugin.compose")/id("org.jetbrains.kotlin.plugin.compose")\n    id("org.jetbrains.kotlin.kapt")/' "$APP"
fi

# Add Room deps after pdfbox line if missing
if ! grep -q 'androidx.room:room-runtime' "$APP"; then
  sed -i '/implementation("com.tom-roush:pdfbox-android:2.0.27.0")/a\
    \n    // Room\n    implementation("androidx.room:room-runtime:2.6.1")\n    implementation("androidx.room:room-ktx:2.6.1")\n    kapt("androidx.room:room-compiler:2.6.1")\n' "$APP"
fi

echo "Room + kapt configured in app/build.gradle.kts"
