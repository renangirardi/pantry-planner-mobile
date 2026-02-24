import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import ContentBox from 'components/ContentBox';
import CategoryForm from 'components/CategoryForm';
import Container from 'components/Container';

export default function CreateNewCategory() {
  const [formKey, setFormKey] = useState(Date.now().toString());

  useFocusEffect(
    useCallback(() => { setFormKey(Date.now().toString()); }, [])
  );

  return (
    <Container>
      <View className="flex-1 p-6">
        <StatusBar barStyle="default" />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <ContentBox>
              <CategoryForm key={formKey} isEditing={false} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}