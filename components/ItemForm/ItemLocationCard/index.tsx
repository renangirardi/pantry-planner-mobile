import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ItemLocation } from 'interfaces/ItemLocation';
import SelectTrigger from 'components/SelectTrigger';

interface ItemLocationCardProps {
  index: number;
  location: ItemLocation;
  onRemove: (index: number) => void;
  getLabelFor: (type: 'MARKET' | 'AISLE', loc: ItemLocation) => string;
  openSelector: (type: 'MARKET' | 'AISLE', index: number) => void;
}

export default function ItemLocationCard({
  index,
  location,
  onRemove,
  getLabelFor,
  openSelector,
}: ItemLocationCardProps) {
  return (
    <View className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-xs font-bold uppercase text-zinc-500">Location #{index + 1}</Text>
        <Pressable onPress={() => onRemove(index)} className="p-2 active:opacity-50">
          <Feather name="trash-2" size={18} color="#ef4444" />
        </Pressable>
      </View>

      <View className="gap-3">
        <SelectTrigger
          label="Market"
          placeholder="Select a market..."
          value={getLabelFor('MARKET', location)}
          onPress={() => openSelector('MARKET', index)}
        />

        <SelectTrigger
          label="Aisle"
          placeholder={location.marketId ? 'Select an aisle...' : 'Select a market first'}
          value={getLabelFor('AISLE', location)}
          disabled={!location.marketId}
          onPress={() => openSelector('AISLE', index)}
        />
      </View>
    </View>
  );
}
