import { createItem } from './item-service';
import { getMarkets, createMarket } from './market-service';
import { Market } from 'interfaces/Market';

const initialMarkets: Market[] = [
  {
    id: '1',
    name: 'Zaffari',
    aisles: [
      { id: 'c1', name: 'Hortifruti', number: 1 },
      { id: 'c2', name: 'Mercearia', number: 2 },
      { id: 'c3', name: 'Pet Shop', number: 3 },
    ],
  },
];

const initialItems = [
  { id: 'i1', name: 'Farinha de Mandioca', locations: [{ marketId: '1', aisleId: 'c1' }] },
  { id: 'i2', name: 'Ração para o Buba', locations: [{ marketId: '1', aisleId: 'c3' }] },
];

export async function populateDatabaseWhenEmpty() {
  try {
    const markets = await getMarkets();

    if (markets.length === 0) {
      console.log('Empty database, creating mock...');

      for (const market of initialMarkets) {
        await createMarket(market);
      }

      for (const item of initialItems) {
        await createItem(item);
      }

      console.log('Mock created successfully!');
    } else {
      console.log('Database already has data, skipping mock creation.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
}
