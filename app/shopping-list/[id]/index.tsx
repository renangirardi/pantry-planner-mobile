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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { getShoppingListById } from 'services/shopping-list-service';
import { ShoppingList } from 'interfaces/ShoppingList';

import PageTitle from 'components/PageTitle';
import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import ShoppingListForm from 'components/ShoppingListForm';

export default function EditShoppingList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [shoppingList, setShoppingList] = useState<ShoppingList | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListData() {
      if (!id) return;

      try {
        // O Expo Router às vezes passa o ID como array se houver rotas complexas,
        // isso garante que pegamos a string correta.
        const listId = Array.isArray(id) ? id[0] : id;

        const data = await getShoppingListById(listId);
        setShoppingList(data);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not load the shopping list data.',
        });
        router.back();
      } finally {
        setLoading(false);
      }
    }

    fetchListData();
  }, [id]);

  return (
    <Container>
      <SafeAreaView className="flex-1 bg-zinc-950">
        <StatusBar barStyle="default" />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <PageTitle needBackButton={true} backHref="/shopping-list/">
              Edit Shopping List
            </PageTitle>

            <ContentBox>
              {loading ? (
                <View className="h-60 items-center justify-center">
                  <ActivityIndicator size="large" color="#16a34a" />
                  <Text className="mt-4 text-zinc-500">Loading list data...</Text>
                </View>
              ) : shoppingList ? (
                <ShoppingListForm
                  key={shoppingList.id}
                  isEditing={true}
                  initialData={shoppingList}
                />
              ) : (
                <View className="h-40 items-center justify-center">
                  <Text className="text-red-500">Shopping list not found.</Text>
                </View>
              )}
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
}
