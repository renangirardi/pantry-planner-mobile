import React, { useState, useCallback } from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import ShoppingListForm from 'components/ShoppingListForm';
import MessageBar from 'components/MessageBar';

export default function CreateNewShoppingList() {
  const [formKey, setFormKey] = useState(Date.now().toString());

  useFocusEffect(
    useCallback(() => {
      setFormKey(Date.now().toString());
    }, [])
  );

  return (
    <Container>
      <MessageBar
        id="tutorial-create-shopping-list"
        title="Plan Your Trip"
        message="Give your list a name and choose a Market to have your items automatically sorted by aisles. Then, tap to add items!"
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
              <ShoppingListForm key={formKey} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
