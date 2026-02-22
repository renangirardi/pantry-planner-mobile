import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import { ShoppingList } from 'interfaces/ShoppingList';

export async function getShoppingLists(): Promise<ShoppingList[]> {
  const lists = (await getStorageData<ShoppingList>(STORAGE_KEYS.SHOPPINGLISTS)) || [];

  return lists.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getShoppingListById(id: string): Promise<ShoppingList | undefined> {
  const shoppingLists = await getShoppingLists();
  return shoppingLists.find((l) => l.id === id);
}

export async function createShoppingList(newList: ShoppingList): Promise<void> {
  const shoppingLists = await getShoppingLists();
  shoppingLists.push(newList);
  await setStorageData(STORAGE_KEYS.SHOPPINGLISTS, shoppingLists);
}

export async function updateShoppingList(shoppingListsUpdated: ShoppingList): Promise<void> {
  const shoppingLists = await getShoppingLists();
  const index = shoppingLists.findIndex((l) => l.id === shoppingListsUpdated.id);

  if (index !== -1) {
    shoppingLists[index] = shoppingListsUpdated;
    await setStorageData(STORAGE_KEYS.SHOPPINGLISTS, shoppingLists);
  }
}

export async function deleteShoppingList(id: string): Promise<void> {
  const shoppingLists = await getShoppingLists();
  const filteredLists = shoppingLists.filter((l) => l.id !== id);
  await setStorageData(STORAGE_KEYS.SHOPPINGLISTS, filteredLists);
}

export async function searchShoppingLists(query: string): Promise<ShoppingList[]> {
  const shoppingLists = await getShoppingLists();
  const lowerQuery = query.toLowerCase();
  return shoppingLists.filter((l) => l.name.toLowerCase().includes(lowerQuery));
}
