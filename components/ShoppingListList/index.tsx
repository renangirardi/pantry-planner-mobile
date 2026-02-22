import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import * as Crypto from 'expo-crypto';

import { ShoppingList } from 'interfaces/ShoppingList';
import {
  deleteShoppingList,
  createShoppingList,
  updateShoppingList,
} from 'services/shopping-list-service';

import Modal from 'components/Modal';
import ShoppingListListItem from './ShoppingListListItem';
import ShoppingListOptionsModal from './ShopplingListListOptionsModal';

interface ShoppingListsListProps {
  lists: ShoppingList[];
}

export default function ShoppingListsList({ lists }: ShoppingListsListProps) {
  const router = useRouter();

  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartShopping = (id: string) => {
    router.push(`/shopping-list/shop-now/${id}`);
  };

  const handleRepeatShopping = async (list: ShoppingList) => {
    try {
      const resetList = { ...list, checkedItemsIds: [] };
      await updateShoppingList(resetList);

      Toast.show({
        type: 'customSuccess',
        text1: 'List restarted!',
        text2: `The list "${list.name}" has been reset.`,
        props: { area: 'shopping-list', icon: 'refresh-cw' },
      });

      router.push(`/shopping-list/shop-now/${list.id}`);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error restarting the list.',
        text2: 'Please try again.',
      });
    }
  };

  const openOptions = (list: ShoppingList) => {
    setSelectedList(list);
    setOptionsVisible(true);
  };

  const closeOptions = () => {
    setOptionsVisible(false);
    setSelectedList(null);
  };

  const handleEdit = () => {
    if (!selectedList) return;
    const id = selectedList.id;
    closeOptions();
    router.push(`/shopping-list/${id}`);
  };

  const handleDuplicate = async () => {
    if (!selectedList) return;
    setIsProcessing(true);

    try {
      const duplicatedList: ShoppingList = {
        ...selectedList,
        id: Crypto.randomUUID(),
        name: `${selectedList.name} (Copy)`,
        createdAt: new Date().toISOString(),
      };

      await createShoppingList(duplicatedList);

      closeOptions();
      Toast.show({
        type: 'customSuccess',
        text1: 'List duplicated!',
        text2: `The list "${selectedList.name}" has been duplicated.`,
        props: { area: 'shopping-list', icon: 'copy' },
      });

      router.setParams({ status: `duplicated-${Date.now()}` });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error duplicating list.',
        text2: 'Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRequest = () => {
    setOptionsVisible(false);
    setTimeout(() => {
      setDeleteVisible(true);
    }, 300);
  };

  const handleConfirmDelete = async () => {
    if (!selectedList) return;
    setIsProcessing(true);

    try {
      await deleteShoppingList(selectedList.id);
      setDeleteVisible(false);
      setSelectedList(null);

      Toast.show({
        type: 'customSuccess',
        text1: 'List deleted!',
        text2: `The list "${selectedList.name}" has been deleted.`,
        props: { area: 'shopping-list', icon: 'trash-2' },
      });
      router.setParams({ status: `deleted-${Date.now()}` });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error deleting list.',
        text2: 'Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View className="mt-4 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <ShoppingListListItem
            key={item.id}
            list={item}
            onStartShopping={handleStartShopping}
            onOptionsClick={openOptions}
            onRepeatShopping={handleRepeatShopping}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-500">No shopping lists found.</Text>
          </View>
        }
        ListHeaderComponent={
          <View className="border-b border-zinc-700 bg-zinc-800 p-3">
            <Text className="text-xs font-bold uppercase text-zinc-400">Your Lists</Text>
          </View>
        }
      />

      {/* 2. O modal antigamente gigante agora é apenas esta linha maravilhosa: */}
      <ShoppingListOptionsModal
        isVisible={optionsVisible}
        list={selectedList}
        onClose={closeOptions}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDeleteRequest}
        isProcessing={isProcessing}
      />

      <Modal
        isOpen={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Shopping List"
        isLoading={isProcessing}>
        <View>
          <Text className="text-base text-zinc-300">
            Are you sure you want to delete{' '}
            <Text className="font-bold text-white">&quot;{selectedList?.name}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm text-red-500">This action cannot be undone.</Text>
        </View>
      </Modal>
    </View>
  );
}
