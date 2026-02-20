#!/usr/bin/env bash
set -e

APP_GRADLE=app/build.gradle.kts

# Insert Room deps after pdfbox line if not present
if ! grep -q 'androidx.room:room-runtime' "$APP_GRADLE"; then
  sed -i '/implementation("com.tom-roush:pdfbox-android:2.0.27.0")/a\
    \n    // Room\n    implementation("androidx.room:room-runtime:2.6.1")\n    implementation("androidx.room:room-ktx:2.6.1")\n    kapt("androidx.room:room-compiler:2.6.1")\n' "$APP_GRADLE"
fi

echo "Room dependencies added to app/build.gradle.kts"
