import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ShoppingList } from 'interfaces/ShoppingList';
import { getShoppingLists, searchShoppingLists } from 'services/shopping-list-service';

import Search from 'components/Search';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import Button from 'components/Button';
import ShoppingListsList from 'components/ShoppingListList';

export default function ShoppingLists() {
  const router = useRouter();
  const { query, status } = useLocalSearchParams();

  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = query ? await searchShoppingLists(query.toString()) : await getShoppingLists();

      const sortedData = data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLists(sortedData);
    } catch (error) {
      console.error('Error when loading shopping lists:', error);
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageDescription>
            Plan your next supermarket run. Create a new list or use an existing one.
          </PageDescription>

          <View className="mb-10">
            <Button
              area="shopping"
              variant="primary"
              icon="plus"
              onPress={() => router.push('/shopping-list/create-new')}>
              Start a New Shopping List
            </Button>
          </View>

          <View className="w-full">
            <Search placeholder="Search lists by name..." />
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#2b7fff" />
              <Text className="mt-4 text-zinc-500">Loading your lists...</Text>
            </View>
          ) : (
            <ShoppingListsList lists={lists} />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
