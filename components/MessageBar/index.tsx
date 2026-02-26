import React, { useCallback, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { dismissTutorial, hasDismissedTutorial } from 'services/tutorial-service';

interface MessageBarProps {
  id: string;
  title?: string;
  message: string;
}

export default function MessageBar({ id, title, message }: MessageBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function checkStatus() {
        const dismissed = await hasDismissedTutorial(id);
        // Toda vez que a tela abrir, ele reavalia se deve ou não mostrar
        setIsVisible(!dismissed);
      }
      checkStatus();
    }, [id])
  );

  const handleClose = async () => {
    setIsVisible(false);
    await dismissTutorial(id);
  };

  if (!isVisible) return null;

  return (
    <View
      className={`w-full flex-row items-start rounded-b-lg rounded-t-none border border-blue-800/50 bg-blue-900/20 p-4`}>
      <View className="mr-3 mt-0.5">
        <Feather name="info" size={20} color="#60a5fa" />
      </View>

      <View className="flex-1 pr-2">
        {title && <Text className={`mb-1 text-base font-bold text-blue-100`}>{title}</Text>}
        <Text className={`text-sm leading-5 text-blue-100 opacity-90`}>{message}</Text>
      </View>

      <Pressable
        onPress={handleClose}
        className="ml-2 rounded-full p-1 active:bg-black/20"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Feather name="x" size={20} color="#60a5fa" style={{ opacity: 0.7 }} />
      </Pressable>
    </View>
  );
}
