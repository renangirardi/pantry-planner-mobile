import React from 'react';
import { View, Text, Modal as RNModal, Pressable, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Button from 'components/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  confirmText?: string;
  confirmVariant?: 'primary' | 'danger';
  hideFooter?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isLoading = false,
  confirmText = 'Delete',
  confirmVariant = 'danger',
  hideFooter = false,
}: ModalProps) {
  return (
    <RNModal visible={isOpen} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/80" onPress={onClose}>
        <Pressable className="rounded-t-3xl bg-zinc-900 p-6 pb-10 shadow-xl">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <TouchableOpacity onPress={onClose} className="-mr-2 p-2">
              <Feather name="x" size={24} color="#a1a1aa" />
            </TouchableOpacity>
          </View>

          <View className={hideFooter ? '' : 'mb-8'}>{children}</View>

          {!hideFooter && (
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Button area="default" variant="secondary" onPress={onClose} disabled={isLoading}>
                  Cancel
                </Button>
              </View>
              <View className="flex-1">
                <Button variant={confirmVariant} onPress={onConfirm} disabled={isLoading}>
                  {isLoading ? 'Wait...' : confirmText}
                </Button>
              </View>
            </View>
          )}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
