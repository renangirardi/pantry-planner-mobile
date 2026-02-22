import React, { useState } from 'react';
import { View, Text, FlatList, Modal as RNModal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { ShoppingList } from 'interfaces/ShoppingList';
import {
  deleteShoppingList,
  createShoppingList,
  updateShoppingList,
} from 'services/shopping-list-service';

import Modal from 'components/Modal';
import ShoppingListListItem from './ShoppingListListItem';

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

      <RNModal visible={optionsVisible} animationType="slide" transparent>
        <Pressable
          className="flex-1 justify-end bg-black/60 active:opacity-100"
          onPress={closeOptions}>
          <Pressable className="rounded-t-3xl bg-zinc-900 p-6 pb-10 active:opacity-100">
            <View className="mb-6 flex-row items-center justify-between border-b border-zinc-800 pb-4">
              <Text className="w-3/4 truncate text-xl font-bold text-white" numberOfLines={1}>
                {selectedList?.name}
              </Text>
              <Pressable onPress={closeOptions} className="rounded-full bg-zinc-800 p-2">
                <Feather name="x" size={20} color="#a1a1aa" />
              </Pressable>
            </View>

            <View className="gap-2">
              <Pressable
                onPress={handleEdit}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800">
                <Feather name="edit-2" size={24} color="#e4e4e7" />
                <Text className="text-lg font-semibold text-zinc-200">Edit List</Text>
              </Pressable>

              <Pressable
                onPress={handleDuplicate}
                disabled={isProcessing}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800">
                <Feather name="copy" size={24} color="#e4e4e7" />
                <Text className="text-lg font-semibold text-zinc-200">Duplicate List</Text>
              </Pressable>

              <Pressable
                onPress={handleDeleteRequest}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-red-900/30">
                <Feather name="trash-2" size={24} color="#ef4444" />
                <Text className="text-lg font-semibold text-red-500">Delete List</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </RNModal>

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
