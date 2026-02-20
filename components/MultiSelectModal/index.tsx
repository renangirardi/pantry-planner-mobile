import React from 'react';
import { View, Text, TouchableOpacity, Modal as RNModal, FlatList, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MultiSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  selectedIds: string[];
  onClose: () => void;
  onToggle: (id: string) => void;
}

export default function MultiSelectModal({
  visible,
  title,
  options,
  selectedIds,
  onClose,
  onToggle,
}: MultiSelectModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <Pressable className="flex-1 justify-end bg-black/80" onPress={onClose}>
        <Pressable className="h-[70%] rounded-t-3xl bg-zinc-900 p-6 pb-10">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <TouchableOpacity onPress={onClose} className="rounded-full bg-green-600 px-4 py-2">
              <Text className="font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>

          {options.length === 0 ? (
            <Text className="mt-10 text-center text-zinc-500">
              No items available in your pantry.
            </Text>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item: any) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <TouchableOpacity
                    onPress={() => onToggle(item.id)}
                    className="flex-row items-center justify-between border-b border-zinc-800 py-4 active:bg-zinc-800">
                    <Text
                      className={`text-lg ${isSelected ? 'font-bold text-green-500' : 'text-zinc-200'}`}>
                      {item.name}{' '}
                      {item.brand ? (
                        <Text className="text-sm text-zinc-500">({item.brand})</Text>
                      ) : (
                        ''
                      )}
                    </Text>
                    {isSelected && <Feather name="check-circle" size={24} color="#22c55e" />}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
