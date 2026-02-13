import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RadioButtonsProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RadioButtons({ options, selected, onChange, label }: RadioButtonsProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</Text>
      )}

      <View className="flex-row gap-2">
        {options.map((option) => {
          const isSelected = selected.toLowerCase() === option.toLowerCase();

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option.toLowerCase())}
              className={`flex-1 flex-row items-center justify-center rounded-lg border px-4 py-3 ${
                isSelected ? 'border-green-600 bg-green-600' : 'border-zinc-700 bg-zinc-800'
              }`}>
              <View
                className={`mr-2 flex h-4 w-4 items-center justify-center rounded-full border ${
                  isSelected ? 'border-white' : 'border-zinc-500'
                }`}>
                {isSelected && <View className="h-2 w-2 rounded-full bg-white" />}
              </View>

              <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
