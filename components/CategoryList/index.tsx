import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { Category } from 'interfaces/Category';
import { deleteCategory } from 'services/category-service';

import Modal from 'components/Modal';
import CategoryListItem from './CategoryListItem';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryBeingDeleted = categories?.find((c) => c.id === categoryIdToDelete);

  const handleConfirmDelete = async () => {
    if (!categoryIdToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryIdToDelete);

      Toast.show({
        type: 'customSuccess',
        text1: 'Category Deleted',
        text2: `The category "${categoryBeingDeleted?.name}" has been deleted.`,
        props: { area: 'pantry', icon: 'tag' },
      });

      router.setParams({ status: 'category-deleted' });
      setCategoryIdToDelete(undefined);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error', // ou 'customError' se você configurou assim
        text1: 'Error',
        text2: 'Could not delete category.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="mt-4 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id!}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <CategoryListItem
            category={item}
            onDeleteClick={setCategoryIdToDelete}
            isDeleting={isDeleting}
            deletingId={categoryIdToDelete}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-500">No categories found.</Text>
          </View>
        }
        ListHeaderComponent={
          <View className="border-b border-zinc-700 bg-zinc-800 p-3">
            <Text className="text-xs font-bold uppercase text-zinc-400">Category Directory</Text>
          </View>
        }
      />

      <Modal
        isOpen={!!categoryIdToDelete}
        onClose={() => setCategoryIdToDelete(undefined)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-[#ededed]">
            Are you sure you want to delete{' '}
            <Text className="font-bold text-white">&quot;{categoryBeingDeleted?.name}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm text-red-500">This action cannot be undone.</Text>
        </View>
      </Modal>
    </View>
  );
}
