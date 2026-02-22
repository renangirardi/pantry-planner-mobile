import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SelectTriggerProps {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function SelectTrigger({
  label,
  value,
  placeholder,
  onPress,
  disabled = false,
}: SelectTriggerProps) {
  return (
    <View className="gap-1">
      <Text className="text-sm font-bold text-zinc-400">{label}</Text>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`h-14 flex-row items-center justify-between rounded-md border bg-zinc-900 px-4 active:opacity-80 ${
          disabled ? 'border-zinc-800 opacity-50' : 'border-zinc-700 active:bg-zinc-800'
        }`}>
        <Text className={value ? 'text-zinc-100' : 'text-zinc-500'}>{value || placeholder}</Text>
        <Feather name="chevron-down" size={20} color="#71717a" />
      </Pressable>
    </View>
  );
}
