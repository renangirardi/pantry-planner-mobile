import { ReactNode } from 'react';
import { Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type AppArea = 'default' | 'shopping' | 'pantry' | 'market';

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
  market: {
    primary: 'bg-yellow-600 active:bg-yellow-700',
    secondary: 'bg-transparent border border-yellow-400 active:bg-yellow-600',
    secondaryText: 'text-yellow-400',
    hexColor: '#efb100',
  },
};

type FeatherIconName = keyof typeof Feather.glyphMap;

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
  area?: AppArea;
  disabled?: boolean;
  onPress?: () => void;
  icon?: FeatherIconName;
  isLoading?: boolean;
};

export default function Button({
  children,
  variant = 'primary',
  area = 'default',
  disabled,
  onPress,
  icon,
  isLoading,
}: Props) {
  const theme = AREA_THEMES[area];

  let variantClassesBtn = '';
  if (variant === 'danger') {
    variantClassesBtn = 'bg-red-800 active:bg-red-950 border-transparent';
  } else if (variant === 'primary') {
    variantClassesBtn = theme.primary;
  } else if (variant === 'secondary') {
    variantClassesBtn = theme.secondary;
  }

  const getContentColor = (pressed: boolean) => {
    if (variant === 'danger') return '#ffffff';

    if (variant === 'secondary') {
      return pressed ? '#ffffff' : theme.hexColor;
    }

    return '#ffffff';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        min-h-12 flex-row items-center justify-center rounded-md px-4 py-3 
        ${variantClassesBtn as string}
        ${disabled || isLoading ? 'opacity-50' : ''}
      `}>
      {({ pressed }) => (
        <>
          <Text
            className="mr-2 text-center text-base font-semibold"
            style={{ color: getContentColor(pressed) }}>
            {isLoading ? 'Loading...' : children}
          </Text>

          {isLoading ? (
            <Feather name="loader" size={18} color={getContentColor(pressed)} />
          ) : icon ? (
            <Feather name={icon} size={18} color={getContentColor(pressed)} />
          ) : null}
        </>
      )}
    </Pressable>
  );
}
