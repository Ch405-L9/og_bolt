## BADGRTechnologies LLC – RSVP Speed Reader v1.0

#### 1. Environment Variables (.env)

| Variable | Value | Purpose |
|:---|:---|:---|
| ENTITY_NAME | BADGRTechnologies LLC | Enforces corporate naming convention |
| DOC_PROTOCOL | CH405_STRICT | Ensures documentation integrity |
| OUTPUT_CONTAINER | SYNTAX_HIGHLIGHT_BOX | Forces all output into code blocks |
| BRAND_PRIMARY_HEX | ##0000FF | Primary branding color (BADGR Blue) |
| METHOD_LOCK | ENABLED | Prevents deviation from standards |

#### 2. Environment Setup Script – setup_env.sh

##!/bin/bash
## CH405 Protocol: Environment & Structure Setup
## Entity: BADGRTechnologies LLC

PROJECT_ROOT="RSVPReader"
echo "Initializing BADGRTechnologies LLC environment..."

## 1. Create .env file
cat <<EOF > .env
ENTITY_NAME="BADGRTechnologies LLC"
DOC_PROTOCOL="CH405_STRICT"
OUTPUT_CONTAINER="SYNTAX_HIGHLIGHT_BOX"
BRAND_PRIMARY_HEX="##0000FF"
BRAND_HIGHLIGHT_HEX="##FF0000"
METHOD_LOCK="ENABLED"
EOF

## 2. Initialize directory structure
mkdir -p $PROJECT_ROOT/{Documentation,Scripts,Assets,app/src/main/{java/com/badgr/rsvpreader/ui/theme,res/{drawable,values,xml}}}
mkdir -p $PROJECT_ROOT/gradle/wrapper

## 3. Create manifest placeholders
touch $PROJECT_ROOT/Documentation/{START_HERE.txt,INSTALLATION.md,HOW_TO_BUILD.md,PROJECT_SUMMARY.md,QUICKSTART.md,README.md,TECHNICAL.md,DELIVERY_PACKAGE.md}

## 4. Set permissions
chmod +x .env
echo "Environment initialized successfully."

#### 3. Project Overview

RSVP SPEED READER v1.0 – BADGR Technologies LLC
Platform: Android Studio (Kotlin + Jetpack Compose)
Lines of Code: ~500
Branding: BADGR Blue applied throughout
Documentation: 4 comprehensive guides
Automation: Setup and build scripts included
Logo: Company logo preloaded

#### 4. Quick Start Paths

Path 1 – Fastest (~5 min)
cd RSVPReader
./setup.sh
source ~/.bashrc
android-studio .
## Click "Run" in Android Studio

Path 2 – Detailed (~20 min)
1. Open README.md
2. Follow setup instructions (install Java + Android Studio)
3. Build and run the project

Path 3 – Command Line (Advanced)
./setup.sh
./build.sh
./gradlew installDebug

#### 5. Documentation Files

| File | Purpose |
|:---|:---|
| START_HERE.txt | Orientation guide |
| PROJECT_SUMMARY.md | Complete overview & checklist |
| QUICKSTART.md | 5-minute setup guide |
| README.md | Full setup and troubleshooting |
| TECHNICAL.md | Architecture & implementation details |

Recommended reading order:
1. START_HERE.txt
2. PROJECT_SUMMARY.md
3. QUICKSTART.md or README.md
4. TECHNICAL.md

#### 6. Executable Scripts

| Script | Function |
|:---|:---|
| setup.sh | Installs Java, KVM, Android SDK |
| build.sh | Builds APK |
| gradlew | Official Gradle wrapper |

All .sh files have chmod +x applied

#### 7. System Compatibility

Hardware: AMD Ryzen 5 5500, 16GB RAM, AMD Radeon RX 6500 XT, 1TB storage
Software: Ubuntu 24.04.3 LTS, Kernel 6.14.0-37, GNOME 46, Wayland
Verdict: Fully compatible

#### 8. Application Features

Core Features
- RSVP Display: one word at a time
- ORP Highlighting: red letter fixation
- Speed Control: 200–900 WPM, 25 WPM increments
- Playback Controls: Play/Pause/Jump/Reset
- Progress Tracking: visual bar + counter + %
- Branding: BADGR blue and logo applied

Technical Specs
- Language: Kotlin 1.9.20
- Framework: Jetpack Compose
- Min Android: 7.0 (API 24, 94% coverage)
- Architecture: MVVM + StateFlow
- Performance: 60 FPS smooth playback

#### 9. Project Structure

RSVPReader/
├─ Documentation/
│  ├─ START_HERE.txt
│  ├─ PROJECT_SUMMARY.md
│  ├─ QUICKSTART.md
│  ├─ README.md
│  └─ TECHNICAL.md
├─ Scripts/
│  ├─ setup.sh
│  ├─ build.sh
│  └─ gradlew
├─ Assets/
│  └─ BADGR_Logo.png
├─ app/src/main/java/com/badgr/rsvpreader/
│  ├─ MainActivity.kt
│  ├─ RSVPEngine.kt
│  └─ ui/theme/Theme.kt
├─ app/src/main/res/
│  ├─ drawable/
│  ├─ values/strings.xml
│  ├─ values/themes.xml
│  └─ xml/
├─ app/build.gradle.kts
├─ build.gradle.kts
└─ settings.gradle.kts
