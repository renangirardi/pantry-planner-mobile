import { ReactNode } from 'react';
import { Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = keyof typeof Feather.glyphMap;

type Props = {
  children: ReactNode;
  variant: 'shoppingList' | 'meals' | 'recipes' | 'pantryItems' | 'markets';
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
  const variantClassesBtn = {
      shoppingList: 'bg-blue-600 active:bg-blue-800 border-transparent',
      meals: 'bg-green-600 active:bg-green-800 border-transparent',
      recipes: 'bg-purple-600 active:bg-purple-800 border-transparent',
      pantryItems: 'bg-yellow-600 active:bg-yellow-800 border-transparent',
      markets: 'bg-orange-600 active:bg-orange-800 border-transparent',
    },
    variantClassesTxt = {
      shoppingList: 'text-base',
      meals: 'text-base',
      recipes: 'text-base',
      pantryItems: 'text-base',
      markets: 'text-base',
    };

  const getContentColor = (pressed: boolean) => {
    return '#ffffff';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`
        min-h-12 flex-row items-center justify-center rounded-md border px-4 py-10
        ${variantClassesBtn[variant]}
        ${disabled || isLoading ? 'opacity-50' : ''}
      `}>
      {({ pressed }) => (
        <>
          <Text
            className={`mr-2 text-center ${variantClassesTxt[variant]} font-semibold`}
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
