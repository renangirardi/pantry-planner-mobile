import { useRouter, RelativePathString } from 'expo-router';
import React, { ReactNode } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  children?: ReactNode;
  needBackButton?: boolean;
  backHref?: string | RelativePathString;
};

export default function PageTitle({ children, needBackButton = false, backHref }: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.replace(backHref);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  return (
    <View className="mb-8 flex-row items-center justify-between">
      <Text className="text-3xl font-bold text-blue-500 mb-4">{children}</Text>

      {needBackButton && (
        <Pressable
          onPress={handleBack}
          className="flex flex-row items-center gap-2 py-2 active:opacity-50">
          <Feather name="arrow-left" size={18} color="#16a34a" />
          <Text className="text-base font-semibold text-blue-600">Back</Text>
        </Pressable>
      )}
    </View>
  );
}
