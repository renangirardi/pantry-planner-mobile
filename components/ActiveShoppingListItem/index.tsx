import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(item.id)}
      className="flex-row items-center border-b border-zinc-800 bg-zinc-900 px-4 py-4">
      <View
        className={`mr-4 h-6 w-6 items-center justify-center rounded-md border ${
          isChecked ? 'border-green-500 bg-green-500' : 'border-zinc-500 bg-transparent'
        }`}>
        {isChecked && <Feather name="check" size={16} color="white" />}
      </View>
      <View className="flex-1">
        <Text className={`text-lg ${isChecked ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
          {quantity ? <Text className="font-bold text-green-400">{quantity} • </Text> : null}
          {item.name}
        </Text>
        {item.brand && (
          <Text className={`text-sm ${isChecked ? 'text-zinc-600 line-through' : 'text-zinc-500'}`}>
            {item.brand}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
