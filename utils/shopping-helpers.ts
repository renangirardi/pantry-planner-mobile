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
  // 1. Pega apenas os objetos reais dos itens que pertencem a esta lista
  const listItems = allItems.filter((item) => list.itemsIds!.includes(item.id));

  // 2. Busca o mercado selecionado nesta lista
  const market = markets.find((m) => m.id === list.marketId);

  // Cénario A: A lista não tem mercado vinculado
  // Se não tem mercado, tudo vai para "Other Items" em ordem alfabética.
  if (!market) {
    return [
      {
        title: 'Other Items',
        data: listItems.sort((a, b) => a.name.localeCompare(b.name)),
        aisleNumber: 9999,
      },
    ];
  }

  // Cénario B: A lista tem mercado. Vamos agrupar!
  const grouped = new Map<string, ShoppingSection>();
  const otherItems: Item[] = []; // O nosso "limbo"

  listItems.forEach((item) => {
    // Procura se o item tem uma localização cadastrada para ESTE mercado específico
    const locationInMarket = item.locations?.find((loc) => loc.marketId === market.id);

    if (locationInMarket && locationInMarket.aisleId) {
      // Acha os detalhes do corredor (Nome e Número)
      const aisle = market.aisles.find((a) => a.id === locationInMarket.aisleId);

      if (aisle) {
        const aisleKey = aisle.id;

        // Se o corredor ainda não existe no nosso Map, nós criamos a "Seção" dele
        if (!grouped.has(aisleKey)) {
          grouped.set(aisleKey, {
            title: `Aisle ${aisle.number} - ${aisle.name}`,
            data: [],
            aisleNumber: Number(aisle.number) || 0, // Converte a string do input para número real para ordenar
          });
        }

        // Adiciona o item na seção correta
        grouped.get(aisleKey)!.data.push(item);
      } else {
        // Tem localização, mas o corredor foi apagado do mercado? Vai pro limbo!
        otherItems.push(item);
      }
    } else {
      // Não tem localização cadastrada para este mercado? Vai pro limbo!
      otherItems.push(item);
    }
  });

  // 3. Transforma o Map em um Array e ordena os corredores pelo número (1, 2, 3...)
  const sections = Array.from(grouped.values()).sort((a, b) => a.aisleNumber - b.aisleNumber);

  // 4. Ordena os itens dentro de cada corredor em ordem alfabética
  sections.forEach((section) => {
    section.data.sort((a, b) => a.name.localeCompare(b.name));
  });

  // 5. Adiciona a seção "Other Items" por último, se houver algum item lá
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
