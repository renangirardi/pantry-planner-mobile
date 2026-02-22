import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ExportButtonProps = {
  onPress: () => void;
  title: string;
  description: string;
  option: 'share' | 'save';
};

export default function ExportButton({ onPress, title, description, option }: ExportButtonProps) {
  const iconViewColor = option === 'share' ? 'bg-green-500/20' : 'bg-blue-500/20';

  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-row items-center justify-center gap-4 rounded-xl border border-zinc-700 bg-zinc-800 p-4 active:opacity-70">
      <View className={`rounded-full ${iconViewColor} p-2`}>
        <Feather
          name={option === 'share' ? 'share-2' : 'download'}
          size={20}
          color={option === 'share' ? '#4ade80' : '#3b82f6'}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-bold text-zinc-100">{title}</Text>
        <Text className="text-xs text-zinc-400">{description}</Text>
      </View>
    </Pressable>
  );
}
