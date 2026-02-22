import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

import { createMarket, updateMarket, deleteMarket } from 'services/market-service';
import { Aisle } from 'interfaces/Aisle';

import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';

interface MarketFormProps {
  isEditing?: boolean;
  initialData?: {
    id?: string;
    name: string;
    aisles: Aisle[];
  };
}

export default function MarketForm({
  isEditing = false,
  initialData = { name: '', aisles: [] },
}: MarketFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData.name || '',
    aisles:
      initialData.aisles.length > 0
        ? initialData.aisles
        : [{ id: Date.now().toString(), name: '', number: '' }],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAisle = () => {
    setFormData((prev) => ({
      ...prev,
      aisles: [...prev.aisles, { id: Date.now().toString(), name: '', number: '' }],
    }));
  };

  const handleRemoveAisle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      aisles: prev.aisles.filter((_, i) => i !== index),
    }));
  };

  const handleAisleChange = (index: number, field: keyof Aisle, value: string) => {
    const updatedAisles = [...formData.aisles];
    updatedAisles[index] = { ...updatedAisles[index], [field]: value };

    setFormData((prev) => ({
      ...prev,
      aisles: updatedAisles,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Toast.show({
        type: 'customError',
        text1: 'Validation Error',
        text2: 'Market name is required.',
      });
      return;
    }

    const validAisles = formData.aisles.filter((a) => a.name.trim() !== '');

    setIsLoading(true);
    try {
      const payload = { ...formData, aisles: validAisles };

      if (isEditing && initialData.id) {
        await updateMarket(initialData.id, payload);
        Toast.show({
          type: 'customSuccess',
          text1: 'Market Updated!',
          text2: 'The market was successfully updated.',
          props: {
            area: 'market',
            icon: 'map-pin',
          },
        });
        router.replace({ pathname: '/markets/', params: { status: 'updated' } });
      } else {
        await createMarket(payload);
        Toast.show({
          type: 'customSuccess',
          text1: 'Market Created!',
          text2: 'The market was successfully created.',
          props: {
            area: 'market',
            icon: 'map-pin',
          },
        });
        router.replace({ pathname: '/markets/', params: { status: 'created' } });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error saving market',
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
      await deleteMarket(initialData.id);
      setShowDeleteModal(false);
      Toast.show({
        type: 'customSuccess',
        text1: 'Market Deleted',
        text2: `The market "${initialData.name}" has been deleted successfully.`,
        props: { area: 'market', icon: 'map-pin' },
      });
      router.replace({ pathname: '/markets/', params: { status: 'deleted' } });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
      Toast.show({ type: 'error', text1: 'Deletion failed', text2: 'Could not delete. ❌' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-6 pb-10">
        <Input
          id="name"
          placeholder="Ex: Supermarket Zaffari"
          value={formData.name}
          onChangeText={(text: string) => handleChange('name', text)}>
          Market Name:
        </Input>

        <View>
          <Text className="mb-2 text-base font-bold text-zinc-100">Aisles (Corredores):</Text>

          <View className="gap-3">
            {formData.aisles.map((aisle, index) => (
              <View key={aisle.id || index} className="items-top flex-row gap-2">
                <View className="w-20">
                  <Input
                    id={`aisle-${index}-number`}
                    placeholder="Nº"
                    value={String(aisle.number || '')}
                    onChangeText={(text) => handleAisleChange(index, 'number', text)}
                  />
                </View>

                <View className="flex-1">
                  <Input
                    id={`aisle-${index}-name`}
                    placeholder="Ex: Beverages, Cleaning..."
                    value={aisle.name}
                    onChangeText={(text) => handleAisleChange(index, 'name', text)}
                  />
                </View>

                <Pressable
                  onPress={() => handleRemoveAisle(index)}
                  className="mb-1 h-12 w-12 items-center justify-center rounded-md border border-red-900 bg-red-900/30 active:bg-red-900/50">
                  <Feather name="trash-2" size={20} color="#ef4444" />
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleAddAisle}
            className="mt-4 flex-row items-center justify-center gap-2 rounded-md border border-dashed border-zinc-600 p-4 active:bg-zinc-800">
            <Feather name="plus-circle" size={20} color="#a1a1aa" />
            <Text className="font-semibold text-zinc-400">Add another aisle</Text>
          </Pressable>
        </View>

        <View className="mt-4 flex-row gap-4">
          <View className="flex-1">
            <Button variant="primary" area="market" onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Market' : 'Create Market'}
            </Button>
          </View>

          {isEditing && (
            <View className="flex-1">
              <Button
                variant="danger"
                onPress={() => setShowDeleteModal(true)}
                disabled={isLoading}>
                Delete
              </Button>
            </View>
          )}
        </View>

        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Market"
          isLoading={isDeleting}>
          <View>
            <Text className="text-base text-zinc-300">
              Are you sure you want to delete{' '}
              <Text className="font-bold">&quot;{initialData?.name}&quot;</Text>?
            </Text>
            <Text className="mt-2 text-sm font-semibold text-red-500">
              This action cannot be undone.
            </Text>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
