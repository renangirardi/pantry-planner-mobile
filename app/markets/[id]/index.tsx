import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { getMarketById } from 'services/market-service';
import { Market } from 'interfaces/Market';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import MarketForm from 'components/MarketForm';
import MessageBar from 'components/MessageBar';

export default function EditMarket() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [market, setMarket] = useState<Market | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      if (!id) return;

      try {
        const marketId = Array.isArray(id) ? id[0] : id;

        const data = await getMarketById(marketId);
        setMarket(data);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'customError',
          text1: 'Error',
          text2: 'Could not load market data.',
        });
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchMarketData();
  }, [id]);

  return (
    <Container>
      <MessageBar
        id="tutorial-edit-market"
        title="Editing a Market"
        message="Need to reorganize? Updating aisle names or their order here will automatically update all the items and shopping lists linked to this market!"
      />

      <View className="flex-1 p-6">
        <StatusBar barStyle="default" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <ContentBox>
              {loading ? (
                <View className="h-60 items-center justify-center">
                  <ActivityIndicator size="large" color="#16a34a" />
                  <Text className="mt-4 text-zinc-500">Loading market data...</Text>
                </View>
              ) : market ? (
                <MarketForm key={market.id} isEditing={true} initialData={market} />
              ) : (
                <View className="h-40 items-center justify-center">
                  <Text className="text-red-500">Market not found.</Text>
                </View>
              )}
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
