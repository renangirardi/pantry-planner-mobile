import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface TextAreaProps extends TextInputProps {
  children: React.ReactNode;
  id: string;
  name: string;
  onChangeText?: (text: string) => void;
  required?: boolean;
}

export default function TextArea({
  children,
  id,
  name,
  placeholder,
  defaultValue,
  onChangeText,
  required,
  ...rest
}: TextAreaProps) {
  return (
    <View className="mb-4 flex flex-col gap-1">
      <Text className="mb-1 text-left text-sm font-medium text-zinc-300">{children}</Text>

      <TextInput
        id={id}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top"
        placeholder={placeholder}
        placeholderTextColor="#a1a1aa"
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        className="h-32 rounded-lg border border-zinc-700 bg-zinc-800  px-4 py-3 text-zinc-100 focus:border-green-500"
        {...rest}
      />
    </View>
  );
}
