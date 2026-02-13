import { ReactNode } from 'react';
import { Modal as RNModal, View, Text } from 'react-native';

import Button from 'components/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  isLoading = false,
}: ModalProps) {
  return (
    <RNModal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/60 p-6">
        <View className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
          <Text className="mb-2 text-xl font-bold text-[#ededed]">{title}</Text>

          <View className="mb-6">
            <Text className="text-base text-[#ededed]">{children}</Text>
          </View>

          <View className="flex-row justify-end gap-3">
            <View className="flex-1">
              <Button variant="secondary" onPress={onClose} disabled={isLoading}>
                Cancel
              </Button>
            </View>

            <View className="flex-1">
              <Button variant="danger" onPress={onConfirm} disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Confirm'}
              </Button>
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
