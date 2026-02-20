import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Importe o AsyncStorage
import { createItem } from './item-service';
import { getMarkets, createMarket } from './market-service';
import { createShoppingList } from './shopping-list-service';
import { STORAGE_KEYS } from './storage'; // <-- Importe suas chaves (ajuste o caminho se necessário)

import mockData from '../data/mock-data.json';

export async function populateDatabaseWhenEmpty() {
  try {
    // 1. FORÇAR A LIMPEZA DO BANCO (Descomente esta linha para limpar tudo, rode o app, e depois comente novamente)
    // await AsyncStorage.multiRemove([STORAGE_KEYS.MARKETS, STORAGE_KEYS.ITEMS, STORAGE_KEYS.SHOPPINGLISTS]);
    // console.log('Database Nuked! 💣');

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
}
