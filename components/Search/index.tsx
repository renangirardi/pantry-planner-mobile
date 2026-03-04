import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDebouncedCallback } from 'use-debounce';
import { View, TextInput, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Props = {
  placeholder: string;
  onChange?: (text: string) => void;
  useUrlParams?: boolean;
  initialValue?: string;
};

export default function Search({
  placeholder,
  onChange,
  useUrlParams = true,
  initialValue = '',
}: Props) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSearch = useDebouncedCallback((term: string) => {
    if (useUrlParams) {
      router.setParams({ query: term });
    }
    if (onChange) {
      onChange(term);
    }
  }, 300);

  const defaultValue = useUrlParams ? params.query?.toString() : initialValue;

  return (
    <View className="mb-4">
      <Text className="mb-1 ml-1 text-sm font-medium text-zinc-400">Search:</Text>

      <View className="flex-row items-center rounded-lg border border-zinc-700 bg-zinc-800 px-4">
        <Feather name="search" size={18} color="#a1a1aa" className="mr-2" />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#71717a"
          className="flex-1 py-3 text-base text-zinc-100"
          onChangeText={handleSearch}
          defaultValue={defaultValue}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
