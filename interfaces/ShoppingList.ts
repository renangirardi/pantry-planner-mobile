export interface ShoppingList {
  id: string;
  name: string;
  marketId?: string;
  itemsIds?: string[];
  createdAt: string;
  checkedItemsIds?: string[];
  itemQuantities?: Record<string, string>;
}
