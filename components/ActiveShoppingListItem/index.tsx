import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Item } from 'interfaces/Item';

interface ActiveShoppingListItemProps {
  item: Item;
  isChecked: boolean;
  onToggle: (id: string) => void;
}

export default function ActiveShoppingListItem({ item, isChecked, onToggle }: ActiveShoppingListItemProps) {
  return (
    <TouchableOpacity
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
      className="flex-row items-center border-b border-zinc-800/50 bg-zinc-900/40 p-4"
    >
      {/* Ícone de Checkbox Animado visualmente pela cor */}
      <View className="mr-4">
        <Feather
          name={isChecked ? "check-circle" : "circle"}
          size={26}
          color={isChecked ? "#22c55e" : "#52525b"} // Verde se marcado, cinza escuro se vazio
        />
      </View>

      {/* Textos com efeito de riscado (strike-through) */}
      <View className="flex-1 justify-center gap-1">
        <Text
          className={`text-lg ${isChecked ? 'text-zinc-600 line-through' : 'text-zinc-100 font-semibold'}`}
          numberOfLines={2}
        >
          {item.name}
        </Text>
        
        {item.brand && (
          <Text className={`text-sm ${isChecked ? 'text-zinc-700 line-through' : 'text-zinc-400'}`}>
            {item.brand}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}