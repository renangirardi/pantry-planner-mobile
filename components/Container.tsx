import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewProps, View } from 'react-native';

import Header from './Header';

interface ContainerProps extends ViewProps {
  showHeader?: boolean;
}

export default function Container({ children, showHeader = true, ...props }: ContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950 ">
      {showHeader && <Header />}

      <View className="m-6 flex flex-1" {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}
