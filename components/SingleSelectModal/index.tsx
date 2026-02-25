import React from 'react';
import { View, Text, Pressable, Modal as RNModal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface SingleSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
  onCreateNew?: () => void;
  createNewText?: string;
}

export default function SingleSelectModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
  onCreateNew,
  createNewText,
}: SingleSelectModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/80">
        <View className="h-[60%] rounded-t-3xl bg-zinc-900 p-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <Pressable onPress={onClose} className="p-2 active:opacity-50">
              <Feather name="x" size={24} color="#a1a1aa" />
            </Pressable>
          </View>

          {/* BOTÃO DE ATALHO CONTEXTUAL */}
          {onCreateNew && createNewText && (
            <Pressable
              onPress={() => {
                onClose(); // Fecha o modal antes de navegar
                setTimeout(onCreateNew, 100); // Dá um pequeno respiro para a animação do modal
              }}
              className="mb-4 flex-row items-center justify-center gap-2 rounded-lg border border-dashed border-orange-500/50 bg-orange-500/10 p-4 active:bg-orange-500/20">
              <Feather name="plus" size={20} color="#f97316" />
              <Text className="font-bold text-orange-500">{createNewText}</Text>
            </Pressable>
          )}

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
