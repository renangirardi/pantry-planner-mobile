import React from 'react';
import { View, Text, Pressable, Modal as RNModal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SelectionModalProps {
  visible: boolean;
  title: string;
  options: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
}

export default function SelectionModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
}: SelectionModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/80">
        <View className="h-[50%] rounded-t-3xl bg-zinc-900 p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <Pressable onPress={onClose} className="p-2 active:opacity-50">
              <Feather name="x" size={24} color="#a1a1aa" />
            </Pressable>
          </View>

          {options.length === 0 ? (
            <Text className="mt-10 text-center text-zinc-500">No options available.</Text>
          ) : (
            <FlatList
              data={options}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => onSelect(item)}
                  className="border-b border-zinc-800 py-4 active:bg-zinc-800 active:opacity-80">
                  <Text className="text-lg text-zinc-200">{item.name}</Text>
                  {item.number && (
                    <Text className="text-xs text-zinc-500">Aisle Nº {item.number}</Text>
                  )}
                </Pressable>
              )}
            />
          )}
        </View>
      </View>
    </RNModal>
  );
}
