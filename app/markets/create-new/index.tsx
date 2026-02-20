import React from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform, View } from 'react-native';

import ContentBox from 'components/ContentBox';
import MarketForm from 'components/MarketForm';
import Container from 'components/Container';

export default function CreateNewMarket() {
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
              <MarketForm isEditing={false} initialData={{ name: '', aisles: [] }} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
