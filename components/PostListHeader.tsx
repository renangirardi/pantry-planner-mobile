import { View, Text } from 'react-native';

type Props = {
  type: 'readOnly' | 'admin';
};

export default function PostListHeader({ type }: Props) {
  return (
    <View className="border-b border-zinc-700 bg-zinc-800 p-3">
      <Text className="text-xs font-bold uppercase text-zinc-400">Posts Library</Text>
    </View>
  );
}
