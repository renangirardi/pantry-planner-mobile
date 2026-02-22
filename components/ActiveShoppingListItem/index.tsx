import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Item } from 'interfaces/Item';

interface ActiveShoppingListItemProps {
  item: Item;
  isChecked: boolean;
  onToggle: (id: string) => void;
  quantity?: string;
}

export default function ActiveShoppingListItem({
  item,
  isChecked,
  onToggle,
  quantity,
}: ActiveShoppingListItemProps) {
  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      className="flex-row items-center border-b border-zinc-800 bg-zinc-900 px-4 py-4 active:opacity-70">
      <View
        className={`mr-4 h-6 w-6 items-center justify-center rounded-md border ${
          isChecked ? 'border-orange-500 bg-orange-500' : 'border-zinc-500 bg-transparent'
        }`}>
        {isChecked && <Feather name="check" size={16} color="white" />}
      </View>
      <View className="flex-1">
        <Text className={`text-lg ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
          {quantity ? <Text className="font-bold text-orange-400">{quantity} • </Text> : null}
          {item.name}
        </Text>
        {item.brand && (
          <Text className={`text-sm ${isChecked ? 'text-zinc-600 line-through' : 'text-zinc-500'}`}>
            {item.brand}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
