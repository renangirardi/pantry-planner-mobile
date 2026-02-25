import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import MiniButton from 'components/MiniButton';
import Search from 'components/Search';

interface SingleSelectModalProps {
  visible: boolean;
  title: string;
  options: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
  onCreateNew?: () => void;
  createNewText?: string;
  area?: 'default' | 'shopping' | 'pantry' | 'categories' | 'market';
}

export default function SingleSelectModal({
  visible,
  title,
  options,
  onClose,
  onSelect,
  onCreateNew,
  createNewText,
  area = 'default',
}: SingleSelectModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
          <View className="h-[80%] rounded-t-3xl bg-zinc-900 p-6 pt-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white">{title}</Text>
              <Pressable onPress={handleClose} className="p-2 active:opacity-50">
                <Feather name="x" size={24} color="#a1a1aa" />
              </Pressable>
            </View>

            <Search
              placeholder="Type to filter..."
              useUrlParams={false}
              onChange={setSearchQuery}
            />

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
                {searchQuery ? 'No matches found.' : 'No options available.'}
              </Text>
            ) : (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item: any) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      handleClose();
                      onSelect(item);
                    }}
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
      </KeyboardAvoidingView>
    </RNModal>
  );
}
