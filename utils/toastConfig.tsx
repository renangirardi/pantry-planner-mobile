import React from 'react';
import { View, Text } from 'react-native';
import { ToastConfigParams } from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';
import { AREA_THEMES, AppArea } from './area-themes';

export const toastConfig = {
  customSuccess: ({ text1, text2, props }: ToastConfigParams<any>) => {
    const area: AppArea = props?.area || 'default';
    const theme = AREA_THEMES[area] || AREA_THEMES.default;

    return (
      <View
        className="ml-4 mr-4 w-[90%] flex-row items-center gap-4 rounded-xl bg-zinc-800 p-4 shadow-xl"
        style={{ borderLeftWidth: 4, borderLeftColor: theme.hexColor }}>
        <Feather name={props?.icon || 'check-circle'} size={24} color={theme.hexColor} />
        <View className="ml-3 flex-1">
          <Text className="text-lg font-bold text-zinc-100">{text1}</Text>
          {text2 && <Text className="mt-1 text-base text-zinc-400">{text2}</Text>}
        </View>
      </View>
    );
  },

  customError: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View
      className="ml-4 mr-4 w-[90%] flex-row items-center gap-4 rounded-xl bg-zinc-800 p-4 shadow-xl"
      style={{ borderLeftWidth: 4, borderLeftColor: '#ef4444' }}>
      <Feather name="alert-triangle" size={24} color="#ef4444" />
      <View className="ml-3 flex-1">
        <Text className="text-lg font-bold text-zinc-100">{text1}</Text>
        {text2 && <Text className="mt-1 text-base text-zinc-400">{text2}</Text>}
      </View>
    </View>
  ),
};
