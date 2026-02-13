import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDebouncedCallback } from 'use-debounce';
import { View, TextInput, Text } from 'react-native';

type Props = {
  placeholder: string;
};

export default function Search({ placeholder }: Props) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    router.setParams({ query: term });
  }, 300);

  return (
    <View className="mb-4">
      <Text className="mb-1 ml-1 text-sm font-medium text-zinc-300">Search:</Text>

      <View className="flex-row items-center rounded-lg border border-zinc-700 bg-zinc-800 px-4">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#a1a1aa"
          className="flex-1 text-base text-zinc-100"
          onChangeText={(text) => handleSearch(text)}
          defaultValue={params.query?.toString()}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
