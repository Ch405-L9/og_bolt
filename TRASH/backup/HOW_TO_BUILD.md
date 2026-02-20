## HOW TO BUILD BADGR RSVP SPEED READER

#### Complete Step-by-Step Build Guide for Ubuntu 24.04

---

#### FASTEST METHOD (5 Commands)

```bash
cd /path/to/RSVPReader
./setup.sh
source ~/.bashrc
android-studio .
## Wait for project to load, then click the green "Run" ▶ button
```

**Done!** The app will build and launch in the emulator.

---

#### DETAILED STEP-BY-STEP GUIDE

###### Prerequisites Check

Before starting, verify you have:
- > Ubuntu 24.04.3 LTS (you have this)
- > 10GB free disk space (you have plenty)
- > Internet connection (for downloads)
- > Root/sudo access (for installations)

---

###### STEP 1: Extract the Project (if using archive)

```bash
## If you downloaded the .tar.gz file:
cd ~/Downloads  ## or wherever you saved it
tar -xzf BADGR-RSVP-Reader-v1.0.tar.gz

## If you downloaded the RSVPReader folder directly:
## Just navigate to it
cd /path/to/RSVPReader
```

---

###### STEP 2: Run Automated Setup

This script installs Java 17, KVM acceleration, and configures your environment.

```bash
cd RSVPReader
./setup.sh
```

**What this does:**
- Installs OpenJDK 17
- Sets JAVA_HOME environment variable
- Installs KVM for fast emulation (AMD Ryzen optimization)
- Configures Android SDK path
- Creates local.properties file

**Duration:** 5-10 minutes

---

###### STEP 3: Reload Your Shell Environment

```bash
source ~/.bashrc
```

This activates the environment variables that were just added.

---

###### STEP 4: Install Android Studio (if not installed)

**Method 1 - Using Snap (Recommended):**
```bash
sudo snap install android-studio --classic
```

**Method 2 - Manual Download:**
1. Visit https://developer.android.com/studio
2. Download Android Studio for Linux
3. Extract and run:
```bash
cd ~/Downloads
tar -xzf android-studio-*.tar.gz
sudo mv android-studio /opt/
/opt/android-studio/bin/studio.sh
```

**Duration:** 10-15 minutes (download time depends on internet speed)

---

###### STEP 5: First Launch of Android Studio

When Android Studio opens for the first time:

1. **Welcome Screen** appears
2. Choose **"Standard" installation**
3. Click **"Next"** through the setup wizard
4. **Accept all licenses** (scroll through and click "Accept")
5. Click **"Finish"**

Android Studio will now download:
- Android SDK
- Build tools
- Emulator
- Platform tools

**Duration:** 10-15 minutes (automatic download)

---

###### STEP 6: Open the BADGR RSVP Reader Project

1. On the Android Studio welcome screen, click **"Open"**
2. Navigate to the `RSVPReader` folder
3. Click **"OK"**

Android Studio will:
- Load the project
- Download Gradle wrapper (if needed)
- Sync Gradle dependencies
- Index project files

**Duration:** 3-5 minutes

---

###### STEP 7: Create an Android Virtual Device (AVD)

1. Click the **"Device Manager"** icon in the toolbar (phone icon)
2. Click **"Create Device"**
3. Select **"Pixel 7"** (recommended)
4. Click **"Next"**
5. Under system images, select **"UpsideDownCake" (API 34, Android 14)**
6. If not downloaded, click **"Download"** next to it
7. Click **"Next"**
8. Name it **"BADGR_Test_Device"**
9. Click **"Finish"**

**Duration:** 5 minutes (plus download time if needed)

---

###### STEP 8: Build and Run the App

**Method 1 - Using Android Studio GUI (Easiest):**
1. Click the green **"Run" ▶** button in the toolbar
2. Select **"BADGR_Test_Device"** from the dropdown
3. Wait for the build to complete

**Method 2 - Using Command Line:**
```bash
cd RSVPReader
./build.sh
```

**First build takes:** 3-5 minutes (downloads dependencies)  
**Subsequent builds:** Under 1 minute

---

###### STEP 9: Test the App

Once the app launches, you should see:

> BADGR logo at the top (blue)  
> "Speed Reader" title  
> "by BADGR Technologies LLC" subtitle  
> Large centered word display area  
> Progress bar  
> WPM slider (default: 300 WPM)  
> Play/Pause button (large blue circle)  
> Jump back/forward buttons  
> Reset button  

**Test the controls:**
1. Press **Play** - words should appear one at a time
2. Notice the **red letter** in each word (ORP)
3. Adjust the **WPM slider** - speed changes
4. Press **Jump Forward** - skips 10 words
5. Press **Reset** - returns to beginning

---

#### VERIFICATION CHECKLIST

After building, verify everything works:

- [ ] App launches without crashes
- [ ] BADGR branding visible
- [ ] Words display one at a time
- [ ] Red ORP letter highlighted
- [ ] Play button starts reading
- [ ] Pause button stops reading
- [ ] WPM slider changes speed
- [ ] Jump buttons work
- [ ] Reset button works
- [ ] Progress bar updates
- [ ] Word counter updates

---

#### TROUBLESHOOTING

###### Issue: "SDK not found"

**Solution:**
```bash
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
## OR if installed via snap:
echo "sdk.dir=$HOME/snap/android-studio/common/Android/Sdk" > local.properties
```

###### Issue: "Gradle sync failed"

**Solution:**
```bash
## In Android Studio menu:
## File → Invalidate Caches → Invalidate and Restart
```

###### Issue: "Java version incorrect"

