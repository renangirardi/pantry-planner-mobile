import React from 'react';
import { View, Text, Modal as RNModal, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();

  return (
    <RNModal visible={isOpen} transparent animationType="slide">
      <Pressable className="flex-1 justify-end bg-black/80" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl bg-zinc-900 p-6 shadow-xl"
          style={{ paddingBottom: insets.bottom + 24 }}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">{title}</Text>
            <Pressable onPress={onClose} className="-mr-2 p-2">
              <Feather name="x" size={24} color="#a1a1aa" />
            </Pressable>
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
