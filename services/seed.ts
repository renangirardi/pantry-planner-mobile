import { createItem } from './item-service';
import { getMarkets, createMarket } from './market-service';
import { createShoppingList } from './shopping-list-service';
import { Market } from 'interfaces/Market';
import { Item } from 'interfaces/Item';
import { ShoppingList } from 'interfaces/ShoppingList';

const initialMarkets: Market[] = [
  {
    id: '1',
    name: 'Zaffari Bourbon Ipiranga',
    aisles: [
      { id: 'c1', name: 'Hortifruti', number: '1' },
      { id: 'c2', name: 'Mercearia', number: '2' },
      { id: 'c3', name: 'Pet Shop', number: '3' },
    ],
  },
  {
    id: '2',
    name: 'Bistek Nilo Peçanha',
    aisles: [
      { id: 'c4', name: 'Hortifruti', number: '1' },
      { id: 'c5', name: 'Plásticos', number: '2' },
      { id: 'c6', name: 'Pet Shop', number: '3' },
    ],
  },
  {
    id: '3',
    name: 'Zaffari Bourbon Country',
    aisles: [
      { id: 'c7', name: 'Hortifruti', number: '1' },
      { id: 'c8', name: 'Mercearia', number: '2' },
      { id: 'c9', name: 'Açogue', number: '3' },
    ],
  },
];

const initialItems: Item[] = [
  {
    id: 'i1',
    name: 'Farinha de Mandioca',
    locations: [{ marketId: '1', aisleId: 'c1' }],
    brand: 'Yoki',
  },
  {
    id: 'i2',
    name: 'Ração para o Buba',
    locations: [{ marketId: '1', aisleId: 'c2' }],
    brand: 'Premier',
  },
];

export const initialShoppingLists: ShoppingList[] = [
  {
    id: 'l1',
    name: 'Compras da Semana',
    marketId: '1',
    itemsIds: ['i1', 'i2'],
    createdAt: new Date('2026-02-15T10:30:00.000Z').toISOString(),
  },
  {
    id: 'l2',
    name: 'Jantar Especial com a Daniela',
    marketId: '3',
    itemsIds: ['i1'],
    createdAt: new Date().toISOString(),
  },
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

      for (const shoppingList of initialShoppingLists) {
        await createShoppingList(shoppingList);
      }

      console.log('Mock created successfully!');
    } else {
      console.log('Database already has data, skipping mock creation.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }
}
