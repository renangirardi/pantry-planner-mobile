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

import { getItemById } from 'services/item-service';
import { Item } from 'interfaces/Item';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import ItemForm from 'components/ItemForm';

export default function EditItem() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [item, setItem] = useState<Item | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItemData() {
      if (!id) return;

      try {
        const itemId = Array.isArray(id) ? id[0] : id;

        const data = await getItemById(itemId);
        setItem(data);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'customError',
          text1: 'Error',
          text2: 'Could not load item data.',
        });
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchItemData();
  }, [id]);

  return (
    <Container>
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
                  <Text className="mt-4 text-zinc-500">Loading item data...</Text>
                </View>
              ) : item ? (
                <ItemForm key={item.id} isEditing={true} initialData={item} />
              ) : (
                <View className="h-40 items-center justify-center">
                  <Text className="text-red-500">Item not found.</Text>
                </View>
              )}
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
