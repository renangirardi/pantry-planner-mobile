import { Item } from 'interfaces/Item';
import { Market } from 'interfaces/Market';
import { ShoppingList } from 'interfaces/ShoppingList';

export interface ShoppingSection {
  title: string;
  data: Item[];
  aisleNumber: number;
}

export function groupItemsForShopping(
  list: ShoppingList,
  markets: Market[],
  allItems: Item[]
): ShoppingSection[] {
  const listItems = allItems.filter((item) => list.itemsIds!.includes(item.id));

  const market = markets.find((m) => m.id === list.marketId);

  if (!market) {
    return [
      {
        title: 'Other Items',
        data: listItems.sort((a, b) => a.name.localeCompare(b.name)),
        aisleNumber: 9999,
      },
    ];
  }

  const grouped = new Map<string, ShoppingSection>();
  const otherItems: Item[] = [];

  listItems.forEach((item) => {
    const locationInMarket = item.locations?.find((loc) => loc.marketId === market.id);

    if (locationInMarket && locationInMarket.aisleId) {
      const aisle = market.aisles.find((a) => a.id === locationInMarket.aisleId);

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
