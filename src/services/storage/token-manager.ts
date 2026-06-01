import { STORAGE_KEYS } from '@/constants';
import {
  deleteSecureItem,
  getSecureItem,
  setSecureItem,
} from './secure-storage';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function getAccessToken(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.ACCESS_TOKEN);
}

export async function getRefreshToken(): Promise<string | null> {
  return getSecureItem(STORAGE_KEYS.REFRESH_TOKEN);
}

export async function setTokens(tokens: TokenPair): Promise<void> {
  await Promise.all([
    setSecureItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
    setSecureItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    deleteSecureItem(STORAGE_KEYS.ACCESS_TOKEN),
    deleteSecureItem(STORAGE_KEYS.REFRESH_TOKEN),
  ]);
}

export async function hasStoredTokens(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return accessToken !== null;
}
