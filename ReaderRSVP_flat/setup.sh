#!/bin/bash

# BADGR RSVP Reader - Automated Setup Script for Ubuntu 24.04
# by BADGR Technologies LLC

echo "================================================"
echo "BADGR RSVP Reader - Automated Setup"
echo "by BADGR Technologies LLC"
echo "================================================"
echo ""

# Check if running on Ubuntu
if [ ! -f /etc/lsb-release ]; then
    echo "❌ This script is designed for Ubuntu. Exiting."
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Install Java JDK 17
echo "Step 1/4: Installing Java JDK 17..."
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge "17" ]; then
        echo "✅ Java 17+ already installed"
    else
        echo "⚠️  Older Java version detected. Installing Java 17..."
        sudo apt update
        sudo apt install openjdk-17-jdk -y
    fi
else
    echo "📥 Installing Java 17..."
    sudo apt update
    sudo apt install openjdk-17-jdk -y
fi

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

# Add to bashrc if not already there
if ! grep -q "JAVA_HOME" ~/.bashrc; then
    echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
    echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
    echo "✅ Java environment variables added to ~/.bashrc"
fi

echo ""

# Step 2: Install KVM for faster emulation (AMD Ryzen optimization)
echo "Step 2/4: Setting up KVM acceleration (for AMD Ryzen)..."
if command_exists kvm-ok; then
    echo "✅ KVM already installed"
else
    echo "📥 Installing KVM..."
    sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils -y
    sudo adduser $USER kvm
    sudo adduser $USER libvirt
    echo "✅ KVM installed. Please logout and login for group changes to take effect."
fi

echo ""

# Step 3: Check for Android Studio
echo "Step 3/4: Checking Android Studio installation..."
if command_exists android-studio || [ -d "/opt/android-studio" ]; then
    echo "✅ Android Studio appears to be installed"
else
    echo "⚠️  Android Studio not found."
    echo ""
    echo "Please install Android Studio manually:"
    echo "  Method 1 (Snap): sudo snap install android-studio --classic"
    echo "  Method 2 (Manual): Download from https://developer.android.com/studio"
    echo ""
    read -p "Have you installed Android Studio? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Please install Android Studio and run this script again."
        exit 1
    fi
fi

echo ""

# Step 4: Set Android SDK path (common location)
echo "Step 4/4: Configuring Android SDK..."
ANDROID_SDK_PATH="$HOME/Android/Sdk"

if [ -d "$ANDROID_SDK_PATH" ]; then
    echo "✅ Android SDK found at $ANDROID_SDK_PATH"
    
    # Create local.properties
    echo "sdk.dir=$ANDROID_SDK_PATH" > local.properties
    echo "✅ local.properties created"
    
    # Add to bashrc if not already there
    if ! grep -q "ANDROID_HOME" ~/.bashrc; then
        echo "export ANDROID_HOME=$ANDROID_SDK_PATH" >> ~/.bashrc
        echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc
        echo 'export PATH=$PATH:$ANDROID_HOME/tools' >> ~/.bashrc
        echo "✅ Android environment variables added to ~/.bashrc"
    fi
else
    echo "⚠️  Android SDK not found at default location."
    echo "You'll need to set it manually after installing Android Studio."
fi

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "Next Steps:"
echo "1. Open Android Studio: android-studio"
echo "2. Open this project folder"
echo "3. Wait for Gradle sync to complete"
echo "4. Create an AVD (Virtual Device)"
echo "5. Click Run!"
echo ""
echo "⚠️  Important: Please run 'source ~/.bashrc' or restart your terminal"
echo "   to apply environment variable changes."
echo ""
echo "📖 See README.md for detailed instructions"
echo ""
