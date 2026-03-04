import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import mockData from 'data/default-data.json';

export async function populateDatabaseWhenEmpty() {
  try {
    const items = (await getStorageData(STORAGE_KEYS.ITEMS)) || [];

    if (items.length === 0) {
      console.log('Empty database, creating mass mock...');

      if (mockData.categories) {
        await setStorageData(STORAGE_KEYS.CATEGORIES, mockData.categories);
      }
      if (mockData.items) {
        await setStorageData(STORAGE_KEYS.ITEMS, mockData.items);
      }

      console.log('Massive Mock created successfully! 🎉');
    } else {
      console.log('Database already has data, skipping mock creation.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
}
