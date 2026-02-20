import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SelectTriggerProps {
  label: string;
  value: string;
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
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`min-h-[56px] flex-row items-center justify-between rounded-md border bg-zinc-900 px-4 py-3 ${
          disabled ? 'border-zinc-800 opacity-50' : 'border-zinc-700 active:bg-zinc-800'
        }`}>
        <Text className={value ? 'flex-1 text-zinc-100' : 'text-zinc-500'}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={20} color="#71717a" />
      </TouchableOpacity>
    </View>
  );
}
