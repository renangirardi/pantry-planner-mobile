import { Item } from 'interfaces/Item';
import { Market } from 'interfaces/Market';
import { ShoppingList } from 'interfaces/ShoppingList';
import { Category } from 'interfaces/Category';

export interface ShoppingSection {
  title: string;
  data: Item[];
  aisleNumber: number;
}

export function groupItemsForShopping(
  list: ShoppingList,
  markets: Market[],
  allItems: Item[],
  categories: Category[] = []
): ShoppingSection[] {
  const safeItemsIds = list.itemsIds || [];
  const listItems = allItems.filter((item) => safeItemsIds.includes(item.id));

  const market = markets.find((m) => m.id === list.marketId);

  if (!market) {
    const groupedByCategory = new Map<string, ShoppingSection>();
    const uncategorizedItems: Item[] = [];

    listItems.forEach((item) => {
      if (item.categoryId) {
        const category = categories.find((c) => c.id === item.categoryId);

        if (category) {
          const catKey = category.id;

          if (!groupedByCategory.has(catKey)) {
            groupedByCategory.set(catKey, {
              title: category.name,
              data: [],
              aisleNumber: 0,
            });
          }

          groupedByCategory.get(catKey)!.data.push(item);
        } else {
          uncategorizedItems.push(item);
        }
      } else {
        uncategorizedItems.push(item);
      }
    });

    const categorySections = Array.from(groupedByCategory.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    categorySections.forEach((section) => {
      section.data.sort((a, b) => a.name.localeCompare(b.name));
    });

    if (uncategorizedItems.length > 0) {
      uncategorizedItems.sort((a, b) => a.name.localeCompare(b.name));
      categorySections.push({
        title: 'Other Items',
        data: uncategorizedItems,
        aisleNumber: 9999,
      });
    }

    return categorySections;
  }

  const grouped = new Map<string, ShoppingSection>();
  const otherItems: Item[] = [];

  listItems.forEach((item) => {
    const locationInMarket = item.locations?.find((loc) => loc.marketId === market.id);

    if (locationInMarket && locationInMarket.aisleId) {
      const aisle = market.aisles?.find((a) => a.id === locationInMarket.aisleId);

      if (aisle) {
        const aisleKey = aisle.id;

        if (!grouped.has(aisleKey)) {
          grouped.set(aisleKey, {
            title: `Aisle ${aisle.number} - ${aisle.name}`,
            data: [],
            aisleNumber: Number(aisle.number) || 0,
          });
        }

        grouped.get(aisleKey)!.data.push(item);
      } else {
        otherItems.push(item);
      }
    } else {
      otherItems.push(item);
    }
  });

  const sections = Array.from(grouped.values()).sort((a, b) => a.aisleNumber - b.aisleNumber);

  sections.forEach((section) => {
    section.data.sort((a, b) => a.name.localeCompare(b.name));
  });

  if (otherItems.length > 0) {
    otherItems.sort((a, b) => a.name.localeCompare(b.name));
    sections.push({
      title: 'Other Items',
      data: otherItems,
      aisleNumber: 9999,
    });
  }

  return sections;
}
