import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { Item } from 'interfaces/Item';

import Search from 'components/Search';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import Button from 'components/Button';
import ItemList from 'components/ItemList';
import { getItems, searchItems } from 'services/item-service';
import MessageBar from 'components/MessageBar';

export default function Markets() {
  const router = useRouter();
  const { query, status } = useLocalSearchParams();

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = query ? await searchItems(query.toString()) : await getItems();
      setItems(data);
    } catch (error) {
      console.error('Error when loading items:', error);
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
        id="tutorial-pantry-items"
        title="Your Master Pantry"
        message="This is your main database. Register all the groceries you usually buy, assign them to categories or specific market aisles, and they'll organize your future shopping lists like magic!"
      />

      <ScrollView>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageDescription>Search for your items or register a new one.</PageDescription>

          <View className="mb-10">
            <Button
              area="pantry"
              variant="primary"
              icon="plus"
              onPress={() => router.push('/pantry-items/create-new')}>
              Register New Item
            </Button>
          </View>

          <View className="w-full">
            <Search placeholder="Search by item name or brand..."></Search>
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#16a34a" />
              <Text className="mt-4 text-zinc-500">Loading items...</Text>
            </View>
          ) : (
            <ItemList items={items} />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
