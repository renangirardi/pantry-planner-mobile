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

import { getShoppingListById } from 'services/shopping-list-service';
import { ShoppingList } from 'interfaces/ShoppingList';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import ShoppingListForm from 'components/ShoppingListForm';
import MessageBar from 'components/MessageBar';

export default function EditShoppingList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [shoppingList, setShoppingList] = useState<ShoppingList | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListData() {
      if (!id) return;

      try {
        const listId = Array.isArray(id) ? id[0] : id;

        const data = await getShoppingListById(listId);
        setShoppingList(data);
      } catch (error) {
        console.error(error);
        Toast.show({
          type: 'customError',
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
      <MessageBar
        id="tutorial-edit-shopping-list"
        title="Editing Your List"
        message="You can update the list name, change the linked market, or manage your items. If you change the market, your items will automatically reorganize to match the new aisles!"
      />
      <ScrollView>
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
        </View>
      </ScrollView>
    </Container>
  );
}
