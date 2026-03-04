import React, { useState, useCallback } from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import ContentBox from 'components/ContentBox';
import ItemForm from 'components/ItemForm';
import Container from 'components/Container';
import MessageBar from 'components/MessageBar';

export default function CreateNewItem() {
  const [formKey, setFormKey] = useState(Date.now().toString());

  useFocusEffect(
    useCallback(() => {
      setFormKey(Date.now().toString());
    }, [])
  );

  return (
    <Container>
      <MessageBar
        id="tutorial-create-item"
        title="Add a New Item"
        message="Always assign a Category to your items for basic sorting. You can also map exactly where to find it by adding specific Market aisles!"
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
                <ItemForm key={formKey} isEditing={false} initialData={{ name: '' }} />
              </ContentBox>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </Container>
  );
}
