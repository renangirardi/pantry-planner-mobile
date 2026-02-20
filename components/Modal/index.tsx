import React from 'react';
import { View, Text, Modal as RNModal } from 'react-native';

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
    <RNModal visible={isOpen} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <View className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <Text className="mb-4 text-xl font-bold text-zinc-100">{title}</Text>

          <View className={hideFooter ? '' : 'mb-8'}>{children}</View>

          {!hideFooter && (
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Button variant="secondary" onPress={onClose} disabled={isLoading}>
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
        </View>
      </View>
    </RNModal>
  );
}
