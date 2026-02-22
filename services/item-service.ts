import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import { Item } from 'interfaces/Item';

export async function getItems(): Promise<Item[]> {
  const items = (await getStorageData<Item>(STORAGE_KEYS.ITEMS)) || [];

  return items.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const items = await getItems();
  return items.find((i) => i.id === id);
}

export async function createItem(newItem: Item): Promise<void> {
  const items = await getItems();
  items.push(newItem);
  await setStorageData(STORAGE_KEYS.ITEMS, items);
}

export async function updateItem(itemUpdated: Item): Promise<void> {
  const items = await getItems();
  const index = items.findIndex((i) => i.id === itemUpdated.id);

  if (index !== -1) {
    items[index] = { ...items[index], ...itemUpdated };
    await setStorageData(STORAGE_KEYS.ITEMS, items);
  }
}

export async function deleteItem(id: string): Promise<void> {
  const items = await getItems();
  const filteredItems = items.filter((i) => i.id !== id);
  await setStorageData(STORAGE_KEYS.ITEMS, filteredItems);
}

export async function searchItems(query: string): Promise<Item[]> {
  const items = await getItems();
  const lowerQuery = query.toLowerCase();
  return items.filter((i) => i.name.toLowerCase().includes(lowerQuery));
}
