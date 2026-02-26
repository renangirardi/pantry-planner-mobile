import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import mockData from 'data/default-data.json';

export async function populateDatabaseWhenEmpty() {
  try {
    const markets = (await getStorageData(STORAGE_KEYS.MARKETS)) || [];

    if (markets.length === 0) {
      console.log('Empty database, creating mass mock...');

      await setStorageData(STORAGE_KEYS.MARKETS, mockData.markets);
      await setStorageData(STORAGE_KEYS.CATEGORIES, mockData.categories);
      await setStorageData(STORAGE_KEYS.ITEMS, mockData.items);
      await setStorageData(STORAGE_KEYS.SHOPPINGLISTS, mockData.shoppingLists);

      console.log('Massive Mock created successfully! 🎉');
    } else {
      console.log('Database already has data, skipping mock creation.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
}
