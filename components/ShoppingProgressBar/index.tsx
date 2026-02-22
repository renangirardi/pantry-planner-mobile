import React from 'react';
import { View, Text } from 'react-native';

import Button from 'components/Button';

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
        <Text className={`text-2xl font-black ${isDone ? 'text-orange-500' : 'text-zinc-700'}`}>
          {progressPercentage}%
        </Text>
      </View>

      <View className="mb-6 h-3 w-full overflow-hidden rounded-full bg-zinc-800">
        <View
          className={`h-full rounded-full transition-all duration-300 ${isDone ? 'bg-orange-500' : 'bg-orange-600'}`}
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      {/* 2. Olha que maravilha o nosso Button em ação! */}
      <View className="w-full">
        <Button
          area="shopping"
          variant={isDone ? 'primary' : 'secondary'}
          icon={isDone ? 'check' : 'flag'}
          onPress={onFinish}>
          {isDone ? 'Finish Shopping!' : 'End Shopping Early'}
        </Button>
      </View>
    </View>
  );
}
