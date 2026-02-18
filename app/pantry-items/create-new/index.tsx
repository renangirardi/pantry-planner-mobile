import React from 'react';
import { ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PageTitle from 'components/PageTitle';
import ContentBox from 'components/ContentBox';
import ItemForm from 'components/ItemForm';
import Container from 'components/Container';

export default function CreateNewItem() {
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
            <PageTitle needBackButton={true} backHref="/pantry-items/">
              Enter a new Item
            </PageTitle>

            <ContentBox>
              <ItemForm isEditing={false} initialData={{ name: '' }} />
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Container>
  );
}
