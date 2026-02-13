import React from 'react';
import { View, Text, Image, Platform, StatusBar } from 'react-native';

import { useAuth } from 'context/AuthContext';

import UserMenu from './UserMenu';

export default function Header() {
  const { user } = useAuth();

  const paddingTop = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

  return (
    <View className="z-50 border-b border-zinc-700 bg-zinc-800 shadow-sm" style={{ paddingTop }}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-row items-center gap-3">
          <Image source={require('assets/be-logo.png')} className="h-8 w-8" resizeMode="contain" />

          <Text className="text-xl font-bold text-[#ededed]">Blog Educa</Text>
        </View>

        {user && <UserMenu />}
      </View>
    </View>
  );
}
