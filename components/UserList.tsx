import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { User } from '../interfaces/User';
import { deleteUser } from '../services/user-service';

import Modal from './Modal';
import UserListItem from './UserListItem';

interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  const router = useRouter();
  const [userIdToDelete, setUserIdToDelete] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const userBeingDeleted = users?.find((u) => u.id === userIdToDelete);

  const handleConfirmDelete = async () => {
    if (!userIdToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userIdToDelete);

      router.setParams({ status: 'user-deleted' });
      setUserIdToDelete(undefined);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not delete user.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="mt-4 w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={users}
        keyExtractor={(item) => item.id!}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <UserListItem
            user={item}
            onDeleteClick={setUserIdToDelete}
            isDeleting={isDeleting}
            deletingId={userIdToDelete}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-500">No users found.</Text>
          </View>
        }
        ListHeaderComponent={
          <View className="border-b border-zinc-700 bg-zinc-800 p-3">
            <Text className="text-xs font-bold uppercase text-zinc-400">User Directory</Text>
          </View>
        }
      />

      <Modal
        isOpen={!!userIdToDelete}
        onClose={() => setUserIdToDelete(undefined)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-[#ededed]">
            Are you sure you want to delete{' '}
            <Text className="font-bold text-white">&quot;{userBeingDeleted?.username}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm text-red-500">This action cannot be undone.</Text>
        </View>
      </Modal>
    </View>
  );
}
