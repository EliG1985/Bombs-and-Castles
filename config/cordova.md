# Cordova/Capacitor Mobile Packaging Guide

## Steps to Package for Mobile

1. Install Cordova or Capacitor globally:
   - Cordova: `npm install -g cordova`
   - Capacitor: `npm install --save @capacitor/core @capacitor/cli`

2. Initialize project:
   - Cordova: `cordova create bombs-and-castles`
   - Capacitor: `npx cap init bombs-and-castles com.example.bombsandcastles`

3. Add platforms:
   - Cordova: `cordova platform add android ios`
   - Capacitor: `npx cap add android` / `npx cap add ios`

4. Copy web files:
   - Cordova: Place your Phaser project in `www/`
   - Capacitor: `npx cap copy`

5. Build and run:
   - Cordova: `cordova build android` / `cordova build ios`
   - Capacitor: `npx cap open android` / `npx cap open ios`

6. Adapt interface for mobile:
   - Use responsive CSS and Phaser's scale manager.
   - Test touch events and UI on devices/emulators.

7. Upload APK/IPA to stores:
   - Follow Google Play/App Store guidelines.

---

## Tips
- Use `window.devicePixelRatio` for scaling.
- Test on multiple devices.
- Add icons and splash screens.
