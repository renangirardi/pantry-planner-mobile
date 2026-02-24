import { createItem } from './item-service';
import { getMarkets, createMarket } from './market-service';
import { createShoppingList } from './shopping-list-service';

import mockData from 'data/mock-data.json';
//import mockData from 'data/renan-data.json';

export async function populateDatabaseWhenEmpty() {
  /*
  try {
    const markets = await getMarkets();

    if (markets.length === 0) {
      console.log('Empty database, creating mass mock...');

      for (const market of mockData.markets) {
        await createMarket(market);
      }
      for (const item of mockData.items) {
        await createItem(item as any);
      }
      for (const shoppingList of mockData.shoppingLists) {
        await createShoppingList(shoppingList as any);
      }

      console.log('Massive Mock created successfully! 🎉');
    } else {
      console.log('Database already has data, skipping mock creation.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
    */
  console.log(
    'populateDatabaseWhenEmpty is currently disabled to prevent accidental data overwrites. Please enable it in seed.ts if you want to populate the database with mock data.'
  );
}
