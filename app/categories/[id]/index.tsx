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

import { getCategoryById } from 'services/category-service';
import { Category } from 'interfaces/Category';

import ContentBox from 'components/ContentBox';
import Container from 'components/Container';
import CategoryForm from 'components/CategoryForm';

export default function EditCategory() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryData() {
      if (!id) return;
      try {
        const catId = Array.isArray(id) ? id[0] : id;
        const data = await getCategoryById(catId);
        setCategory(data);
      } catch (error) {
        Toast.show({ type: 'customError', text1: 'Error', text2: 'Could not load category.' });
        router.back();
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryData();
  }, [id]);

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
              {loading ? (
                <View className="h-60 items-center justify-center">
                  <ActivityIndicator size="large" color="#16a34a" />
                </View>
              ) : category ? (
                <CategoryForm key={category.id} isEditing={true} initialData={category} />
              ) : (
                <View className="h-40 items-center justify-center">
                  <Text className="text-red-500">Category not found.</Text>
                </View>
              )}
            </ContentBox>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Container>
  );
}
