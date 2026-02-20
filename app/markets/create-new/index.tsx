import React from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ContentBox from 'components/ContentBox';
import MarketForm from 'components/MarketForm';
import Container from 'components/Container';

export default function CreateNewMarket() {
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
              <MarketForm isEditing={false} initialData={{ name: '', aisles: [] }} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
}
