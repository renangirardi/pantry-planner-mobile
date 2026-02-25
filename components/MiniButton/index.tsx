import React from 'react';
import { Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type AppArea = 'default' | 'shopping' | 'pantry' | 'categories' | 'market';

export const AREA_THEMES: Record<AppArea, any> = {
  default: {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-transparent border border-blue-400 active:bg-blue-600',
    secondaryText: 'text-blue-500',
    hexColor: '#3b82f6',
  },
  shopping: {
    primary: 'bg-orange-600 active:bg-orange-700',
    secondary: 'bg-transparent border border-orange-400 active:bg-orange-600',
    secondaryText: 'text-orange-400',
    hexColor: '#ff6900',
  },
  pantry: {
    primary: 'bg-teal-600 active:bg-teal-700',
    secondary: 'bg-transparent border border-teal-400 active:bg-teal-600',
    secondaryText: 'text-teal-500',
    hexColor: '#00bba7',
  },
  categories: {
    primary: 'bg-indigo-600 active:bg-indigo-700',
    secondary: 'bg-transparent border border-indigo-400 active:bg-indigo-600',
    secondaryText: 'text-indigo-500',
    hexColor: '#615fff',
  },
  market: {
    primary: 'bg-yellow-600 active:bg-yellow-700',
    secondary: 'bg-transparent border border-yellow-400 active:bg-yellow-600',
    secondaryText: 'text-yellow-400',
    hexColor: '#efb100',
  },
};

interface MiniButtonProps {
  label: string;
  area?: AppArea;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
}

export default function MiniButton({
  label,
  area = 'default',
  icon,
  onPress,
  disabled = false,
  className = '',
}: MiniButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-center gap-1 rounded-full px-3 py-2 ${
        disabled ? 'bg-zinc-800 opacity-50' : AREA_THEMES[area].secondary
      } ${className}`}>
      {icon && (
        <Feather name={icon} size={16} color={disabled ? '#71717a' : AREA_THEMES[area].hexColor} />
      )}
      <Text
        className={`text-sm font-bold ${disabled ? 'text-zinc-500' : AREA_THEMES[area].secondaryText}`}>
        {label}
      </Text>
    </Pressable>
  );
}
