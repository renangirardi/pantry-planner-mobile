import React from 'react';
import { ViewProps, View } from 'react-native';

interface ContainerProps extends ViewProps {
  showHeader?: boolean;
}

export default function Container({ children, showHeader = true, ...props }: ContainerProps) {
  return (
    <View className="flex flex-1 bg-zinc-900 " {...props}>
      {children}
    </View>
  );
}
