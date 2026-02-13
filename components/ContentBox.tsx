import { ReactNode } from 'react';
import { View } from 'react-native';

type Props = {
  children: ReactNode;
};

export default function ContentBox({ children }: Props) {
  return <View className="mb-6 rounded-lg pb-10 pt-10 shadow-md ">{children}</View>;
}
