import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal as RNModal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

import { createItem, updateItem, deleteItem } from 'services/item-service';
import { getMarkets } from 'services/market-service';
import { Market } from 'interfaces/Market';
import { ItemLocation } from 'interfaces/ItemLocation';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';
import { Item } from 'interfaces/Item';

interface ItemFormProps {
  isEditing?: boolean;
  initialData?: {
    id?: string;
    name: string;
    brand?: string;
    locations?: ItemLocation[];
  };
}

const SelectTrigger = ({ label, value, placeholder, onPress, disabled = false }: any) => (
  <View className="gap-1">
    <Text className="text-sm font-bold text-zinc-400">{label}</Text>
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`h-14 flex-row items-center justify-between rounded-md border bg-zinc-900 px-4 ${
        disabled ? 'border-zinc-800 opacity-50' : 'border-zinc-700 active:bg-zinc-800'
      }`}>
      <Text className={value ? 'text-zinc-100' : 'text-zinc-500'}>{value || placeholder}</Text>
      <Feather name="chevron-down" size={20} color="#71717a" />
    </TouchableOpacity>
  </View>
);

const SelectionModal = ({ visible, title, options, onClose, onSelect }: any) => (
  <RNModal visible={visible} animationType="slide" transparent>
    <View className="flex-1 justify-end bg-black/80">
      <View className="h-[50%] rounded-t-3xl bg-zinc-900 p-6">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-bold text-white">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#a1a1aa" />
          </TouchableOpacity>
        </View>

        {options.length === 0 ? (
          <Text className="mt-10 text-center text-zinc-500">No options available.</Text>
        ) : (
          <FlatList
            data={options}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="border-b border-zinc-800 py-4 active:bg-zinc-800">
                <Text className="text-lg text-zinc-200">{item.name}</Text>
                {item.number && (
                  <Text className="text-xs text-zinc-500">Aisle Nº {item.number}</Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  </RNModal>
);

export default function ItemForm({ isEditing = false, initialData = { name: '' } }: ItemFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    brand: initialData.brand || '',
    locations: initialData.locations || [],
  });

  const [availableMarkets, setAvailableMarkets] = useState<Market[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectorState, setSelectorState] = useState<{
    isOpen: boolean;
    type: 'MARKET' | 'AISLE' | null;
    rowIndex: number | null;
  }>({ isOpen: false, type: null, rowIndex: null });

  useEffect(() => {
    async function loadMarkets() {
      const markets = await getMarkets();
      setAvailableMarkets(markets);
    }
    loadMarkets();
  }, []);

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

  const openSelector = (type: 'MARKET' | 'AISLE', index: number) => {
    setSelectorState({ isOpen: true, type, rowIndex: index });
  };

  const closeSelector = () => {
    setSelectorState({ isOpen: false, type: null, rowIndex: null });
  };

  const handleSelection = (selectedItem: any) => {
    const { type, rowIndex } = selectorState;
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
    if (!type || rowIndex === null) return [];

    if (type === 'MARKET') {
      return availableMarkets;
    }

    if (type === 'AISLE') {
      const currentLocation = formData.locations?.[rowIndex];
      if (!currentLocation?.marketId) return [];

      const market = availableMarkets.find((m) => m.id === currentLocation.marketId);
      return market?.aisles || [];
    }

    return [];
  }, [selectorState, availableMarkets, formData.locations]);

  const handleSubmit = async () => {
    if (!formData.name) {
      Toast.show({ type: 'error', text1: 'Name is required' });
      return;
    }

    const validLocations = formData.locations?.filter((l) => l.marketId && l.aisleId) || [];

    setIsLoading(true);
    try {
      const payload = { ...formData, locations: validLocations, id: initialData.id };

      if (isEditing && initialData.id) {
        await updateItem(payload as Item);
        router.replace({ pathname: '/pantry-items/', params: { status: 'updated' } });
      } else {
        const id = Crypto.randomUUID();
        const payloadWithId = { ...payload, id } as Item;
        await createItem(payloadWithId);
        router.replace({ pathname: '/pantry-items/', params: { status: 'created' } });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Error saving item' });
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
      router.replace({ pathname: '/pantry-items/', params: { status: 'deleted' } });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
      Toast.show({ type: 'error', text1: 'Deletion failed', text2: 'Could not delete. ❌' });
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

  return (
    <>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-10">
          <Input
            id="name"
            placeholder="Ex: Tomato Sauce"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}>
            Item Name:
          </Input>

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
                <View key={index} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-xs font-bold uppercase text-zinc-500">
                      Location #{index + 1}
                    </Text>
                    <TouchableOpacity onPress={() => handleRemoveLocation(index)}>
                      <Feather name="trash-2" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>

                  <View className="gap-3">
                    <SelectTrigger
                      label="Market"
                      placeholder="Select a market..."
                      value={getLabelFor('MARKET', loc)}
                      onPress={() => openSelector('MARKET', index)}
                    />

                    <SelectTrigger
                      label="Aisle"
                      placeholder={loc.marketId ? 'Select an aisle...' : 'Select a market first'}
                      value={getLabelFor('AISLE', loc)}
                      disabled={!loc.marketId}
                      onPress={() => openSelector('AISLE', index)}
                    />
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddLocation}
              className="mt-4 flex-row items-center justify-center gap-2 rounded-md border border-dashed border-zinc-600 p-4 active:bg-zinc-800">
              <Feather name="plus-circle" size={20} color="#a1a1aa" />
              <Text className="font-semibold text-zinc-400">Add Location</Text>
            </TouchableOpacity>
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

      <SelectionModal
        visible={selectorState.isOpen}
        title={selectorState.type === 'MARKET' ? 'Select Market' : 'Select Aisle'}
        options={currentOptions}
        onClose={closeSelector}
        onSelect={handleSelection}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        isLoading={isDeleting}>
        <Text className="text-zinc-200">Are you sure?</Text>
      </Modal>
    </>
  );
}
