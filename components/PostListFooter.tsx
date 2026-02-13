import { View, Text } from 'react-native';

type Props = {
  total: number;
};

export default function PostListFooter({ total }: Props) {
  return (
    <View className="border-b border-zinc-700 bg-zinc-800 p-3">
      <Text className="text-xs font-bold uppercase text-zinc-400">Total Posts: {total}</Text>
    </View>
  );
}
