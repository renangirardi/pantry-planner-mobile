import React, { useCallback, useState } from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform, View } from 'react-native';

import ContentBox from 'components/ContentBox';
import MarketForm from 'components/MarketForm';
import Container from 'components/Container';
import { useFocusEffect } from 'expo-router';
import MessageBar from 'components/MessageBar';

export default function CreateNewMarket() {
  const [formKey, setFormKey] = useState(Date.now().toString());

  useFocusEffect(
    useCallback(() => {
      setFormKey(Date.now().toString());
    }, [])
  );

  return (
    <Container>
      <MessageBar
        id="tutorial-create-market"
        title="Map Your Market"
        message="Add the aisles in the exact order you usually walk through the store. This is the secret to getting your shopping lists perfectly sorted so you never have to backtrack!"
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
                <MarketForm
                  key={formKey}
                  isEditing={false}
                  initialData={{ name: '', aisles: [] }}
                />
              </ContentBox>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </Container>
  );
}
