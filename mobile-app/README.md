# Aastha Mobile App

A React Native mobile application for volunteers - built with Expo.

## Features

- 📱 **Mobile-first design** - Works on iOS and Android
- 🎯 **Echo Portal** - Voice-first mission reporting
- 🗺️ **Compass Map** - Location-based mission discovery
- 📊 **Impact Tracking** - See your contribution impact
- 👤 **Profile** - Track XP, level, and achievements
- 🎨 **Aastha Theme** - Green (#173124) and Orange (#99460a) colors

## Quick Start

### Prerequisites
- **Node.js** 16+ 
- **npm** or **yarn**
- **Expo Go app** on your phone (download from App Store / Play Store)

### Installation

```bash
cd aastha/mobile-app
npm install
```

### Run on Your Phone

```bash
# Start the development server
npx expo start

# Scan the QR code with Expo Go app
# Or press 'i' for iOS simulator, 'a' for Android emulator
```

### Run on Web (Browser)

```bash
npx expo start --web
```

## Screens

### 1. Echo Feed (`feed`)
- Hero card with level progress
- XP progress bar
- Urgent missions with accept button
- Operational tasks
- Future initiatives

### 2. Compass Map (`map`)
- Interactive map placeholder
- Real missions shown in list view

### 3. Impact (`impact`)
- Outcome verification (+28.4% delta)
- Gemini AI narrative
- Visual proof loop (before/after)
- Impact metrics

### 4. Profile (`profile`)
- User avatar and level badge
- Stats (XP, Missions, Impact Rate)
- Skills chips
- Settings menu

## Color Theme

Based on Aastha design system:

| Token | Color | Usage |
|-------|-------|-------|
| `primary` | #173124 | Dark green, headers |
| `primaryLight` | #2d4739 | Lighter green, cards |
| `primaryFixed` | #ccead6 | Light green backgrounds |
| `secondary` | #99460a | Orange, CTAs, accents |
| `secondaryLight` | #ffdbca | Light orange |
| `surface` | #fbf9f6 | Main background |
| `surfaceDark` | #f0edea | Card backgrounds |

## Building for Production

### Build for Android (APK)

```bash
npx expo build:android
```

### Build for iOS

```bash
npx expo build:ios
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## File Structure

```
mobile-app/
├── App.js              # Main app component
├── package.json        # Dependencies
├── README.md          # This file
└── assets/            # Images, fonts (if needed)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| QR code not scanning | Make sure phone and computer are on same WiFi |
| Expo Go crashes | Update Expo Go app to latest version |
| Icons not showing | Run `npm install lucide-react-native` |
| Maps not loading | Check API key in app.json |
| Build fails | Run `expo doctor` to check issues |

## Next Steps

1. Add real backend API integration
2. Implement voice recording with `expo-av`
3. Add Google Maps integration
4. Push notifications for new missions
5. Offline mode support

---

Built for GDG 2026 Solution Challenge
