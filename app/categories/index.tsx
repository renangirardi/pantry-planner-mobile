import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { Category } from 'interfaces/Category';
import { getCategories, searchCategories } from 'services/category-service';

import Search from 'components/Search';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import Button from 'components/Button';
import CategoryList from 'components/CategoryList'; // <-- Importando a nova lista
import MessageBar from 'components/MessageBar';

export default function Categories() {
  const router = useRouter();
  const { query, status } = useLocalSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = query ? await searchCategories(query.toString()) : await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error when loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [query, status])
  );

  return (
    <Container>
      <MessageBar
        id="tutorial-categories-list"
        title="Organize Your Pantry"
        message="Categories keep your master pantry tidy. Also, if you create a Shopping List without assigning a specific market, your items will automatically be grouped using these categories!"
      />
      <ScrollView>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageDescription>Manage your pantry and shopping item categories.</PageDescription>

          <View className="mb-10 w-full">
            <Button
              area="categories"
              variant="primary"
              icon="plus"
              onPress={() => router.push('/categories/create-new')}>
              Create New Category
            </Button>
          </View>

          <View className="mb-6 w-full">
            <Search placeholder="Search categories..." />
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#16a34a" />
              <Text className="mt-4 text-zinc-500">Loading categories...</Text>
            </View>
          ) : (
            <CategoryList categories={categories} />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
