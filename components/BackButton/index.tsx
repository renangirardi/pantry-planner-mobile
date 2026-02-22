import { Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type BackButtonProps = {
  backRoute?: string;
  color?: string;
};

export default function BackButton({ backRoute, color }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => (backRoute ? router.replace(backRoute) : router.back())}
      className="ml-4 rounded-full p-2 active:bg-zinc-700">
      <Feather name="arrow-left" size={24} color={color || '#ffffff'} />
    </Pressable>
  );
}
