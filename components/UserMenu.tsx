import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useAuth } from 'context/AuthContext';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
  };

  const navigateTo = (path: string) => {
    setIsOpen(false);
    router.push(path as any);
  };

  return (
    <View className="relative z-50">
      <TouchableOpacity onPress={toggleMenu} className="flex-row items-center gap-2 p-2">
        <Text className="hidden font-medium text-zinc-200 md:flex">
          Hello, {user?.username || 'User'}
        </Text>
        <Feather name="menu" size={24} color="#ededed" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable className="flex-1 bg-black/50" onPress={() => setIsOpen(false)}>
          <View className="absolute right-4 top-24 w-56 rounded-lg border border-zinc-700 bg-zinc-800 p-2 shadow-xl">
            <View className="mb-2 border-b border-zinc-700 px-2 pb-2">
              <Text className="text-xs font-bold uppercase text-zinc-400">Signed in as</Text>
              <Text className="truncate font-bold text-zinc-100" numberOfLines={1}>
                {user?.username}
              </Text>
              <Text className="text-xs italic text-zinc-500">{user?.profile?.toUpperCase()}</Text>
            </View>

            <TouchableOpacity
              onPress={() => navigateTo('/')}
              className="flex-row items-center gap-3 rounded-md p-3 active:bg-zinc-700">
              <Feather name="home" size={18} color="#d4d4d8" />
              <Text className="text-zinc-200">Homepage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigateTo('/profile')}
              className="flex-row items-center gap-3 rounded-md p-3 active:bg-zinc-700">
              <Feather name="user" size={18} color="#d4d4d8" />
              <Text className="text-zinc-200">My Profile</Text>
            </TouchableOpacity>

            {user?.profile === 'admin' && (
              <TouchableOpacity
                onPress={() => navigateTo('/manage-users')}
                className="flex-row items-center gap-3 rounded-md p-3 active:bg-zinc-700">
                <Feather name="users" size={18} color="#d4d4d8" />
                <Text className="text-zinc-200">Manage Users</Text>
              </TouchableOpacity>
            )}

            {(user?.profile === 'admin' || user?.profile === 'teacher') && (
              <TouchableOpacity
                onPress={() => navigateTo('/manage-posts')}
                className="flex-row items-center gap-3 rounded-md p-3 active:bg-zinc-700">
                <Feather name="file-text" size={18} color="#d4d4d8" />
                <Text className="text-zinc-200">Manage Posts</Text>
              </TouchableOpacity>
            )}

            <View className="my-1 h-[1px] bg-zinc-700" />

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center gap-3 rounded-md p-3 active:bg-red-900/20">
              <Feather name="log-out" size={18} color="#ef4444" />
              <Text className="font-semibold text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
