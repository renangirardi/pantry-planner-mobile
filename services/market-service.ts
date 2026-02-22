import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import { Market } from 'interfaces/Market';
import * as Crypto from 'expo-crypto';

export async function getMarkets(): Promise<Market[]> {
  const markets = (await getStorageData<Market>(STORAGE_KEYS.MARKETS)) || [];

  markets.sort((a, b) => a.name.localeCompare(b.name));

  markets.forEach((market) => {
    if (market.aisles) {
      market.aisles.sort((a, b) => {
        return String(a.number).localeCompare(String(b.number), undefined, { numeric: true });
      });
    }
  });

  return markets;
}

export async function getMarketById(id: string): Promise<Market | undefined> {
  const markets = await getMarkets();
  return markets.find((m) => m.id === id);
}

export async function createMarket(newMarket: Partial<Market>): Promise<void> {
  const markets = await getMarkets();

  const marketToSave = {
    ...newMarket,
    id: newMarket.id ? newMarket.id : Crypto.randomUUID(),
  };

  markets.push(marketToSave as Market);
  await setStorageData(STORAGE_KEYS.MARKETS, markets);
}

export async function updateMarket(
  marketId: string,
  marketUpdated: Partial<Market>
): Promise<void> {
  const markets = await getMarkets();
  const index = markets.findIndex((m) => m.id === marketId);

  if (index !== -1) {
    markets[index] = { ...markets[index], ...marketUpdated };
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
