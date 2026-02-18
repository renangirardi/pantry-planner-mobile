import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Item } from 'interfaces/Item';
import { deleteItem } from 'services/item-service';

import Modal from 'components/Modal';
import ItemListItem from './ItemListItem';

interface ItemListProps {
  items: Item[];
}

export default function ItemList({ items }: ItemListProps) {
  const router = useRouter();
  const [itemIdToDelete, setItemIdToDelete] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const itemBeingDeleted = items?.find((i) => i.id === itemIdToDelete);

  const handleConfirmDelete = async () => {
    if (!itemIdToDelete) return;

    setIsDeleting(true);
    try {
      await deleteItem(itemIdToDelete);

      router.setParams({ status: 'item-deleted' });
      setItemIdToDelete(undefined);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not delete item.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="mt-4 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={items}
        keyExtractor={(item) => item.id!}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <ItemListItem
            key={item.id}
            item={item}
            onDeleteClick={setItemIdToDelete}
            isDeleting={isDeleting}
            deletingId={itemIdToDelete}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-500">No items found.</Text>
          </View>
        }
        ListHeaderComponent={
          <View className="border-b border-zinc-700 bg-zinc-800 p-3">
            <Text className="text-xs font-bold uppercase text-zinc-400">Item Directory</Text>
          </View>
        }
      />

      <Modal
        isOpen={!!itemIdToDelete}
        onClose={() => setItemIdToDelete(undefined)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-[#ededed]">
            Are you sure you want to delete{' '}
            <Text className="font-bold text-white">&quot;{itemBeingDeleted?.name}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm text-red-500">This action cannot be undone.</Text>
        </View>
      </Modal>
    </View>
  );
}
