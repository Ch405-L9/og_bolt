## BADGR RSVP Speed Reader - Quick Start Guide
Get Running in 5 Minutes
For Ubuntu 24.04 (Your System)

### 1. Run Automated Setup (installs Java, KVM)
*cd /path/to/RSVPReader*  
*chmod +x setup.sh*  
*./setup.sh*

### 2. Reload Environment Variables
*source ~/.bashrc*

### 3. Install Android Studio (if not already installed)
*sudo snap install android-studio --classic*

### 4. Launch Android Studio
*android-studio*

### 5. Open This Project
*File → Open → Navigate to RSVPReader folder → OK*

### 6. Wait for Gradle Sync
*2-3 minutes first time*

### 7. Create Virtual Device
*Tools → Device Manager → Create Device → Pixel 7 → Download API 34 → Finish*

### 8. Run the App
*Click green "Run" button → Select your device → Wait for build*

### Alternative: Command Line Build
*cd /path/to/RSVPReader*  
*./gradlew assembleDebug*  
*./gradlew installDebug*  

*APK location:*  
*app/build/outputs/apk/debug/app-debug.apk*

### Running on Your Phone
#### 1. Enable USB Debugging on Phone
*Settings → About → Tap Build Number 7 times*  
*Settings → Developer Options → USB Debugging ON*

#### 2. Connect Phone via USB

#### 3. Verify Connection
*adb devices*

#### 4. Install App
*./gradlew installDebug*

### Time Estimates
Task                          Duration  
---------------------------   --------  
Java installation             2 min  
Android Studio download       5-10 min  
Android Studio setup          5 min  
Project import & sync         3 min  
First build                   3-5 min  
Total                         ~20 min  

### System Check
Your Hardware (CONFIRMED COMPATIBLE):  
AMD Ryzen 5 5500 (12 cores)  
16GB RAM (8GB+ required)  
AMD Radeon RX 6500 XT  
1TB storage (10GB+ required)  
Ubuntu 24.04.3 LTS  

### Common Issues
Build fails with "SDK not found"  
*echo "sdk.dir=$HOME/Android/Sdk" > local.properties*

Emulator is slow  
*sudo apt install qemu-kvm -y*  
*sudo adduser $USER kvm*  
*Logout and login*

Gradle sync fails  
*File → Invalidate Caches → Invalidate and Restart*

### Need Help?
*Check README.md for detailed instructions*  
*See Troubleshooting section*  
*Verify all prerequisites are met*

Ready to build? Run *./setup.sh* now!

© 2026 BADGR Technologies LLC
