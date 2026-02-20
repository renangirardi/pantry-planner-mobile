import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ShoppingProgressBarProps {
  totalItems: number;
  checkedItems: number;
  onFinish: () => void;
}

export default function ShoppingProgressBar({
  totalItems,
  checkedItems,
  onFinish,
}: ShoppingProgressBarProps) {
  // Evita divisão por zero caso a lista esteja vazia
  const progressPercentage = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);
  const isDone = totalItems > 0 && checkedItems === totalItems;

  return (
    <View className="border-t border-zinc-800 bg-zinc-950 p-4 shadow-lg">
      <View className="mb-4 flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-500">Progress</Text>
          <Text className="text-lg font-bold text-zinc-100">
            {checkedItems} of {totalItems} items
          </Text>
        </View>
        <Text className={`text-2xl font-black ${isDone ? 'text-green-500' : 'text-zinc-700'}`}>
          {progressPercentage}%
        </Text>
      </View>

      <View className="mb-6 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <View
          className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-green-400' : 'bg-green-600'}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      <TouchableOpacity
        onPress={onFinish}
        className={`w-full flex-row items-center justify-center gap-2 rounded-xl py-4 transition-colors ${
          isDone ? 'bg-green-600 active:bg-green-700' : 'bg-zinc-800 active:bg-zinc-700'
        }`}>
        <Feather name={isDone ? 'check' : 'flag'} size={20} color={isDone ? '#fff' : '#a1a1aa'} />
        <Text className={`text-lg font-bold ${isDone ? 'text-white' : 'text-zinc-300'}`}>
          {isDone ? 'Finish Shopping!' : 'End Shopping Early'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
