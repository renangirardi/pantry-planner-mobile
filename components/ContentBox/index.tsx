import { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
};

export default function ContentBox({ children }: Props) {
  return (
    <View className="mt-8 flex w-full rounded-lg border border-zinc-700 bg-zinc-800 p-4">
      {children}
    </View>
  );
}
