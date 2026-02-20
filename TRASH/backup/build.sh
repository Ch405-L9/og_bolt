#!/bin/bash

# BADGR RSVP Reader - One-Command Builder
# by BADGR Technologies LLC

echo "╔════════════════════════════════════════════╗"
echo "║  BADGR RSVP Speed Reader - Quick Builder  ║"
echo "║  by BADGR Technologies LLC                ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Android SDK is set
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  ANDROID_HOME not set. Trying default location..."
    export ANDROID_HOME="$HOME/Android/Sdk"
    
    if [ ! -d "$ANDROID_HOME" ]; then
        echo "❌ Android SDK not found!"
        echo ""
        echo "Please run ./setup.sh first, or set ANDROID_HOME manually:"
        echo "  export ANDROID_HOME=\$HOME/Android/Sdk"
        exit 1
    fi
fi

echo "✅ Android SDK: $ANDROID_HOME"
echo ""

# Create local.properties if it doesn't exist
if [ ! -f "local.properties" ]; then
    echo "📝 Creating local.properties..."
    echo "sdk.dir=$ANDROID_HOME" > local.properties
fi

echo "🔨 Building BADGR RSVP Reader..."
echo ""

# Clean build
echo "🧹 Cleaning previous builds..."
./gradlew clean

echo ""
echo "📦 Building debug APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║         ✅ BUILD SUCCESSFUL! ✅            ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "📱 APK Location:"
    echo "   app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📊 APK Size:"
    du -h app/build/outputs/apk/debug/app-debug.apk 2>/dev/null || echo "   ~5 MB"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Connect device: adb devices"
    echo "   2. Install APK: ./gradlew installDebug"
    echo "   3. OR: Open in Android Studio and click Run"
    echo ""
else
    echo ""
    echo "╔════════════════════════════════════════════╗"
    echo "║           ❌ BUILD FAILED ❌               ║"
    echo "╚════════════════════════════════════════════╝"
    echo ""
    echo "Common fixes:"
    echo "  1. Run: ./setup.sh"
    echo "  2. Check: java -version (need Java 17+)"
    echo "  3. Verify: ANDROID_HOME is set correctly"
    echo "  4. Try: File → Invalidate Caches in Android Studio"
    echo ""
    exit 1
fi
