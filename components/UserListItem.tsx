import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

import { User } from '../interfaces/User';
import Button from './Button';

interface UserListItemProps {
  user: User;
  onDeleteClick: (id: string) => void;
  isDeleting: boolean;
  deletingId: string | undefined;
}

const getProfileStyle = (profile: string) => {
  switch (profile) {
    case 'admin':
      return 'bg-red-900/30 border-red-800 text-red-400';
    case 'teacher':
      return 'bg-green-900/30 border-green-800 text-green-400';
    default:
      return 'bg-blue-900/30 border-blue-800 text-blue-400';
  }
};

export default function UserListItem({
  user,
  onDeleteClick,
  isDeleting,
  deletingId,
}: UserListItemProps) {
  const router = useRouter();
  const badgeStyle = getProfileStyle(user.profile);
  const [bgClass, borderClass, textClass] = badgeStyle.split(' ');

  return (
    <View className=" flex-row items-center justify-between border-b border-zinc-800 bg-zinc-900/50 p-4">
      {/* LADO ESQUERDO: Layout Vertical para corrigir bug de texto longo */}
      <View className="mr-4 flex-1 flex-col items-start gap-1">
        <View className={`self-start rounded border px-2 py-0.5 ${bgClass} ${borderClass}`}>
          <Text className={`text-[10px] font-bold uppercase ${textClass}`}>{user.profile}</Text>
        </View>
        <Text className="w-full truncate text-lg font-bold text-zinc-100" numberOfLines={1}>
          {user.username}
        </Text>
      </View>

      {/* LADO DIREITO: Botões usando o novo componente */}
      <View className="flex-row items-center gap-2">
        <View className="h-10">
          <Button
            variant="secondary"
            icon="edit-2"
            onPress={() => router.push(`/users/edit/${user.id}`)}>
            Edit
          </Button>
        </View>

        <View className="h-10">
          <Button
            variant="danger"
            icon="trash-2"
            isLoading={isDeleting && deletingId === user.id}
            onPress={() => onDeleteClick(user.id!)}>
            {isDeleting && deletingId === user.id ? 'Deleting' : 'Delete'}
          </Button>
        </View>
      </View>
    </View>
  );
}
