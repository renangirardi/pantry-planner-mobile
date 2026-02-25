import React, { useState, useCallback } from 'react';
import { View, Text, SectionList, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getShoppingListById, updateShoppingList } from 'services/shopping-list-service';
import { getMarkets } from 'services/market-service';
import { getItems } from 'services/item-service';
import { getCategories } from 'services/category-service';
import { ShoppingList } from 'interfaces/ShoppingList';
import { Item } from 'interfaces/Item';
import { Market } from 'interfaces/Market';
import { Category } from 'interfaces/Category';

import { groupItemsForShopping, ShoppingSection } from 'utils/shopping-helpers';
import ActiveShoppingListItem from 'components/ActiveShoppingListItem';
import ShoppingProgressBar from 'components/ShoppingProgressBar';
import MultiSelectModal from 'components/MultiSelectModal';
import Modal from 'components/Modal';
import MiniButton from 'components/MiniButton';

export default function ActiveShopping() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [list, setList] = useState<ShoppingList | null>(null);
  const [sections, setSections] = useState<ShoppingSection[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchAndGroupData() {
        if (!id) return;

        setIsLoading(true);
        setCheckedItems([]);

        try {
          const listId = Array.isArray(id) ? id[0] : id;
          const currentList = await getShoppingListById(listId);

          if (!currentList) {
            Toast.show({
              type: 'customError',
              text1: 'List not found.',
              text2: 'The shopping list you are trying to access does not exist.',
            });
            router.back();
            return;
          }

          const fetchedMarkets = await getMarkets();
          const fetchedItems = await getItems();
          const fetchedCategories = await getCategories();

          setList(currentList);
          setMarkets(fetchedMarkets);
          setAllItems(fetchedItems);
          setCategories(fetchedCategories);

          setCheckedItems(currentList.checkedItemsIds || []);
          setQuantities(currentList.itemQuantities || {});

          setSections(
            groupItemsForShopping(currentList, fetchedMarkets, fetchedItems, fetchedCategories)
          );
        } catch (error) {
          console.error(error);
          Toast.show({
            type: 'customError',
            text1: 'Failed to load shopping list.',
            text2: 'Please try again later.',
          });
        } finally {
          setIsLoading(false);
        }
      }

      fetchAndGroupData();
    }, [id])
  );

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

    const isSelected = list.itemsIds!.includes(itemId);
    const newItemsIds = isSelected
      ? list.itemsIds!.filter((id) => id !== itemId)
      : [...list.itemsIds!, itemId];

    const newQuantities = { ...quantities };
    if (isSelected) {
      delete newQuantities[itemId];
    }
    setQuantities(newQuantities);

    const updatedList = { ...list, itemsIds: newItemsIds, itemQuantities: newQuantities };

    setList(updatedList);
    setSections(groupItemsForShopping(updatedList, markets, allItems, categories));

    await updateShoppingList(updatedList);
  };

  const handleQuantityChange = (itemId: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleCloseItemModal = async () => {
    setIsItemModalOpen(false);
    if (list) {
      const updatedList = { ...list, itemQuantities: quantities };
      setList(updatedList);
      setSections(groupItemsForShopping(updatedList, markets, allItems, categories));
      await updateShoppingList(updatedList);
    }
  };

  const handleFinishShopping = () => {
    setIsFinishModalOpen(true);
  };

  const handleConfirmFinish = async () => {
    setIsFinishing(true);
    try {
      setIsFinishModalOpen(false);
      Toast.show({
        type: 'customSuccess',
        text1: 'Shopping Complete! 🎉',
        text2: 'Great job finishing your shopping. Time to check out!',
        props: { area: 'shopping', icon: 'shopping-cart' },
      });
      router.replace('/shopping-list/');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error finishing list',
        text2: 'Could not complete the shopping list.',
      });
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
    <View className="flex-1 bg-zinc-950">
      <View className="flex-row items-center border-b border-zinc-800 bg-zinc-900 px-4 py-4 shadow-md">
        <View className="flex-1">
          <Text className="text-xl font-bold text-white" numberOfLines={1}>
            {list?.name}
          </Text>
          <Text className="text-sm text-zinc-400">
            {checkedItems.length === totalItemsCount ? 'All done!' : "Let's get everything."}
          </Text>
        </View>

        <MiniButton
          icon="plus"
          label="Add Items"
          onPress={() => setIsItemModalOpen(true)}
          className="ml-2"
        />
      </View>

      <View className="flex-1">
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderSectionHeader={({ section: { title } }) => (
            <View className="border-b border-zinc-700 bg-zinc-800/90 px-4 py-2 backdrop-blur-md">
              <Text className="text-sm font-bold uppercase tracking-wider text-orange-500">
                {title}
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <ActiveShoppingListItem
              item={item}
              isChecked={checkedItems.includes(item.id)}
              onToggle={handleToggleCheck}
              quantity={list?.itemQuantities?.[item.id]}
            />
          )}
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center p-10">
              <Text className="text-center text-lg text-zinc-400">
                This list is empty.{'\n'}Tap &quot;Add&quot; in the corner!
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
        onClose={handleCloseItemModal}
        onToggle={handleToggleAddList}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
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
    </View>
  );
}
