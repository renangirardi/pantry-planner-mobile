import { ReactNode } from 'react';
import { Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = keyof typeof Feather.glyphMap;

type Props = {
  children: ReactNode;
  variant: 'primary' | 'danger' | 'secondary';
  disabled?: boolean;
  onPress?: () => void;
  icon?: FeatherIconName;
  isLoading?: boolean;
};

export default function Button({ children, variant, disabled, onPress, icon, isLoading }: Props) {
  const variantClassesBtn = {
    primary: 'bg-blue-600 active:bg-blue-800 border-transparent',
    danger: 'bg-red-800 active:bg-red-950 border-transparent',
    secondary: 'bg-transparent border border-blue-600 active:bg-blue-800',
  };

  const getContentColor = (pressed: boolean) => {
    if (variant === 'secondary') {
      return pressed ? '#ffffff' : '#16a34a';
    }
    return '#ffffff';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        min-h-12 flex-row items-center justify-center rounded-md border px-4 py-3 
        ${variantClassesBtn[variant]}
        ${disabled || isLoading ? 'opacity-50' : ''}
      `}>
      {({ pressed }) => (
        <>
          <Text
            className={`mr-2 text-center text-base font-semibold`}
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
