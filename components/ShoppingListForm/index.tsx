import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { ShoppingList } from 'interfaces/ShoppingList';
import { Market } from 'interfaces/Market';
import { Item } from 'interfaces/Item';

import {
  createShoppingList,
  updateShoppingList,
  deleteShoppingList,
} from 'services/shopping-list-service';
import { getMarkets } from 'services/market-service';
import { getItems } from 'services/item-service';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import SelectTrigger from 'components/SelectTrigger';
import SingleSelectModal from 'components/SingleSelectModal';
import MultiSelectModal from 'components/MultiSelectModal';

interface ShoppingListFormProps {
  isEditing?: boolean;
  initialData?: ShoppingList;
}

export default function ShoppingListForm({
  isEditing = false,
  initialData,
}: ShoppingListFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    marketId: initialData?.marketId || '',
    itemsIds: initialData?.itemsIds || [],
  });

  const [markets, setMarkets] = useState<Market[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [marketSelectorOpen, setMarketSelectorOpen] = useState(false);
  const [itemSelectorOpen, setItemSelectorOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const fetchedMarkets = await getMarkets();
      const fetchedItems = await getItems();
      setMarkets(fetchedMarkets);
      setAllItems(fetchedItems);
    }
    loadData();
  }, []);

  const handleMarketSelect = (market: Market | null) => {
    setFormData((prev) => ({
      ...prev,
      marketId: market ? market.id : '',
    }));
    setMarketSelectorOpen(false);
  };

  const handleItemToggle = (itemId: string) => {
    setFormData((prev) => {
      const isSelected = prev.itemsIds.includes(itemId);
      return {
        ...prev,
        itemsIds: isSelected
          ? prev.itemsIds.filter((id) => id !== itemId)
          : [...prev.itemsIds, itemId],
      };
    });
  };

  const handleSubmit = async () => {
    const finalName = formData.name.trim()
      ? formData.name
      : `Shopping List - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    setIsLoading(true);
    try {
      if (isEditing && initialData?.id) {
        await updateShoppingList({
          ...initialData,
          name: finalName,
          marketId: formData.marketId,
          itemsIds: formData.itemsIds,
        });
        router.replace({ pathname: '/shopping-list/', params: { status: 'updated' } });
      } else {
        await createShoppingList({
          id: Crypto.randomUUID(),
          name: finalName,
          marketId: formData.marketId,
          itemsIds: formData.itemsIds,
          createdAt: new Date().toISOString(),
        });
        router.replace({ pathname: '/shopping-list/', params: { status: 'created' } });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error saving list' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);
    try {
      await deleteShoppingList(initialData.id);
      setShowDeleteModal(false);
      router.replace({ pathname: '/shopping-list/', params: { status: 'deleted' } });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
      Toast.show({ type: 'error', text1: 'Deletion failed' });
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedMarketName = markets.find((m) => m.id === formData.marketId)?.name || '';

  const selectedItemsDetails = useMemo(() => {
    return allItems
      .filter((item) => formData.itemsIds.includes(item.id))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allItems, formData.itemsIds]);

  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-10">
          <Input
            id="name"
            placeholder="Ex: Sunday BBQ (Optional)"
            value={formData.name}
            onChangeText={(text: string) => setFormData((prev) => ({ ...prev, name: text }))}>
            List Name:
          </Input>

          <SelectTrigger
            label="Supermarket (Optional)"
            placeholder="Select a market (or leave blank)"
            value={selectedMarketName}
            onPress={() => setMarketSelectorOpen(true)}
          />

          <View>
            <Text className="mb-2 text-sm font-bold text-zinc-400">Items to Buy</Text>

            <View className="min-h-[100px] rounded-md border border-zinc-800 bg-zinc-900/50 px-4 py-2">
              {formData.itemsIds.length === 0 ? (
                <Text className="my-6 text-center text-zinc-500">No items selected yet.</Text>
              ) : (
                <View className="flex-col">
                  {selectedItemsDetails.map((item, index) => (
                    <View
                      key={item.id}
                      className={`flex-row items-center justify-between py-3 ${
                        index !== selectedItemsDetails.length - 1
                          ? 'border-b border-zinc-800/80'
                          : ''
                      }`}>
                      <Text className="flex-1 pr-2 text-base text-zinc-100">
                        {item.name}{' '}
                        {item.brand && (
                          <Text className="text-sm text-zinc-500">({item.brand})</Text>
                        )}
                      </Text>

                      <TouchableOpacity
                        onPress={() => handleItemToggle(item.id)}
                        className="items-center justify-center rounded-md p-2 active:bg-red-900/30">
                        <Feather name="x" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setItemSelectorOpen(true)}
              className="mt-4 flex-row items-center justify-center gap-2 rounded-md border border-dashed border-zinc-600 p-4 active:bg-zinc-800">
              <Feather name="plus-circle" size={20} color="#a1a1aa" />
              <Text className="font-semibold text-zinc-400">Add Items</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row gap-4">
            <View className="flex-1">
              <Button variant="primary" onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Update List' : 'Save List'}
              </Button>
            </View>
            {isEditing && (
              <View className="flex-1">
                <Button variant="danger" onPress={() => setShowDeleteModal(true)}>
                  Delete
                </Button>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <SingleSelectModal
        visible={marketSelectorOpen}
        title="Select Market"
        options={markets}
        onClose={() => setMarketSelectorOpen(false)}
        onSelect={handleMarketSelect}
      />

      <MultiSelectModal
        visible={itemSelectorOpen}
        title="Add Items"
        options={allItems}
        selectedIds={formData.itemsIds}
        onClose={() => setItemSelectorOpen(false)}
        onToggle={handleItemToggle}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete List"
        isLoading={isDeleting}>
        <Text className="text-zinc-200">Are you sure you want to delete this list?</Text>
      </Modal>
    </>
  );
}
