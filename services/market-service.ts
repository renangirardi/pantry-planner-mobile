import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import { Market } from 'interfaces/Market';

export async function getMarkets(): Promise<Market[]> {
  return getStorageData<Market>(STORAGE_KEYS.MARKETS);
}

export async function getMarketById(id: string): Promise<Market | undefined> {
  const markets = await getMarkets();
  return markets.find((m) => m.id === id);
}

export async function createMarket(newMarket: Market): Promise<void> {
  const markets = await getMarkets();
  markets.push(newMarket);
  await setStorageData(STORAGE_KEYS.MARKETS, markets);
}

export async function updateMarket(marketUpdated: Market): Promise<void> {
  const markets = await getMarkets();
  const index = markets.findIndex((m) => m.id === marketUpdated.id);

  if (index !== -1) {
    markets[index] = marketUpdated;
    await setStorageData(STORAGE_KEYS.MARKETS, markets);
  }
}

export async function deleteMarket(id: string): Promise<void> {
  const markets = await getMarkets();
  const filteredMarkets = markets.filter((m) => m.id !== id);
  await setStorageData(STORAGE_KEYS.MARKETS, filteredMarkets);
}

export async function searchMarkets(query: string): Promise<Market[]> {
  const markets = await getMarkets();
  const lowerQuery = query.toLowerCase();
  return markets.filter((m) => m.name.toLowerCase().includes(lowerQuery));
}
