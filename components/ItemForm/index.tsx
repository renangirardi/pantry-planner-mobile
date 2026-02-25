import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, Modal as RNModal } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { createItem, updateItem, deleteItem } from 'services/item-service';
import { getMarkets } from 'services/market-service';
import { getCategories } from 'services/category-service';
import { Market } from 'interfaces/Market';
import { Category } from 'interfaces/Category';
import { ItemLocation } from 'interfaces/ItemLocation';
import { Item } from 'interfaces/Item';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import SelectTrigger from 'components/SelectTrigger';
import SingleSelectModal from 'components/SingleSelectModal';
import ContextualShortcutModal from 'components/ContextualShortcutModal';

import CategoryForm from 'components/CategoryForm';
import MarketForm from 'components/MarketForm';

import ItemLocationCard from './ItemLocationCard';

interface ItemFormProps {
  isEditing?: boolean;
  initialData?: {
    id?: string;
    name: string;
    brand?: string;
    categoryId?: string;
    locations?: ItemLocation[];
  };
}

export default function ItemForm({ isEditing = false, initialData = { name: '' } }: ItemFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    brand: initialData.brand || '',
    categoryId: initialData.categoryId || '',
    locations: initialData.locations || [],
  });

  const [availableMarkets, setAvailableMarkets] = useState<Market[]>([]);
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);

  // Estados dos Modais Contextuais
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectorState, setSelectorState] = useState<{
    isOpen: boolean;
    type: 'MARKET' | 'AISLE' | 'CATEGORY' | null;
    rowIndex: number | null;
  }>({ isOpen: false, type: null, rowIndex: null });

  // Isolamos a busca para podermos chamar sob demanda
  const loadData = async () => {
    const [markets, categories] = await Promise.all([getMarkets(), getCategories()]);
    setAvailableMarkets(markets);
    setAvailableCategories(categories);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLocation = () => {
    setFormData((prev) => ({
      ...prev,
      locations: [...(prev.locations || []), { marketId: '', aisleId: '' }],
    }));
  };

  const handleRemoveLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations?.filter((_, i) => i !== index),
    }));
  };

  const openSelector = (type: 'MARKET' | 'AISLE' | 'CATEGORY', index: number | null = null) => {
    setSelectorState({ isOpen: true, type, rowIndex: index });
  };

  const closeSelector = () => {
    setSelectorState({ isOpen: false, type: null, rowIndex: null });
  };

  const handleSelection = (selectedItem: any) => {
    const { type, rowIndex } = selectorState;

    if (type === 'CATEGORY') {
      setFormData((prev) => ({ ...prev, categoryId: selectedItem.id }));
      closeSelector();
      return;
    }

    if (rowIndex === null) return;

    const updatedLocations = [...(formData.locations || [])];

    if (type === 'MARKET') {
      updatedLocations[rowIndex] = {
        marketId: selectedItem.id,
        aisleId: '',
      };
    } else if (type === 'AISLE') {
      updatedLocations[rowIndex] = {
        ...updatedLocations[rowIndex],
        aisleId: selectedItem.id,
      };
    }

    setFormData((prev) => ({ ...prev, locations: updatedLocations }));
    closeSelector();
  };

  const currentOptions = useMemo(() => {
    const { type, rowIndex } = selectorState;
    if (!type) return [];

    if (type === 'CATEGORY') {
      return availableCategories;
    }

    if (type === 'MARKET') {
      return availableMarkets;
    }

    if (type === 'AISLE' && rowIndex !== null) {
      const currentLocation = formData.locations?.[rowIndex];
      if (!currentLocation?.marketId) return [];

      const market = availableMarkets.find((m) => m.id === currentLocation.marketId);
      return market?.aisles || [];
    }

    return [];
  }, [selectorState, availableMarkets, availableCategories, formData.locations]);

  const handleSubmit = async () => {
    if (!formData.name) {
      Toast.show({
        type: 'customError',
        text1: 'Validation Error',
        text2: 'Item name is required.',
      });
      return;
    }

    if (!formData.categoryId) {
      Toast.show({
        type: 'customError',
        text1: 'Validation Error',
        text2: 'Please select a category.',
      });
      return;
    }

    const validLocations = formData.locations?.filter((l) => l.marketId && l.aisleId) || [];

    setIsLoading(true);
    try {
      const payload = { ...formData, locations: validLocations, id: initialData.id };

      if (isEditing && initialData.id) {
        await updateItem(payload as Item);
        Toast.show({
          type: 'customSuccess',
          text1: 'Item Updated!',
          text2: 'The item was successfully updated.',
          props: { area: 'pantry', icon: 'shopping-bag' },
        });
        router.replace({ pathname: '/pantry-items/', params: { status: 'updated' } });
      } else {
        const id = Crypto.randomUUID();
        const payloadWithId = { ...payload, id } as Item;
        await createItem(payloadWithId);
        Toast.show({
          type: 'customSuccess',
          text1: 'Item Created!',
          text2: 'The item was successfully created.',
          props: { area: 'pantry', icon: 'shopping-bag' },
        });
        router.replace({ pathname: '/pantry-items/', params: { status: 'created' } });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error saving item',
        text2: 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData.id) return;
    setIsDeleting(true);
    try {
      await deleteItem(initialData.id);
      setShowDeleteModal(false);
      Toast.show({
        type: 'customSuccess',
        text1: 'Item Deleted!',
        text2: 'The item was successfully deleted.',
        props: { area: 'pantry', icon: 'shopping-bag' },
      });
      router.replace({ pathname: '/pantry-items/', params: { status: 'deleted' } });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
      Toast.show({ type: 'customError', text1: 'Deletion failed', text2: 'Could not delete.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const getLabelFor = (type: 'MARKET' | 'AISLE', loc: ItemLocation) => {
    if (type === 'MARKET') {
      return availableMarkets.find((m) => m.id === loc.marketId)?.name || '';
    }
    if (type === 'AISLE') {
      const market = availableMarkets.find((m) => m.id === loc.marketId);
      const aisle = market?.aisles?.find((a) => a.id === loc.aisleId);
      return aisle ? `${aisle.name} (Nº ${aisle.number})` : '';
    }
    return '';
  };

  const getCategoryLabel = () => {
    return availableCategories.find((c) => c.id === formData.categoryId)?.name || '';
  };

  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-3 pb-10">
          <Input
            id="name"
            placeholder="Ex: Tomato Sauce"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}>
            Item Name: *
          </Input>

          <View className="mb-2">
            <SelectTrigger
              label="Category: *"
              placeholder="Select a category..."
              value={getCategoryLabel()}
              onPress={() => openSelector('CATEGORY')}
            />
          </View>

          <Input
            id="brand"
            placeholder="Ex: Heinz (Optional)"
            value={formData.brand}
            onChangeText={(text) => handleChange('brand', text)}>
            Brand:
          </Input>

          <View>
            <Text className="mb-2 text-base font-bold text-zinc-100">Where to find it?</Text>

            <View className="gap-4">
              {formData.locations?.map((loc, index) => (
                <ItemLocationCard
                  key={index}
                  index={index}
                  location={loc}
                  onRemove={handleRemoveLocation}
                  getLabelFor={getLabelFor}
                  openSelector={openSelector}
                />
              ))}
            </View>

            <Pressable
              onPress={handleAddLocation}
              className="mt-4 flex-row items-center justify-center gap-2 rounded-md border border-dashed border-zinc-600 p-4 active:bg-zinc-800 active:opacity-70">
              <Feather name="plus-circle" size={20} color="#a1a1aa" />
              <Text className="font-semibold text-zinc-400">Add Location</Text>
            </Pressable>
          </View>

          <View className="mt-4 flex-row gap-4">
            <View className="flex-1">
              <Button area="pantry" variant="primary" onPress={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
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
        visible={selectorState.isOpen}
        title={
          selectorState.type === 'MARKET'
            ? 'Select Market'
            : selectorState.type === 'AISLE'
              ? 'Select Aisle'
              : 'Select Category'
        }
        options={currentOptions}
        onClose={closeSelector}
        onSelect={handleSelection}
        onCreateNew={
          selectorState.type === 'MARKET'
            ? () => setShowMarketModal(true)
            : selectorState.type === 'CATEGORY'
              ? () => setShowCategoryModal(true)
              : undefined
        }
        createNewText={
          selectorState.type === 'MARKET'
            ? 'Add Market'
            : selectorState.type === 'CATEGORY'
              ? 'Add Category'
              : undefined
        }
        area={
          selectorState.type === 'MARKET'
            ? 'market'
            : selectorState.type === 'CATEGORY'
              ? 'categories'
              : 'default'
        }
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        isLoading={isDeleting}>
        <Text className="text-zinc-200">Are you sure?</Text>
      </Modal>

      {/* NOSSOS MODAIS CONTEXTUAIS OMNIPRESENTES */}

      <ContextualShortcutModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        title="New Category">
        <CategoryForm
          onSuccess={() => {
            setShowCategoryModal(false);
            loadData();
          }}
        />
      </ContextualShortcutModal>

      <ContextualShortcutModal
        isOpen={showMarketModal}
        onClose={() => setShowMarketModal(false)}
        title="New Market">
        <MarketForm
          onSuccess={() => {
            setShowMarketModal(false);
            loadData();
          }}
        />
      </ContextualShortcutModal>
    </>
  );
}
