import React from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SingleSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  onClose: () => void;
  onSelect: (item: any | null) => void;
}

export default function SingleSelectModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: SingleSelectModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <Pressable className="flex-1 justify-end bg-black/80" onPress={onClose}>
        <Pressable className="h-[50%] rounded-t-3xl bg-zinc-900 p-6 pb-10">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <TouchableOpacity onPress={onClose} className="-mr-2 p-2">
              <Feather name="x" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item: any) => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <TouchableOpacity
                onPress={() => onSelect(null)}
                className="border-b border-zinc-800 py-4 active:bg-zinc-800">
                <Text className="text-lg font-semibold text-zinc-500">None (Clear Selection)</Text>
              </TouchableOpacity>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                className="border-b border-zinc-800 py-4 active:bg-zinc-800">
                <Text className="text-lg text-zinc-200">{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
