import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { Market } from 'interfaces/Market';

import Search from 'components/Search';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import Button from 'components/Button';
import MarketList from 'components/MarketList';
import { getMarkets, searchMarkets } from 'services/market-service';
import MessageBar from 'components/MessageBar';

export default function Markets() {
  const router = useRouter();
  const { query, status } = useLocalSearchParams();

  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = query ? await searchMarkets(query.toString()) : await getMarkets();
      setMarkets(data);
    } catch (error) {
      console.error('Error when loading markets:', error);
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
        id="tutorial-markets-list"
        title="Your Go-To Markets"
        message="Add the supermarkets you visit most. Create aisles in the exact same order you walk through the store, and your shopping lists will sort themselves perfectly!"
      />

      <ScrollView>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageDescription>Search for your favorite markets or a new one.</PageDescription>

          <View className="mb-10">
            <Button
              area="market"
              variant="primary"
              icon="plus"
              onPress={() => router.push('/markets/create-new')}>
              Register New Market
            </Button>
          </View>

          <View className="w-full">
            <Search placeholder="Search by market name..."></Search>
          </View>

          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#16a34a" />
              <Text className="mt-4 text-zinc-500">Loading markets...</Text>
            </View>
          ) : (
            <MarketList markets={markets} />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