**Solution:**
```bash
## Verify Java version
java -version  ## Should show "17.x.x"

## If not, install Java 17
sudo apt install openjdk-17-jdk -y
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

###### Issue: Emulator is slow

**Solution:**
```bash
## Verify KVM is installed
kvm-ok

## If not:
sudo apt install qemu-kvm -y
sudo adduser $USER kvm
## Logout and login for group changes to take effect
```

###### Issue: "Unable to locate adb"

**Solution:**
```bash
## Add to PATH
export PATH=$PATH:$HOME/Android/Sdk/platform-tools
echo 'export PATH=$PATH:$HOME/Android/Sdk/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

###### Issue: Build fails with dependency errors

**Solution:**
```bash
## Clean and rebuild
./gradlew clean
./gradlew build
```

---

#### BUILDING FOR PHYSICAL DEVICE

###### Enable Developer Mode on Your Phone

1. Go to **Settings** → **About Phone**
2. Tap **"Build Number"** 7 times rapidly
3. Go back to **Settings** → **System** → **Developer Options**
4. Enable **"USB Debugging"**
5. Connect phone to computer via USB

###### Build and Install

```bash
## Verify device is connected
adb devices
## Should show: List of devices attached
##              ABC123456789    device

## Install the app
./gradlew installDebug

## Or use Android Studio:
## Select your device from the device dropdown
## Click Run
```

---

#### CUSTOMIZING THE APP

###### Change Colors

Edit `app/src/main/java/com/badgr/rsvpreader/ui/theme/Theme.kt`:

```kotlin
// Change these values:
val BADGRBlue = Color(0xFF0000FF)      // Primary color
val BADGRRed = Color(0xFFFF0000)       // ORP highlight
val BADGRBlack = Color(0xFF000000)     // Background
val BADGRWhite = Color(0xFFFFFFFF)     // Text
```

###### Change Sample Text

Edit `app/src/main/res/values/strings.xml`:

```xml
<string name="sample_text">Your new text here...</string>
```

###### Change WPM Range

Edit `app/src/main/java/com/badgr/rsvpreader/MainActivity.kt`:

```kotlin
// Find this line and modify the range:
valueRange = 200f..900f,  // Change to your desired range
steps = 27,  // Adjust steps accordingly
```

---

#### BUILDING RELEASE APK

For a production-ready APK (smaller size, optimized):

```bash
## Build release APK
./gradlew assembleRelease

## APK will be at:
## app/build/outputs/apk/release/app-release-unsigned.apk
```

**Note:** For Play Store, you'll need to sign the APK with a keystore.

---

#### NEXT STEPS

###### Immediate (Today)
1. > Build and run the app
2. > Test all features
3. > Adjust WPM to your preference
4. > Try reading sample text

###### Short-term (This Week)
1. Customize colors to your exact brand
2. Add your own sample text
3. Test on a physical device
4. Share with team members

###### Long-term (Future Versions)
1. Add file import (TXT, EPUB, PDF)
2. Implement reading statistics
3. Add multiple theme support
4. Create user profiles
5. Add cloud sync

---

#### BUILD SUMMARY

| Task | Time | Status |
|------|------|--------|
| Extract project | 10 sec | |
| Run setup.sh | 10 min | |
| Install Android Studio | 15 min | |
| Setup wizard | 15 min | |
| Open project | 5 min | |
| Create AVD | 5 min | |
| First build | 5 min | |
| **TOTAL** | **~60 min** | |

*Subsequent builds: <1 minute*

---

#### > SUCCESS INDICATORS

You'll know everything is working when:

1. > No build errors in Android Studio
2. > Emulator launches successfully
3. > App icon appears (blue with white "B")
4. > BADGR branding visible in app
5. > Words display smoothly
6. > Red ORP letter clearly visible
7. > All controls responsive
8. > No lag at any WPM speed

---

#### LEARNING RESOURCES

###### Official Documentation
- [Android Developer Guide](https://developer.android.com/guide)
- [Jetpack Compose Tutorial](https://developer.android.com/jetpack/compose/tutorial)
- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)

###### Project-Specific Docs
- **TECHNICAL.md** - Architecture deep dive
- **README.md** - Complete feature documentation
- **RSVPEngine.kt** - Well-commented core logic

---

#### PRO TIPS

1. **Use keyboard shortcuts** in Android Studio (Ctrl+Shift+A for actions)
2. **Enable auto-import** (Settings → Editor → Auto Import)
3. **Use Logcat** for debugging (View → Tool Windows → Logcat)
4. **Hot reload** works in emulator (changes show without rebuild)
5. **Create multiple AVDs** for testing different screen sizes

---

#### GETTING HELP

If you encounter issues:

1. **Check this guide** - Troubleshooting section above
2. **Read README.md** - Comprehensive troubleshooting
3. **Check TECHNICAL.md** - Architecture details
4. **Verify prerequisites** - Java 17, Android Studio, SDK
5. **Check Android Studio Logcat** - Error messages

---

#### CONGRATULATIONS!

If you've made it this far, you now have:
- > A working Android development environment
- > A production-ready RSVP speed reader app
- > BADGR Technologies branding integrated
- > Complete understanding of the build process
- > The ability to customize and extend the app

**Welcome to Android development! **

---

**Built with ❤️ for BADGRTechnologies LLC**  
© 2026 BADGRTechnologies LLC. All rights reserved.

---

#### QUICK COMMAND REFERENCE

```bash
## Complete build workflow
cd RSVPReader
./setup.sh
source ~/.bashrc
android-studio .

## Alternative: Command-line build
./gradlew clean build
./gradlew installDebug

## Check devices
adb devices

## View logs
adb logcat | grep BADGR

## Uninstall app
adb uninstall com.badgr.rsvpreader
```

**Ready to build? Start with ./setup.sh!**
