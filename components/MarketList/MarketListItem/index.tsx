import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { Market } from 'interfaces/Market';
import Button from 'components/Button';

interface MarketListItemProps {
  market: Market;
  onDeleteClick: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | undefined;
}

export default function MarketListItem({
  market,
  onDeleteClick,
  isDeleting,
  deletingId,
}: MarketListItemProps) {
  const router = useRouter();

  return (
    <View className=" flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4">
      <View className="mr-4 flex-1 flex-col items-start gap-1">
        <Text className="w-full truncate text-lg font-bold text-zinc-100" numberOfLines={1}>
          {market.name}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-10">
          <Button
            area="market"
            variant="secondary"
            icon="edit-2"
            onPress={() => router.push(`/markets/${market.id}`)}>
            Edit
          </Button>
        </View>

        <View className="h-10">
          <Button
            variant="danger"
            icon="trash-2"
            isLoading={isDeleting && deletingId === market.id}
            onPress={() => onDeleteClick(market.id!)}>
            {isDeleting && deletingId === market.id ? 'Deleting' : 'Delete'}
          </Button>
        </View>
      </View>
    </View>
  );
}
