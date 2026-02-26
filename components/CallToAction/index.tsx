import { ReactNode } from 'react';
import { Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = keyof typeof Feather.glyphMap;

type Props = {
  children: ReactNode;
  variant: 'shoppingList' | 'pantryItems' | 'categories' | 'markets';
  disabled?: boolean;
  onPress?: () => void;
  icon?: FeatherIconName;
  isLoading?: boolean;
};

export default function CallToAction({
  children,
  variant,
  disabled,
  onPress,
  icon,
  isLoading,
}: Props) {
  const theme = {
    shoppingList: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      border: 'border-orange-500/20',
      iconColor: '#f97316',
    },
    pantryItems: {
      bg: 'bg-teal-500/10',
      text: 'text-teal-500',
      border: 'border-teal-500/20',
      iconColor: '#14b8a6',
    },
    categories: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-500',
      border: 'border-indigo-500/20',
      iconColor: '#6366f1',
    },
    markets: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-500',
      border: 'border-yellow-500/20',
      iconColor: '#eab308',
    },
  };

  const currentTheme = theme[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        w-full flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-4
        active:bg-zinc-800/80
        ${disabled || isLoading ? 'opacity-50' : ''}
      `}>
      <View className="flex-1 flex-row items-center">
        <View
          className={`h-12 w-12 items-center justify-center rounded-full border ${currentTheme.bg} ${currentTheme.border}`}>
          {isLoading ? (
            <Feather name="loader" size={20} color={currentTheme.iconColor} />
          ) : icon ? (
            <Feather name={icon} size={20} color={currentTheme.iconColor} />
          ) : null}
        </View>
        <Text className="ml-4 flex-1 text-lg font-bold text-zinc-100">
          {isLoading ? 'Loading...' : children}
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="#52525b" />
    </Pressable>
  );
}
