# My Cash Mobile

React Native mobile app built with Expo, TypeScript, and a feature-first architecture.

## Tech Stack

- Expo SDK 56
- React Native + TypeScript
- React Navigation (auth/app flow)
- Zustand (global auth state)
- React Query (API mutations/queries)
- Axios (HTTP client with interceptors)
- expo-secure-store (token storage)
- expo-auth-session (Google idToken flow)

## Project Structure

```
src/
├── features/        # Feature modules (auth, home, ...)
├── components/ui/   # Reusable UI components
├── navigation/      # Root, Auth, App navigators
├── services/        # API client, storage, interceptors
├── store/           # Zustand stores
├── hooks/           # Shared hooks
├── providers/       # App-level providers
├── types/           # Shared API types
├── utils/           # Helpers
└── constants/       # App constants
```

## Getting Started

### Prerequisites

- Node.js 20+
- Expo Go app (for device testing) or Android/iOS emulator
- Backend API running (see `my-cash-backend`)

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start Expo dev server
npm start
```

### API URL Configuration

Set `EXPO_PUBLIC_API_URL` in `.env`:

| Platform | URL |
|---|---|
| iOS Simulator | `http://localhost:3000` |
| Android Emulator | `http://10.0.2.2:3000` |
| Physical device | `http://<your-local-ip>:3000` |

### Google Sign-In

Add OAuth client IDs to `.env` (from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)):

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
```

Set the same IDs (comma-separated) in backend `GOOGLE_CLIENT_IDS`. The app uses redirect scheme `mycash://` (see `app.config.ts`). For Android, register your app SHA-1 with the Android OAuth client.

## Architecture Highlights

- **Feature-first**: Each feature owns screens, hooks, API calls, and types
- **API abstraction**: Centralized Axios client with auth + refresh interceptors
- **Token management**: Secure storage for access/refresh tokens
- **Auth gate**: Root navigator switches between Auth and App stacks
- **Web-ready patterns**: API types and service layer designed for reuse in a future web client

## Scripts

- `npm start` — Start Expo dev server
- `npm run android` — Run on Android
- `npm run ios` — Run on iOS (macOS only)
- `npm run web` — Run in browser
