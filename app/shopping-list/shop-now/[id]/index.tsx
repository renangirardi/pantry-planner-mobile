import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getShoppingListById, updateShoppingList } from 'services/shopping-list-service';
import { getMarkets } from 'services/market-service';
import { getItems } from 'services/item-service';
import { ShoppingList } from 'interfaces/ShoppingList';
import { Item } from 'interfaces/Item';
import { Market } from 'interfaces/Market';

import { groupItemsForShopping, ShoppingSection } from 'utils/shopping-helpers';
import ActiveShoppingListItem from 'components/ActiveShoppingListItem';
import ShoppingProgressBar from 'components/ShoppingProgressBar';
import MultiSelectModal from 'components/MultiSelectModal';
import Modal from 'components/Modal';

export default function ActiveShopping() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [sections, setSections] = useState<ShoppingSection[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAndGroupData() {
      if (!id) return;

      try {
        const listId = Array.isArray(id) ? id[0] : id;
        const currentList = await getShoppingListById(listId);

        if (!currentList) {
          Toast.show({ type: 'error', text1: 'List not found.' });
          router.push('/shopping-list/');
          return;
        }

        const fetchedMarkets = await getMarkets();
        const fetchedItems = await getItems();

        setList(currentList);
        setMarkets(fetchedMarkets);
        setAllItems(fetchedItems);

        // CORREÇÃO DO BUG: Puxa o estado diretamente do banco!
        setCheckedItems(currentList.checkedItemsIds || []);

        setSections(groupItemsForShopping(currentList, fetchedMarkets, fetchedItems));
      } catch (error) {
        console.error(error);
        Toast.show({ type: 'error', text1: 'Failed to load shopping list.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndGroupData();
  }, [id]);

  const handleToggleCheck = async (itemId: string) => {
    const newChecked = checkedItems.includes(itemId)
      ? checkedItems.filter((id) => id !== itemId)
      : [...checkedItems, itemId];

    setCheckedItems(newChecked);

    if (list) {
      await updateShoppingList({ ...list, checkedItemsIds: newChecked });
    }
  };

  const handleToggleAddList = async (itemId: string) => {
    if (!list) return;

    const newItemsIds = list.itemsIds!.includes(itemId)
      ? list.itemsIds!.filter((id) => id !== itemId)
      : [...list.itemsIds!, itemId];

    const updatedList = { ...list, itemsIds: newItemsIds };

    setList(updatedList);
    setSections(groupItemsForShopping(updatedList, markets, allItems));

    await updateShoppingList(updatedList);
  };

  const handleFinishShopping = () => {
    setIsFinishModalOpen(true);
  };

  const handleConfirmFinish = async () => {
    setIsFinishing(true);
    try {
      if (list) {
        await updateShoppingList({ ...list, checkedItemsIds: [] });
      }
      setIsFinishModalOpen(false);
      Toast.show({ type: 'success', text1: 'Shopping Complete! 🎉' });
      router.replace({ pathname: '/shopping-lists/', params: { status: 'finished' } });
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error finishing list' });
    } finally {
      setIsFinishing(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-zinc-950">
        <ActivityIndicator size="large" color="#16a34a" />
      </SafeAreaView>
    );
  }

  const totalItemsCount = list?.itemsIds?.length || 0;

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-row items-center border-b border-zinc-800 bg-zinc-900 px-4 py-4 shadow-md">
        <TouchableOpacity
          onPress={() => router.push('/shopping-list/')}
          className="mr-4 rounded-full bg-zinc-800 p-2">
          <Feather name="arrow-left" size={24} color="#e4e4e7" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-xl font-bold text-white" numberOfLines={1}>
            {list?.name}
          </Text>
          <Text className="text-sm text-zinc-400">
            {checkedItems.length === totalItemsCount ? 'All done!' : "Let's get everything."}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsItemModalOpen(true)}
          className="ml-2 flex-row items-center justify-center gap-1 rounded-full bg-green-600/20 px-3 py-2 active:bg-green-600/40">
          <Feather name="plus" size={16} color="#4ade80" />
          <Text className="text-sm font-bold text-green-400">Add</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderSectionHeader={({ section: { title } }) => (
            <View className="border-b border-zinc-700 bg-zinc-800/90 px-4 py-2 backdrop-blur-md">
              <Text className="text-sm font-bold uppercase tracking-wider text-green-400">
                {title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ActiveShoppingListItem
              item={item}
              isChecked={checkedItems.includes(item.id)}
              onToggle={handleToggleCheck}
            />
          )}
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center p-10">
              <Text className="text-center text-lg text-zinc-400">
                This list is empty.{'\n'}Tap "Add" in the corner!
              </Text>
            </View>
          }
        />
      </View>

      <ShoppingProgressBar
        totalItems={totalItemsCount}
        checkedItems={checkedItems.length}
        onFinish={handleFinishShopping}
      />

      <MultiSelectModal
        visible={isItemModalOpen}
        title="Add Forgotten Items"
        options={allItems}
        selectedIds={list?.itemsIds || []}
        onClose={() => setIsItemModalOpen(false)}
        onToggle={handleToggleAddList}
      />

      <Modal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleConfirmFinish}
        title="Finish Shopping"
        isLoading={isFinishing}
        confirmText="Finish"
        confirmVariant="primary">
        <Text className="text-base text-zinc-300">
          {checkedItems.length === totalItemsCount
            ? 'Awesome! You got everything on the list. Ready to checkout?'
            : `You still have ${totalItemsCount - checkedItems.length} items left. End anyway?`}
        </Text>
      </Modal>
    </SafeAreaView>
  );
}
