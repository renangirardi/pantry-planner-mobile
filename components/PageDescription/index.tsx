import { ReactNode } from 'react';
import { Text } from 'react-native';

type Props = {
  children: ReactNode;
};

export default function PageDescription({ children }: Props) {
  return <Text className="mb-10 text-center text-lg leading-8 text-zinc-300">{children}</Text>;
}
