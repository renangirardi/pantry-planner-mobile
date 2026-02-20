import React, { useState, useCallback } from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import ShoppingListForm from 'components/ShoppingListForm';

export default function CreateNewShoppingList() {
  const [formKey, setFormKey] = useState(Date.now().toString());

  useFocusEffect(
    useCallback(() => {
      setFormKey(Date.now().toString());
    }, [])
  );

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
            <ContentBox>
              <ShoppingListForm key={formKey} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
}
