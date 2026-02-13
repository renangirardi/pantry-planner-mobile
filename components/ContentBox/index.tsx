import { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
};

export default function ContentBox({ children }: Props) {
  return <View className="flex w-full mt-8 bg-zinc-800 p-4 rounded-lg border border-zinc-700">{children}</View>;
}
