import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { Category } from 'interfaces/Category';
import Button from 'components/Button';

interface CategoryListItemProps {
  category: Category;
  onDeleteClick: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | undefined;
}

export default function CategoryListItem({
  category,
  onDeleteClick,
  isDeleting,
  deletingId,
}: CategoryListItemProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4">
      <View className="mr-4 flex-1 flex-col items-start gap-1">
        <Text className="w-full truncate text-lg font-bold text-zinc-100" numberOfLines={1}>
          {category.name}
        </Text>
      </View>

      <View className="flex-row items-center gap-2">
        <View className="h-10">
          <Button
            area="categories"
            variant="secondary"
            icon="edit-2"
            onPress={() => router.push(`/categories/${category.id}`)}>
            Edit
          </Button>
        </View>

        <View className="h-10">
          <Button
            variant="danger"
            icon="trash-2"
            isLoading={isDeleting && deletingId === category.id}
            onPress={() => onDeleteClick(category.id!)}>
            {isDeleting && deletingId === category.id ? 'Deleting' : 'Delete'}
          </Button>
        </View>
      </View>
    </View>
  );
}
