import { STORAGE_KEYS, getStorageData, setStorageData } from './storage';
import { Category } from 'interfaces/Category';
import * as Crypto from 'expo-crypto';
import defaultData from 'data/default-data.json';

export async function getCategories(): Promise<Category[]> {
  let categories = (await getStorageData<Category>(STORAGE_KEYS.CATEGORIES)) || [];

  if (categories.length === 0) {
    const initialCategories = defaultData.categories.map((cat) => ({
      ...cat,
      id: Crypto.randomUUID(),
    })) as Category[];

    await setStorageData(STORAGE_KEYS.CATEGORIES, initialCategories);
    categories = initialCategories;
  }

  categories.sort((a, b) => a.name.localeCompare(b.name));

  return categories;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
}

export async function createCategory(newCategory: Partial<Category>): Promise<void> {
  const categories = await getCategories();

  const categoryToSave = {
    ...newCategory,
    id: newCategory.id ? newCategory.id : Crypto.randomUUID(),
  };

  categories.push(categoryToSave as Category);
  await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
}

export async function updateCategory(
  categoryId: string,
  categoryUpdated: Partial<Category>
): Promise<void> {
  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === categoryId);

  if (index !== -1) {
    categories[index] = { ...categories[index], ...categoryUpdated };
    await setStorageData(STORAGE_KEYS.CATEGORIES, categories);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategories();
  const filteredCategories = categories.filter((c) => c.id !== id);
  await setStorageData(STORAGE_KEYS.CATEGORIES, filteredCategories);
}
