import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { createCategory, updateCategory, deleteCategory } from 'services/category-service';
import Button from 'components/Button';
import Input from 'components/Input';
import Modal from 'components/Modal';

interface CategoryFormProps {
  isEditing?: boolean;
  initialData?: {
    id?: string;
    name: string;
  };
}

export default function CategoryForm({
  isEditing = false,
  initialData = { name: '' },
}: CategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Toast.show({
        type: 'customError',
        text1: 'Validation Error',
        text2: 'Category name is required.',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && initialData.id) {
        await updateCategory(initialData.id, { name });
        Toast.show({
          type: 'customSuccess',
          text1: 'Category Updated!',
          text2: 'Saved successfully.',
        });
        router.replace({ pathname: '/categories/', params: { status: 'updated' } });
      } else {
        await createCategory({ name });
        Toast.show({
          type: 'customSuccess',
          text1: 'Category Created!',
          text2: 'Saved successfully.',
        });
        router.replace({ pathname: '/categories/', params: { status: 'created' } });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'customError', text1: 'Error', text2: 'Something went wrong.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData.id) return;
    setIsDeleting(true);
    try {
      await deleteCategory(initialData.id);
      setShowDeleteModal(false);
      Toast.show({
        type: 'customSuccess',
        text1: 'Category Deleted',
        text2: 'Deleted successfully.',
      });
      router.replace({ pathname: '/categories/', params: { status: 'deleted' } });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
      Toast.show({ type: 'customError', text1: 'Error', text2: 'Could not delete.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View>
        <Input id="name" placeholder="Ex: Dairy & Eggs" value={name} onChangeText={setName}>
          Category Name:
        </Input>

        <View className="mt-4 flex-row gap-4">
          <View className="flex-1">
            <Button variant="primary" area="categories" onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
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
          title="Delete Category"
          isLoading={isDeleting}>
          <View>
            <Text className="text-base text-zinc-300">
              Are you sure you want to delete{' '}
              <Text className="font-bold">&quot;{initialData?.name}&quot;</Text>?
            </Text>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
