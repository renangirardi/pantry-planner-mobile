import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  MARKETS: '@app_markets',
  ITEMS: '@app_items',
  SHOPPINGLISTS: '@app_lists',
  CATEGORIES: '@app_categories',
};

export async function getStorageData<T>(key: string): Promise<T[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error(`Error when reading data from key ${key}:`, error);
    return [];
  }
}

export async function setStorageData<T>(key: string, value: T[]): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`Error when saving data to key ${key}:`, error);
    throw new Error('Error saving data to device storage.');
  }
}
