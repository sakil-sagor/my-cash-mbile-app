import axios from 'axios';
import Constants from 'expo-constants';
import { API_TIMEOUT_MS } from '@/constants';

const apiUrl =
  Constants.expoConfig?.extra?.apiUrl ??
  process.env.EXPO_PUBLIC_API_URL ??
  'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: apiUrl as string,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});
