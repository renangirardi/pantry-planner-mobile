import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ShoppingList } from 'interfaces/ShoppingList';

interface ShoppingListListItemProps {
  list: ShoppingList;
  onStartShopping: (id: string) => void;
  onOptionsClick: (list: ShoppingList) => void;
  onRepeatShopping: (list: ShoppingList) => void;
}

export default function ShoppingListListItem({
  list,
  onStartShopping,
  onOptionsClick,
  onRepeatShopping,
}: ShoppingListListItemProps) {
  const formattedDate = new Date(list.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const itemCount = list.itemsIds?.length || 0;
  const checkedCount = list.checkedItemsIds?.length || 0;

  const isFinished = itemCount > 0 && checkedCount === itemCount;
  const isInProgress = checkedCount > 0 && checkedCount < itemCount;

  let btnClass = 'bg-green-600 active:bg-green-700';
  let iconName: any = 'shopping-cart';
  let btnText = 'Start Shopping';
  let onPressAction = () => onStartShopping(list.id);

  if (isFinished) {
    btnClass = 'bg-cyan-600 active:bg-cyan-700';
    iconName = 'refresh-cw';
    btnText = 'Repeat List';
    onPressAction = () => onRepeatShopping(list);
  } else if (isInProgress) {
    btnClass = 'bg-amber-600 active:bg-amber-700';
    iconName = 'play-circle';
    btnText = 'Continue Shopping';
  }

  return (
    <View className="bg- flex-col border-b border-zinc-800 bg-zinc-900/50 p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-col gap-1 pr-4">
          <Text className="text-lg font-bold text-zinc-100" numberOfLines={1}>
            {list.name}
          </Text>
          <Text className="text-sm font-light text-zinc-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {isInProgress && ` (${checkedCount} done)`}
            {isFinished && ` (All done!)`} • {formattedDate}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onOptionsClick(list)}
          className="-mr-2 -mt-2 items-center justify-center rounded-md p-2 active:bg-zinc-800">
          <Feather name="more-vertical" size={24} color="#a1a1aa" />
        </TouchableOpacity>
      </View>

      <View className="mt-4">
        <TouchableOpacity
          onPress={onPressAction}
          className={`w-full flex-row items-center justify-center gap-2 rounded-md py-3 transition-colors ${btnClass}`}>
          <Feather name={iconName} size={18} color="white" />
          <Text className="text-base font-bold text-white">{btnText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
