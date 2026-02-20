import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ShoppingList } from 'interfaces/ShoppingList';

interface ShoppingListListItemProps {
  list: ShoppingList;
  onStartShopping: (id: string) => void;
  onOptionsClick: (list: ShoppingList) => void;
}

export default function ShoppingListListItem({
  list,
  onStartShopping,
  onOptionsClick,
}: ShoppingListListItemProps) {
  const formattedDate = new Date(list.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const itemCount = list.itemsIds?.length || 0;

  return (
    <View className="flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4">
      <View className="flex-1 flex-col gap-1 pr-4">
        <Text className="text-lg font-bold text-zinc-100" numberOfLines={1}>
          {list.name}
        </Text>
        <Text className="text-sm font-light text-zinc-400">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} • {formattedDate}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => onStartShopping(list.id)}
          className="flex-row items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 active:bg-green-700">
          <Feather name="shopping-cart" size={16} color="white" />
          <Text className="font-bold text-white">Start Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onOptionsClick(list)}
          className="ml-1 items-center justify-center rounded-md p-2 active:bg-zinc-800">
          <Feather name="more-vertical" size={24} color="#a1a1aa" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
