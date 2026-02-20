#!/usr/bin/env bash
set -e

APP_GRADLE=app/build.gradle.kts
ROOT_GRADLE=build.gradle.kts

# 1) Remove KSP plugin line from app/build.gradle.kts
sed -i '/id("com.google.devtools.ksp")/d' "$APP_GRADLE"

# 2) Remove KSP plugin from root build.gradle.kts plugins block
sed -i '/id("com.google.devtools.ksp")/d' "$ROOT_GRADLE"

# 3) In app/build.gradle.kts, replace ksp(...) with kapt(...)
sed -i 's/ksp("androidx.room:room-compiler:2.6.1")/kapt("androidx.room:room-compiler:2.6.1")/' "$APP_GRADLE"

# 4) Add kapt plugin to app/build.gradle.kts if missing
if ! grep -q 'kapt' "$APP_GRADLE"; then
  sed -i 's/id("org.jetbrains.kotlin.plugin.compose")/id("org.jetbrains.kotlin.plugin.compose")\n    id("org.jetbrains.kotlin.kapt")/' "$APP_GRADLE"
fi

echo "Switched Room to use kapt instead of KSP."
