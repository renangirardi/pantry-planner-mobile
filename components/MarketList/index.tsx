import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Market } from 'interfaces/Market';
import { deleteMarket } from 'services/market-service';

import Modal from 'components/Modal';
import MarketListItem from './MarketListItem';

interface MarketListProps {
  markets: Market[];
}

export default function MarketList({ markets }: MarketListProps) {
  const router = useRouter();
  const [marketIdToDelete, setMarketIdToDelete] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const marketBeingDeleted = markets?.find((m) => m.id === marketIdToDelete);

  const handleConfirmDelete = async () => {
    if (!marketIdToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMarket(marketIdToDelete);

      router.setParams({ status: 'market-deleted' });
      setMarketIdToDelete(undefined);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not delete market.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="mt-4 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={markets}
        keyExtractor={(item) => item.id!}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <MarketListItem
            market={item}
            onDeleteClick={setMarketIdToDelete}
            isDeleting={isDeleting}
            deletingId={marketIdToDelete}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-500">No markets found.</Text>
          </View>
        }
        ListHeaderComponent={
          <View className="border-b border-zinc-700 bg-zinc-800 p-3">
            <Text className="text-xs font-bold uppercase text-zinc-400">Market Directory</Text>
          </View>
        }
      />

      <Modal
        isOpen={!!marketIdToDelete}
        onClose={() => setMarketIdToDelete(undefined)}
        onConfirm={handleConfirmDelete}
        title="Delete Market"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-[#ededed]">
            Are you sure you want to delete{' '}
            <Text className="font-bold text-white">&quot;{marketBeingDeleted?.name}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm text-red-500">This action cannot be undone.</Text>
        </View>
      </Modal>
    </View>
  );
}
