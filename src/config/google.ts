import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface GoogleClientConfig {
  webClientId: string;
  iosClientId: string;
  androidClientId: string;
}

function getExtra(): Record<string, string | undefined> {
  return (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;
}

export function getGoogleClientConfig(): GoogleClientConfig {
  const extra = getExtra();

  return {
    webClientId:
      extra.googleWebClientId ??
      process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ??
      '',
    iosClientId:
      extra.googleIosClientId ??
      process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ??
      '',
    androidClientId:
      extra.googleAndroidClientId ??
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ??
      '',
  };
}

export function getGoogleClientIdForPlatform(): string {
  const { webClientId, iosClientId, androidClientId } = getGoogleClientConfig();

  if (Platform.OS === 'ios' && iosClientId) {
    return iosClientId;
  }
  if (Platform.OS === 'android' && androidClientId) {
    return androidClientId;
  }
  return webClientId;
}

export function isGoogleSignInConfigured(): boolean {
  const { webClientId, iosClientId, androidClientId } = getGoogleClientConfig();
  return Boolean(webClientId || iosClientId || androidClientId);
}
