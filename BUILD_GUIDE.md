# RSVP_ORP Reader - Build & Deployment Guide

## Prerequisites

Ensure you have the following installed:

- Node.js 18+ (verify with `node --version`)
- pnpm 9.12.0+ (verify with `pnpm --version`)
- Expo CLI (`pnpm install -g expo-cli`)
- EAS CLI for building (`pnpm install -g eas-cli`)
- Android SDK (API 26-34)
- Java Development Kit (JDK 11+)

## Project Structure

```
rsvp_orp_reader/
├── app/                    # Expo Router screens
├── components/             # Reusable React components
├── lib/                    # Utilities and business logic
├── __tests__/              # Unit tests
├── assets/                 # Images and static files
├── app.config.ts           # Expo configuration
├── package.json            # Dependencies
└── COMPLIANCE.md           # Privacy and compliance docs
```

## Development Setup

### 1. Install Dependencies

```bash
cd rsvp_orp_reader
pnpm install
```

### 2. Start Development Server

```bash
pnpm dev
```

This starts:
- Metro bundler on port 8081
- Backend server on port 3000

### 3. Run Tests

```bash
pnpm test
```

### 4. Type Checking

```bash
pnpm check
```

## Building for Android

### Option 1: Local Build with EAS (Recommended)

#### 1. Initialize EAS Project

```bash
eas init --id <your-eas-project-id>
```

#### 2. Configure EAS Build

Edit `eas.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleRelease"
      }
    },
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

#### 3. Build APK

```bash
eas build --platform android --profile production
```

#### 4. Build AAB (for Play Store)

```bash
eas build --platform android --profile production --type app-bundle
```

### Option 2: Local Build with Gradle

#### 1. Generate Keystore

```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias rsvp_key
```

#### 2. Configure Gradle

Create `android/gradle.properties`:

```properties
org.gradle.jvmargs=-Xmx4096m
org.gradle.parallel=true
KEYSTORE_FILE=../release.keystore
KEYSTORE_PASSWORD=your_password
KEY_ALIAS=rsvp_key
KEY_PASSWORD=your_password
```

#### 3. Build APK

```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

#### 4. Build AAB

```bash
./gradlew bundleRelease
```

AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

## Play Store Submission

### 1. Create Google Play Console Account

- Visit https://play.google.com/console
- Create new app
- Fill in app details

### 2. Prepare Store Listing

- **App Name**: RSVP ORP Reader
- **Short Description**: Advanced RSVP reading with ORP highlighting
- **Full Description**: See `COMPLIANCE.md`
- **Category**: Books & Reference
- **Content Rating**: Everyone (3+)

### 3. Upload Screenshots

Required screenshots:
- Phone (1080x1920): Home, Library, Reading screens
- Tablet (1600x2560): Same screens

### 4. Upload APK/AAB

- Go to "Release" → "Production"
- Upload signed APK or AAB
- Fill in release notes

### 5. Complete Data Safety Form

- Go to "Policy" → "App content"
- Complete data safety questionnaire
- Declare data collection practices

### 6. Set Pricing

- Choose pricing tier (free or paid)
- Select countries for distribution

### 7. Submit for Review

- Review all information
- Click "Submit"
- Wait for review (typically 2-4 hours)

## Testing Before Submission

### 1. Test on Device

```bash
pnpm android
```

This installs the debug APK on connected Android device.

### 2. Manual Testing Checklist

- [ ] App launches without crashes
- [ ] File import works (EPUB, PDF, TXT)
- [ ] RSVP reading engine functions smoothly
- [ ] Speed adjustment works (200-1000 WPM)
- [ ] Progress tracking persists
- [ ] Bookmarks functionality works
- [ ] Analytics display correctly
- [ ] Settings persist across sessions
- [ ] Dark mode toggle works
- [ ] Text scaling works
- [ ] All permissions requested appropriately
- [ ] App handles low memory gracefully

### 3. Run Automated Tests

```bash
pnpm test
```

### 4. Check for Crashes

Monitor logcat:

```bash
adb logcat | grep "FATAL\|ERROR\|CRASH"
```

## Versioning

Update version in `app.config.ts`:

```typescript
export default {
  version: "1.0.0",  // Semantic versioning
  // ...
};
```

## Troubleshooting

### Build Fails

1. Clear cache:
   ```bash
   pnpm install --force
   cd android && ./gradlew clean
   ```

2. Check Java version:
   ```bash
   java -version
   ```

3. Update SDK:
   ```bash
   sdkmanager --update
   ```

### App Crashes on Startup

1. Check logs:
   ```bash
   adb logcat | grep "rsvp_orp_reader"
   ```

2. Verify permissions in `AndroidManifest.xml`

3. Check for missing assets

### File Import Not Working

1. Verify `READ_EXTERNAL_STORAGE` permission
2. Check file format support
3. Test with different file sizes

### Performance Issues

1. Profile with Android Studio Profiler
2. Check memory usage
3. Optimize large file parsing
4. Reduce animation frame rate if needed

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/build.yml`:

```yaml
name: Build APK

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm check
```

## Release Checklist

Before each release:

- [ ] Update version number
- [ ] Update changelog
- [ ] Run all tests
- [ ] Test on multiple devices
- [ ] Update privacy policy if needed
- [ ] Update app store listing
- [ ] Create git tag
- [ ] Build signed APK/AAB
- [ ] Test signed build
- [ ] Submit to Play Store
- [ ] Monitor crash reports

## Support & Maintenance

After launch:

1. **Monitor Crashes**: Check Play Console crash reports
2. **Update Dependencies**: Run `pnpm update` monthly
3. **Security Patches**: Apply immediately
4. **User Feedback**: Monitor reviews and ratings
5. **Performance**: Optimize based on analytics

## Contact

For build issues or questions:
- **Company**: BADGRTechnologies LLC
- **Email**: support@badgrtechnologies.com
- **Location**: Atlanta, Georgia, US

---

**Last Updated**: February 2026
**Version**: 1.0.0
