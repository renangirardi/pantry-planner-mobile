import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal as RNModal,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

interface MultiSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  selectedIds: string[];
  quantities?: Record<string, string>;
  onClose: () => void;
  onToggle: (id: string) => void;
  onQuantityChange?: (id: string, value: string) => void;
}

export default function MultiSelectModal({
  visible,
  title,
  options,
  selectedIds,
  quantities = {},
  onClose,
  onToggle,
  onQuantityChange,
}: MultiSelectModalProps) {
  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <Pressable className="flex-1 justify-end bg-black/80" onPress={onClose}>
        <Pressable className="h-[80%] rounded-t-3xl bg-zinc-900 p-6 pb-10">
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
                const quantity = quantities[item.id] || '';

                return (
                  <View className="border-b border-zinc-800 py-3">
                    {/* Área Clicável para selecionar/deselecionar */}
                    <TouchableOpacity
                      onPress={() => onToggle(item.id)}
                      className="flex-row items-center justify-between py-1 active:bg-zinc-800">
                      <Text
                        className={`flex-1 pr-2 text-lg ${
                          isSelected ? 'font-bold text-green-500' : 'text-zinc-200'
                        }`}>
                        {item.name}{' '}
                        {item.brand ? (
                          <Text className="text-sm font-normal text-zinc-500">({item.brand})</Text>
                        ) : (
                          ''
                        )}
                      </Text>
                      {isSelected && <Feather name="check-circle" size={24} color="#22c55e" />}
                    </TouchableOpacity>

                    {/* INPUT DE QUANTIDADE: Só aparece se o item estiver selecionado */}
                    {isSelected && onQuantityChange && (
                      <View className="mt-2 flex-row pl-2 pr-8">
                        <View className="mr-2 mt-2 border-l-2 border-zinc-700/50 pl-2"></View>
                        <TextInput
                          placeholder="Quantity (e.g. 2 un, 500g)"
                          placeholderTextColor="#52525b"
                          value={quantity}
                          onChangeText={(text) => onQuantityChange(item.id, text)}
                          className="flex-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-100 focus:border-green-500"
                          returnKeyType="done"
                        />
                      </View>
                    )}
                  </View>
                );
              }}
            />
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
