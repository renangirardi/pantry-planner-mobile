import React, { useState } from 'react';
import { View, Text, FlatList, Modal as RNModal, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { ShoppingList } from 'interfaces/ShoppingList';
import { deleteShoppingList, createShoppingList } from 'services/shopping-list-service';

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
      Toast.show({ type: 'success', text1: 'List duplicated successfully!' });

      router.setParams({ status: `duplicated-${Date.now()}` });
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error duplicating list.' });
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

      Toast.show({ type: 'success', text1: 'List deleted.' });
      router.setParams({ status: `deleted-${Date.now()}` });
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error deleting list.' });
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
        <TouchableOpacity
          className="flex-1 justify-end bg-black/60"
          activeOpacity={1}
          onPress={closeOptions}>
          <TouchableOpacity activeOpacity={1} className="rounded-t-3xl bg-zinc-900 p-6 pb-10">
            <View className="mb-6 flex-row items-center justify-between border-b border-zinc-800 pb-4">
              <Text className="w-3/4 truncate text-xl font-bold text-white" numberOfLines={1}>
                {selectedList?.name}
              </Text>
              <TouchableOpacity onPress={closeOptions} className="rounded-full bg-zinc-800 p-2">
                <Feather name="x" size={20} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <View className="gap-2">
              <TouchableOpacity
                onPress={handleEdit}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800">
                <Feather name="edit-2" size={24} color="#e4e4e7" />
                <Text className="text-lg font-semibold text-zinc-200">Edit List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDuplicate}
                disabled={isProcessing}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800">
                <Feather name="copy" size={24} color="#e4e4e7" />
                <Text className="text-lg font-semibold text-zinc-200">Duplicate List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeleteRequest}
                className="flex-row items-center gap-4 rounded-xl p-4 active:bg-red-900/30">
                <Feather name="trash-2" size={24} color="#ef4444" />
                <Text className="text-lg font-semibold text-red-500">Delete List</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
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
