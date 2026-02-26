import React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from 'utils/toastConfig';

interface ContextualShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function ContextualShortcutModal({
  isOpen,
  onClose,
  title,
  children,
}: ContextualShortcutModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <RNModal visible={isOpen} animationType="slide" transparent>
      {/* O KeyboardAvoidingView empurra o modal para cima quando o teclado abre */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-end bg-black/80">
          {/* h-[80%] garante que o formulário tenha espaço suficiente sem esmagar */}
          <View
            className="h-[80%] rounded-t-3xl bg-zinc-900 p-6 shadow-xl"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}>
            {/* CABEÇALHO */}
            <View className="mb-6 flex-row items-center justify-between border-b border-zinc-800 pb-4">
              <Text className="text-2xl font-bold text-white">{title}</Text>
              <Pressable onPress={onClose} className="-mr-2 p-2 active:opacity-50">
                <Feather name="x" size={24} color="#a1a1aa" />
              </Pressable>
            </View>

            {/* CONTEÚDO (Onde o CategoryForm ou MarketForm vai entrar) */}
            <View className="flex-1">{children}</View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <Toast config={toastConfig} />
    </RNModal>
  );
}
