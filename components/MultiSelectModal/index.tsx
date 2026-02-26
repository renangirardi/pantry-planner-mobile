import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  FlatList,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Search from 'components/Search';
import MiniButton from 'components/MiniButton';

interface MultiSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  selectedIds: string[];
  quantities?: Record<string, string>;
  onClose: () => void;
  onToggle: (id: string) => void;
  onQuantityChange?: (id: string, value: string) => void;
  // Novas propriedades para o atalho contextual
  onCreateNew?: () => void;
  createNewText?: string;
  area?: 'default' | 'market' | 'pantry' | 'shopping' | 'categories';
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
  onCreateNew,
  createNewText,
  area = 'default', // Caso você queira usar as cores temáticas no futuro
}: MultiSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [options, searchQuery]);

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  return (
    <RNModal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-end bg-black/80">
          <View className="h-[85%] rounded-t-3xl bg-zinc-900 p-6 pb-10">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">{title}</Text>
              <Pressable onPress={handleClose} className={`rounded-full bg-teal-600 px-4 py-2`}>
                <Text className="font-bold text-white">Done</Text>
              </Pressable>
            </View>

            {options.length > 0 && (
              <View className="mb-4">
                <Search
                  placeholder="Search items..."
                  useUrlParams={false}
                  onChange={setSearchQuery}
                />
              </View>
            )}

            {/* Botão de Atalho Contextual */}
            {onCreateNew && createNewText && (
              <MiniButton
                icon="plus"
                label={createNewText}
                onPress={() => {
                  handleClose();
                  setTimeout(onCreateNew, 100);
                }}
                className="mb-4"
                area={area === 'default' ? 'default' : area}
              />
            )}

            {filteredOptions.length === 0 ? (
              <Text className="mt-10 text-center text-zinc-500">
                {searchQuery ? 'No matches found.' : 'No items available in your pantry.'}
              </Text>
            ) : (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item: any) => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = selectedIds.includes(item.id);
                  const quantity = quantities[item.id] || '';

                  return (
                    <View className="border-b border-zinc-800 py-3">
                      <Pressable
                        onPress={() => onToggle(item.id)}
                        className="flex-row items-center justify-between py-1 active:bg-zinc-800">
                        <Text
                          className={`flex-1 pr-2 text-lg ${
                            isSelected ? 'font-bold text-teal-400' : 'text-zinc-200'
                          }`}>
                          {item.name}{' '}
                          {item.brand ? (
                            <Text className="text-sm font-normal text-zinc-500">
                              ({item.brand})
                            </Text>
                          ) : (
                            ''
                          )}
                        </Text>
                        {isSelected && <Feather name="check-circle" size={24} color="#00d5be" />}
                      </Pressable>

                      {isSelected && onQuantityChange && (
                        <View className="mt-2 flex-row pl-2 pr-8">
                          <View className="mr-2 mt-2 border-l-2 border-zinc-700/50 pl-2"></View>
                          <TextInput
                            placeholder="Quantity (e.g. 2 un, 500g)"
                            placeholderTextColor="#52525b"
                            value={quantity}
                            onChangeText={(text) => onQuantityChange(item.id, text)}
                            className="flex-1 rounded-md border border-zinc-700 bg-zinc-800/80 px-3 py-2 text-sm text-zinc-100 focus:border-teal-500"
                            returnKeyType="done"
                          />
                        </View>
                      )}
                    </View>
                  );
                }}
              />
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}
