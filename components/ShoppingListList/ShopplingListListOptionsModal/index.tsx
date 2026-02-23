import React from 'react';
import { View, Text, Modal as RNModal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingList } from 'interfaces/ShoppingList';

interface ShoppingListOptionsModalProps {
  isVisible: boolean;
  list: ShoppingList | null;
  onClose: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isProcessing?: boolean;
}

export default function ShoppingListOptionsModal({
  isVisible,
  list,
  onClose,
  onEdit,
  onDuplicate,
  onDelete,
  isProcessing = false,
}: ShoppingListOptionsModalProps) {
  const insets = useSafeAreaInsets();

  if (!list) return null;

  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <Pressable className="flex-1 justify-end bg-black/60 active:opacity-100" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl bg-zinc-900 p-6 shadow-xl active:opacity-100"
          style={{ paddingBottom: insets.bottom + 24 }}>
          <View className="mb-6 flex-row items-center justify-between border-b border-zinc-800 pb-4">
            <Text className="w-3/4 truncate text-xl font-bold text-white" numberOfLines={1}>
              {list.name}
            </Text>
            <Pressable onPress={onClose} className="-mr-2 p-2">
              <Feather name="x" size={24} color="#a1a1aa" />
            </Pressable>
          </View>

          <View className="gap-2">
            <Pressable
              onPress={onEdit}
              className="flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800">
              <Feather name="edit-2" size={24} color="#e4e4e7" />
              <Text className="text-lg font-semibold text-zinc-200">Edit List</Text>
            </Pressable>

            <Pressable
              onPress={onDuplicate}
              disabled={isProcessing}
              className={`flex-row items-center gap-4 rounded-xl p-4 active:bg-zinc-800 ${isProcessing ? 'opacity-50' : ''}`}>
              <Feather name="copy" size={24} color="#e4e4e7" />
              <Text className="text-lg font-semibold text-zinc-200">
                {isProcessing ? 'Duplicating...' : 'Duplicate List'}
              </Text>
            </Pressable>

            <Pressable
              onPress={onDelete}
              className="flex-row items-center gap-4 rounded-xl p-4 active:bg-red-900/30">
              <Feather name="trash-2" size={24} color="#ef4444" />
              <Text className="text-lg font-semibold text-red-500">Delete List</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
